<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lafter Generator</title>
	<?= $head ?>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?= $navbar ?>
<?= $warn ?>

<div class="sect two single">
    <h1>Champion List Generator</h1>

    <h2>Champion List (<span id="listLength">0</span> entries)</h2>
    <div id="tableContainer">
        <table id="championTable">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Key</th>
                <th>D</th>
                <th>T</th>
                <th>C</th>
                <th>M</th>
                <th>U</th>
                <th>R</th>
                <th>Categories</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <!-- Table rows inserted dynamically -->
            </tbody>
        </table>
    </div>

    <!-- Add/Edit Champion Form -->
    <div>
        <h2>Add/Edit Champion</h2>
        <form id="championForm">
            <input type="number" id="championId" placeholder="ID" required>
            <input type="text" id="championName" placeholder="Name" required>
            <input type="text" id="championKey" placeholder="Key" required>
            <br>

            <!-- Numeric Stat Inputs with Sliders -->
            <div class="stat-group">
                <label>Damage:</label>
                <input type="range" id="damageSlider" min="1" max="3" step="1" value="1">
                <input type="number" id="damageNumber" min="1" max="3" step="1" value="1">
            </div>
            <div class="stat-group">
                <label>Toughness:</label>
                <input type="range" id="toughnessSlider" min="1" max="3" step="1" value="1">
                <input type="number" id="toughnessNumber" min="1" max="3" step="1" value="1">
            </div>
            <div class="stat-group">
                <label>CC:</label>
                <input type="range" id="ccSlider" min="1" max="3" step="1" value="1">
                <input type="number" id="ccNumber" min="1" max="3" step="1" value="1">
            </div>
            <div class="stat-group">
                <label>Mobility:</label>
                <input type="range" id="mobilitySlider" min="1" max="3" step="1" value="1">
                <input type="number" id="mobilityNumber" min="1" max="3" step="1" value="1">
            </div>
            <div class="stat-group">
                <label>Utility:</label>
                <input type="range" id="utilitySlider" min="1" max="3" step="1" value="1">
                <input type="number" id="utilityNumber" min="1" max="3" step="1" value="1">
            </div>
            <div class="stat-group">
                <label>Range:</label>
                <input type="range" id="rangeSlider" min="1" max="3" step="1" value="1">
                <input type="number" id="rangeNumber" min="1" max="3" step="1" value="1">
            </div>
            <br>

            <div id="categoryContainer">
                <h3>Add Category</h3>
                <div id="categoryForm">
                    <select id="categoryType">
                        <option value="">-- Select Type --</option>
                        <option value="tank">tank</option>
                        <option value="fighter">fighter</option>
                        <option value="burst">burst</option>
                        <option value="dps">dps</option>
                        <option value="utility">utility</option>
                    </select>

                    <select id="categorySub">
                        <option value="">-- Select Type --</option>
                    </select>

                    <button type="button" class="small btn" id="addCategoryBtn">Add</button>
                </div>
                <!-- This container will show the selected category pairs -->
                <div id="selectedCategories"></div>
            </div>
            <br>

            <button type="submit" class="btn" id="saveChampion">Save</button>
            <button type="button" class="btn" id="clearForm">Clear</button>
        </form>
    </div>

    <!-- Import/Export Section -->
    <div>
        <h2>Import/Export</h2>
        <textarea id="importExportArea" rows="10" cols="50" placeholder="Paste JSON here"></textarea><br>
        <button class="btn" id="importBtn">Import List</button>
        <button class="btn" id="exportBtn">Export List</button>
    </div>
</div>

<?= $footer ?>
<script src="script.js"></script>
</body>
</html>
