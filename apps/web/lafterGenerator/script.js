document.addEventListener("DOMContentLoaded", function() {
    // ----- Category Options Mapping -----
    const categoryOptions = {
        dps: ["physical", "magic"],
        burst: ["physical", "magic"],
        tank: ["armor", "magic resist", "health"],
        fighter: ["physical", "magic"],
        utility: ["heal", "shields", "ult"]
    };

    // Array to store added category pairs
    let categoryPairs = [];

    // Reference to the selects and container
    const typeSelect = document.getElementById("categoryType");
    const subSelect = document.getElementById("categorySub");
    const selectedContainer = document.getElementById("selectedCategories");
    const addCategoryBtn = document.getElementById("addCategoryBtn");

    // When category type changes, update sub-select options.
    typeSelect.addEventListener("change", function() {
        const selectedType = typeSelect.value;
        // Clear previous options in subSelect.
        subSelect.innerHTML = `<option value="">-- Select Value --</option>`;
        if (selectedType && categoryOptions[selectedType]) {
            categoryOptions[selectedType].forEach(sub => {
                const opt = document.createElement("option");
                opt.value = sub;
                opt.textContent = sub;
                subSelect.appendChild(opt);
            });
        }
    });

    // Function to update the list display of selected categories.
    function updateSelectedCategoriesDisplay() {
        selectedContainer.innerHTML = "";
        if (categoryPairs.length === 0) {
            selectedContainer.textContent = "No categories added.";
            return;
        }
        const ul = document.createElement("ul");
        categoryPairs.forEach((pair, index) => {
            const li = document.createElement("li");
            li.textContent = `${pair.type}: ${pair.subCategory}`;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.className = "x";
            removeBtn.style.marginLeft = "calc(var(--scaling) * 1)";
            removeBtn.addEventListener("click", function() {
                categoryPairs.splice(index, 1);
                updateSelectedCategoriesDisplay();
            });
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
        selectedContainer.appendChild(ul);
    }

    // Add Category Button handler.
    addCategoryBtn.addEventListener("click", function() {
        const selectedType = typeSelect.value;
        const selectedSub = subSelect.value;
        if (!selectedType || !selectedSub) {
            alert("Please select both type and sub-category.");
            return;
        }
        // Add the pair to the array.
        categoryPairs.push({ type: selectedType, subCategory: selectedSub });
        // Update the display.
        updateSelectedCategoriesDisplay();
        // Reset selects.
        typeSelect.value = "";
        subSelect.innerHTML = `<option value="">-- Select Value --</option>`;
    });

    // ----- Champion Form Code (existing) -----
    let championList = [];
    let editingIndex = -1;

    const defaultStats = {damage: 1, toughness: 1, cc: 1, mobility: 1, utility: 1, range: 1};

    // Synchronize slider and number inputs (code omitted for brevity)
    function syncInput(stat) {
        const slider = document.getElementById(stat + "Slider");
        const number = document.getElementById(stat + "Number");
        if (!slider || !number) return;
        slider.addEventListener("input", () => { number.value = slider.value; });
        number.addEventListener("input", () => { slider.value = number.value; });
    }
    ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(syncInput);

    document.getElementById("championForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById("championId").value);
        const name = document.getElementById("championName").value.trim();
        const key = document.getElementById("championKey").value.trim();
        const damage = parseInt(document.getElementById("damageNumber").value);
        const toughness = parseInt(document.getElementById("toughnessNumber").value);
        const cc = parseInt(document.getElementById("ccNumber").value);
        const mobility = parseInt(document.getElementById("mobilityNumber").value);
        const utility = parseInt(document.getElementById("utilityNumber").value);
        const rangeVal = parseInt(document.getElementById("rangeNumber").value);

        // Build champion object with the categories added.
        const champion = {
            id,
            name,
            key,
            damage,
            toughness,
            cc,
            mobility,
            utility,
            range: rangeVal,
            categories: [...categoryPairs]  // Save the category pairs.
        };

        if (editingIndex >= 0) {
            championList[editingIndex] = champion;
        } else {
            championList.push(champion);
        }
        updateTable();
        clearForm();
    });

    function updateTable() {
        const tbody = document.querySelector("#championTable tbody");
        tbody.innerHTML = "";
        championList.forEach((champ, index) => {
            const tr = document.createElement("tr");
            let categoriesText = "";
            if (champ.categories && Array.isArray(champ.categories)) {
                categoriesText = champ.categories.map(cat => `[${cat.type}: ${cat.subCategory}]`).join(", ");
            }
            tr.innerHTML = `
        <td class="id">${champ.id}</td>
        <td class="name">${champ.name}</td>
        <td class="key">${champ.key}</td>
        <td>${champ.damage}</td>
        <td>${champ.toughness}</td>
        <td>${champ.cc}</td>
        <td>${champ.mobility}</td>
        <td>${champ.utility}</td>
        <td>${champ.range}</td>
        <td class="categories">${categoriesText}</td>
        <td class="actions">
            <button class="action btn" onclick="editChampion(${index})">Edit</button>
            <button class="action btn" onclick="removeChampion(${index})">Remove</button>
        </td>
      `;
            tbody.appendChild(tr);
        });
        document.getElementById("listLength").textContent = championList.length;
    }

    function clearForm() {
        document.getElementById("championForm").reset();
        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = defaultStats[stat];
            document.getElementById(stat + "Number").value = defaultStats[stat];
        });
        document.getElementById("selectedCategories").innerHTML = "";
        categoryPairs = [];
        updateSelectedCategoriesDisplay();
        editingIndex = -1;
    }

    window.editChampion = function(index) {
        document.getElementById("championForm").scrollIntoView({ behavior: "smooth" });
        const champ = championList[index];
        document.getElementById("championId").value = champ.id;
        document.getElementById("championName").value = champ.name;
        document.getElementById("championKey").value = champ.key;
        ['damage', 'toughness', 'cc', 'mobility', 'utility', 'range'].forEach(stat => {
            document.getElementById(stat + "Slider").value = champ[stat] || defaultStats[stat];
            document.getElementById(stat + "Number").value = champ[stat] || defaultStats[stat];
        });
        // Rebuild the categories list.
        categoryPairs = [];
        const catContainer = document.getElementById("selectedCategories");
        catContainer.innerHTML = "";
        if (champ.categories && Array.isArray(champ.categories)) {
            categoryPairs = champ.categories.slice();
            updateSelectedCategoriesDisplay();
        }
        editingIndex = index;
    };

    window.removeChampion = function(index) {
        if (confirm("Are you sure you want to remove this champion?")) {
            championList.splice(index, 1);
            updateTable();
        }
    };

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

    updateTable();
});
