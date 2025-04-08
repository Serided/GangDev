// script.js
let championList = [];
let editingIndex = -1;

function updateTable() {
    const tbody = document.querySelector("#championTable tbody");
    tbody.innerHTML = "";
    championList.forEach((champ, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${champ.id}</td>
            <td>${champ.name}</td>
            <td>${champ.damageTypes.join(", ")}</td>
            <td>${champ.positions.join(", ")}</td>
            <td>${champ.archetypes.join(", ")}</td>
            <td>${champ.teamComp.join(", ")}</td>
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
    editingIndex = -1;
}

document.getElementById("championForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("championId").value);
    const name = document.getElementById("championName").value.trim();

    // Get damage types
    const damageTypes = Array.from(document.querySelectorAll('input[name="damageType[]"]:checked')).map(el => el.value);

    // Get positions
    const positions = Array.from(document.querySelectorAll('input[name="positions[]"]:checked')).map(el => el.value);

    // Get champion archetypes
    const archetypes = Array.from(document.querySelectorAll('input[name="archetypes[]"]:checked')).map(el => el.value);

    // Get team comp
    const teamComp = Array.from(document.querySelectorAll('input[name="teamComp[]"]:checked')).map(el => el.value);

    const champion = { id, name, damageTypes, positions, archetypes, teamComp };

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

    // Set damage type checkboxes.
    document.querySelectorAll('input[name="damageType[]"]').forEach(input => {
        input.checked = champ.damageTypes.includes(input.value);
    });

    // Set positions checkboxes.
    document.querySelectorAll('input[name="positions[]"]').forEach(input => {
        input.checked = champ.positions.includes(input.value);
    });

    // Set champion archetypes checkboxes.
    document.querySelectorAll('input[name="archetypes[]"]').forEach(input => {
        input.checked = champ.archetypes.includes(input.value);
    });

    // Set team comp checkboxes.
    document.querySelectorAll('input[name="teamComp[]"]').forEach(input => {
        input.checked = champ.teamComp.includes(input.value);
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

document.getElementById("importBtn").addEventListener("click", function() {
    const text = document.getElementById("importExportArea").value;
    try {
        const importedList = JSON.parse(text);
        if (Array.isArray(importedList)) {
            championList = importedList;
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
