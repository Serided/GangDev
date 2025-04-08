document.addEventListener("DOMContentLoaded", function() {
    let championList = [];
    let editingIndex = -1;

    // Default values for numeric stat keys.
    const defaultStats = {
        damage: 1,
        toughness: 1,
        cc: 1,
        mobility: 1,
        utility: 1,
        range: 1
    };

    // Update the champion table using these columns:
    // ID, Name, Toughness, CC, Mobility, Utility, Range, Damage, Damage Type, Damage Application, Actions.
    function updateTable() {
        const tbody = document.querySelector("#championTable tbody");
        if (!tbody) {
            console.error("Champion table body not found.");
            return;
        }
        tbody.innerHTML = "";
        championList.forEach((champ, index) => {
            const dmgTypes = (champ.damageTypes || []);
            const dmgApp = (champ.damageApplication || "");  // now a string
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${champ.id}</td>
                <td>${champ.name}</td>
                <td>${champ.damage}</td>
                <td>${champ.toughness}</td>
                <td>${champ.cc}</td>
                <td>${champ.mobility}</td>
                <td>${champ.utility}</td>
                <td>${champ.range}</td>
                <td>${dmgTypes.join(", ")}</td>
                <td>${dmgApp}</td>
                <td style="display: flex">
                    <button class="btn" onclick="editChampion(${index})">Edit</button>
                    <button class="btn" onclick="removeChampion(${index})">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById("listLength").textContent = championList.length;
    }

    // Clear the form and reset slider/number pairs.
    function clearForm() {
        document.getElementById("championForm").reset();
        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = defaultStats[stat];
            document.getElementById(stat + "Number").value = defaultStats[stat];
        });
        editingIndex = -1;
    }

    // Synchronize slider and number fields for each stat.
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

        // Get numeric stat values.
        const damage = parseInt(document.getElementById("damageNumber").value);
        const toughness = parseInt(document.getElementById("toughnessNumber").value);
        const cc = parseInt(document.getElementById("ccNumber").value);
        const mobility = parseInt(document.getElementById("mobilityNumber").value);
        const utility = parseInt(document.getElementById("utilityNumber").value);
        const rangeVal = parseInt(document.getElementById("rangeNumber").value);

        // Get Damage Type(s) from checkboxes.
        const damageTypes = Array.from(document.querySelectorAll('input[name="damageType[]"]:checked')).map(el => el.value);
        if(damageTypes.length === 0) {
            alert("Please select at least one Damage Type (Physical or Magic).");
            return;
        }

        // Get Damage Application from radio input (single selection).
        const dmgAppElem = document.querySelector('input[name="damageApplication"]:checked');
        if(!dmgAppElem) {
            alert("Please select a Damage Application (Burst or DPS).");
            return;
        }
        const damageApplication = dmgAppElem.value;

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

        if(editingIndex >= 0) {
            championList[editingIndex] = champion;
        } else {
            championList.push(champion);
        }
        updateTable();
        clearForm();
    });

    // Expose editChampion and removeChampion to global scope.
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
        // For damageApplication, set the radio button.
        const dmgAppRadio = document.querySelector(`input[name="damageApplication"][value="${champ.damageApplication}"]`);
        if(dmgAppRadio) {
            dmgAppRadio.checked = true;
        }
        editingIndex = index;
    };

    window.removeChampion = function(index) {
        if(confirm("Are you sure you want to remove this champion?")) {
            championList.splice(index, 1);
            updateTable();
        }
    };

    document.getElementById("clearForm").addEventListener("click", clearForm);

    // When importing, ensure missing keys are set.
    function ensureChampionDefaults(champion) {
        Object.keys(defaultStats).forEach(key => {
            if(champion[key] === undefined) {
                champion[key] = defaultStats[key];
            }
        });
        if(!champion.damageTypes) champion.damageTypes = [];
        // For damageApplication, if missing, set to an empty string.
        if(champion.damageApplication === undefined) champion.damageApplication = "";
        return champion;
    }

    document.getElementById("importBtn").addEventListener("click", function() {
        const text = document.getElementById("importExportArea").value;
        try {
            const importedList = JSON.parse(text);
            if(Array.isArray(importedList)) {
                championList = importedList.map(champ => ensureChampionDefaults(champ));
                updateTable();
            } else {
                alert("Invalid format: Expected an array.");
            }
        } catch(e) {
            alert("Error parsing JSON: " + e.message);
        }
    });

    document.getElementById("exportBtn").addEventListener("click", function() {
        document.getElementById("importExportArea").value = JSON.stringify(championList, null, 2);
    });

    updateTable();
});
