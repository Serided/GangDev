document.addEventListener("DOMContentLoaded", function() {
    let championList = [];
    let editingIndex = -1;

    // Default values for new numeric stat keys.
    const defaultStats = {
        damage: 1,
        toughness: 1,
        cc: 1,
        mobility: 1,
        utility: 1,
        range: 1
    };

    // Update the table. Column order:
    // ID, Name, Toughness, CC, Mobility, Utility, Range, Damage, Type, Actions.
    function updateTable() {
        const tbody = document.querySelector("#championTable tbody");
        if (!tbody) {
            console.error("Champion table body not found.");
            return;
        }
        tbody.innerHTML = "";
        championList.forEach((champ, index) => {
            // Ensure checkbox arrays exist.
            const dmgTypes = (champ.damageTypes || []);
            const dmgApp = (champ.damageApplication || []);
            // For the "Type" column, we want to show only the damage application
            // (e.g., "Burst" or "DPS") plus the damage type if needed.
            const typeText = `${dmgTypes.join(", ")}` +
                (dmgApp.length ? `; ${dmgApp.join(", ")}` : "");
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${champ.id}</td>
                <td>${champ.name}</td>
                <td>${champ.toughness}</td>
                <td>${champ.cc}</td>
                <td>${champ.mobility}</td>
                <td>${champ.utility}</td>
                <td>${champ.range}</td>
                <td>${champ.damage}</td>
                <td>${typeText}</td>
                <td>
                    <button class="btn" onclick="editChampion(${index})">Edit</button>
                    <button class="btn" onclick="removeChampion(${index})">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById("listLength").textContent = championList.length;
    }

    function clearForm() {
        document.getElementById("championForm").reset();
        // Reset all sliders/number inputs to default values.
        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = defaultStats[stat];
            document.getElementById(stat + "Number").value = defaultStats[stat];
        });
        editingIndex = -1;
    }

    // Synchronize slider and number fields for a given stat.
    function syncInput(stat) {
        const slider = document.getElementById(stat + "Slider");
        const number = document.getElementById(stat + "Number");
        if (!slider || !number) return;
        slider.addEventListener("input", () => {
            number.value = slider.value;
        });
        number.addEventListener("input", () => {
            slider.value = number.value;
        });
    }
    ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(syncInput);

    document.getElementById("championForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById("championId").value);
        const name = document.getElementById("championName").value.trim();

        // Get stat values from number inputs.
        const damage = parseInt(document.getElementById("damageNumber").value);
        const toughness = parseInt(document.getElementById("toughnessNumber").value);
        const cc = parseInt(document.getElementById("ccNumber").value);
        const mobility = parseInt(document.getElementById("mobilityNumber").value);
        const utility = parseInt(document.getElementById("utilityNumber").value);
        const rangeVal = parseInt(document.getElementById("rangeNumber").value);

        // Validation: require at least one damage type.
        const damageTypes = Array.from(document.querySelectorAll('input[name="damageType[]"]:checked')).map(el => el.value);
        if (damageTypes.length === 0) {
            alert("Please select at least one Damage Type.");
            return;
        }

        // Require a damage application selection (radio; should be exactly one).
        const damageApplication = Array.from(document.querySelectorAll('input[name="damageApplication[]"]:checked')).map(el => el.value);
        if (damageApplication.length === 0) {
            alert("Please select a Damage Application (Burst or DPS).");
            return;
        }

        const champion = {
            id,
            name,
            damage,
            toughness,
            cc,
            mobility,
            utility,
            range: rangeVal,
            damageTypes,
            damageApplication
        };

        if (editingIndex >= 0) {
            championList[editingIndex] = champion;
        } else {
            championList.push(champion);
        }
        updateTable();
        clearForm();
    });

    // Expose editChampion and removeChampion as global functions.
    window.editChampion = function(index) {
        const champ = championList[index];
        document.getElementById("championId").value = champ.id;
        document.getElementById("championName").value = champ.name;

        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = champ[stat] || defaultStats[stat];
            document.getElementById(stat + "Number").value = champ[stat] || defaultStats[stat];
        });

        document.querySelectorAll('input[name="damageType[]"]').forEach(input => {
            input.checked = champ.damageTypes && champ.damageTypes.includes(input.value);
        });
        document.querySelectorAll('input[name="damageApplication[]"]').forEach(input => {
            input.checked = champ.damageApplication && champ.damageApplication.includes(input.value);
        });

        editingIndex = index;
    };

    window.removeChampion = function(index) {
        if (confirm("Are you sure you want to remove this champion?")) {
            championList.splice(index, 1);
            updateTable();
        }
    };

    document.getElementById("clearForm").addEventListener("click", clearForm);

    // When importing, ensure missing stat keys are added.
    function ensureChampionDefaults(champion) {
        Object.keys(defaultStats).forEach(key => {
            if (champion[key] === undefined) {
                champion[key] = defaultStats[key];
            }
        });
        if (!champion.damageTypes) champion.damageTypes = [];
        if (!champion.damageApplication) champion.damageApplication = [];
        return champion;
    }

    document.getElementById("importBtn").addEventListener("click", function() {
        const text = document.getElementById("importExportArea").value;
        try {
            const importedList = JSON.parse(text);
            if (Array.isArray(importedList)) {
                championList = importedList.map(champ => ensureChampionDefaults(champ));
                updateTable();
            } else {
                alert("Invalid format: Expected an array.");
            }
        } catch (e) {
            alert("Error parsing JSON: " + e.message);
        }
    });

    document.getElementById("exportBtn").addEventListener("click", function() {
        document.getElementById("importExportArea").value = JSON.stringify(championList, null, 2);
    });

    // Initialize the table on page load.
    updateTable();
});
