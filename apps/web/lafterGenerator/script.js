document.addEventListener("DOMContentLoaded", function() {
    let championList = [];
    let editingIndex = -1;

    // Default values for new stat keys.
    const defaultStats = {
        damage: 1,
        toughness: 1,
        cc: 1,
        mobility: 1,
        utility: 1,
        range: 1
    };

    // Update the champion table to match the header order:
    // ID, Name, Toughness, CC, Mobility, Utility, Range, D, Type, Actions.
    function updateTable() {
        const tbody = document.querySelector("#championTable tbody");
        if (!tbody) {
            console.error("Champion table body not found.");
            return;
        }
        tbody.innerHTML = "";
        championList.forEach((champ, index) => {
            // Use empty arrays as default for checkbox groups.
            const dmgTypes = champ.damageTypes || [];
            const dmgApp = champ.damageApplication || [];
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
                <td>DT: ${dmgTypes.join(", ")}; DA: ${dmgApp.join(", ")}</td>
                <td style="display: flex">
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
        // Reset each slider/number pair to default value (1)
        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = defaultStats[stat];
            document.getElementById(stat + "Number").value = defaultStats[stat];
        });
        editingIndex = -1;
    }

    // Synchronize slider and number fields.
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

    // Submit form event: create champion object.
    document.getElementById("championForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById("championId").value);
        const name = document.getElementById("championName").value.trim();

        // Get numeric stats from the corresponding number inputs.
        const damage = parseInt(document.getElementById("damageNumber").value);
        const toughness = parseInt(document.getElementById("toughnessNumber").value);
        const cc = parseInt(document.getElementById("ccNumber").value);
        const mobility = parseInt(document.getElementById("mobilityNumber").value);
        const utility = parseInt(document.getElementById("utilityNumber").value);
        const rangeVal = parseInt(document.getElementById("rangeNumber").value);

        // Get checkbox groups.
        const damageTypes = Array.from(document.querySelectorAll('input[name="damageType[]"]:checked')).map(el => el.value);
        const damageApplication = Array.from(document.querySelectorAll('input[name="damageApplication[]"]:checked')).map(el => el.value);

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

    // Expose editChampion and removeChampion as globals.
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

    // When importing JSON, ensure missing stat keys are added.
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
