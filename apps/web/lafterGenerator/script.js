// script.js

let championList = [];
let editingIndex = -1;

// List of mandatory stat keys and their default values
const defaultStats = {
    damage: 1,
    toughness: 1,
    cc: 1,
    mobility: 1,
    utility: 1,
    range: 1
};

function updateTable() {
    const tbody = document.querySelector("#championTable tbody");
    tbody.innerHTML = "";
    championList.forEach((champ, index) => {
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
            <td>${champ.damageTypes.join(", ")}</td>
            <td>${champ.damageApplication.join(", ")}</td>
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
    // Reset all sliders to default 1
    ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
        document.getElementById(stat + "Slider").value = 1;
        document.getElementById(stat + "Number").value = 1;
    });
    editingIndex = -1;
}

// Sync slider and number fields
function syncInput(stat) {
    const slider = document.getElementById(stat + "Slider");
    const number = document.getElementById(stat + "Number");
    // When slider changes, update number field
    slider.addEventListener("input", () => {
        number.value = slider.value;
    });
    // When number field changes, update slider
    number.addEventListener("input", () => {
        slider.value = number.value;
    });
}

// Initialize sync for each stat
['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(syncInput);

document.getElementById("championForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("championId").value);
    const name = document.getElementById("championName").value.trim();

    // Get slider values (already synced with number inputs)
    const damage = parseInt(document.getElementById("damageNumber").value);
    const toughness = parseInt(document.getElementById("toughnessNumber").value);
    const cc = parseInt(document.getElementById("ccNumber").value);
    const mobility = parseInt(document.getElementById("mobilityNumber").value);
    const utility = parseInt(document.getElementById("utilityNumber").value);
    const rangeVal = parseInt(document.getElementById("rangeNumber").value);

    // Get Damage Types checkboxes
    const damageTypes = Array.from(document.querySelectorAll('input[name="damageType[]"]:checked')).map(el => el.value);

    // Get Positions checkboxes
    const positions = Array.from(document.querySelectorAll('input[name="positions[]"]:checked')).map(el => el.value);

    // Get Champion Archetypes checkboxes
    const archetypes = Array.from(document.querySelectorAll('input[name="archetypes[]"]:checked')).map(el => el.value);

    // Get Team Comp checkboxes
    const teamComp = Array.from(document.querySelectorAll('input[name="teamComp[]"]:checked')).map(el => el.value);

    const champion = {
        id, name,
        damage, toughness, cc, mobility, utility, range: rangeVal,
        damageTypes, positions, archetypes, teamComp
    };

    if (editingIndex >= 0) {
        championList[editingIndex] = champion;
    } else {
        championList.push(champion);
    }
    updateTable();
    clearForm();
});

function editChampion(index) {
    const champ = championList[index];
    document.getElementById("championId").value = champ.id;
    document.getElementById("championName").value = champ.name;

    // Set slider/number for each stat
    ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
        document.getElementById(stat + "Slider").value = champ[stat] || defaultStats[stat];
        document.getElementById(stat + "Number").value = champ[stat] || defaultStats[stat];
    });

    // Set checkboxes for damage types
    document.querySelectorAll('input[name="damageType[]"]').forEach(input => {
        input.checked = champ.damageTypes && champ.damageTypes.includes(input.value);
    });

    // Set checkboxes for positions
    document.querySelectorAll('input[name="positions[]"]').forEach(input => {
        input.checked = champ.positions && champ.positions.includes(input.value);
    });

    // Set checkboxes for archetypes
    document.querySelectorAll('input[name="archetypes[]"]').forEach(input => {
        input.checked = champ.archetypes && champ.archetypes.includes(input.value);
    });

    // Set checkboxes for team comp
    document.querySelectorAll('input[name="teamComp[]"]').forEach(input => {
        input.checked = champ.teamComp && champ.teamComp.includes(input.value);
    });

    editingIndex = index;
}

function removeChampion(index) {
    if (confirm("Are you sure you want to remove this champion?")) {
        championList.splice(index, 1);
        updateTable();
    }
}

document.getElementById("clearForm").addEventListener("click", clearForm);

// When importing, ensure each champion has all required stat keys.
// If any are missing, add default values.
function ensureChampionDefaults(champion) {
    Object.keys(defaultStats).forEach(key => {
        if (champion[key] === undefined) {
            champion[key] = defaultStats[key];
        }
    });
    // Also ensure arrays exist for the checkbox groups:
    if (!champion.damageTypes) champion.damageTypes = [];
    if (!champion.positions) champion.positions = [];
    if (!champion.archetypes) champion.archetypes = [];
    if (!champion.teamComp) champion.teamComp = [];
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
