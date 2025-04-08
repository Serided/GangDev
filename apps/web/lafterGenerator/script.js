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
            <td>${champ.roles.join(", ")}</td>
            <td>${champ.teamComp}</td>
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
    const damageTypeSelect = document.getElementById("damageType");
    const damageTypes = Array.from(damageTypeSelect.selectedOptions).map(opt => opt.value);
    const rolesSelect = document.getElementById("roles");
    const roles = Array.from(rolesSelect.selectedOptions).map(opt => opt.value);
    const teamComp = document.getElementById("teamComp").value;

    const champion = { id, name, damageTypes, roles, teamComp };

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
    const damageTypeSelect = document.getElementById("damageType");
    Array.from(damageTypeSelect.options).forEach(opt => {
        opt.selected = champ.damageTypes.includes(opt.value);
    });
    const rolesSelect = document.getElementById("roles");
    Array.from(rolesSelect.options).forEach(opt => {
        opt.selected = champ.roles.includes(opt.value);
    });
    document.getElementById("teamComp").value = champ.teamComp;
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