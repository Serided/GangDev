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
            <tr style="position: absolute">
                <th class="id">ID</th>
                <th class="name">Name</th>
                <th class="key">Key</th>
                <th>D</th>
                <th>T</th>
                <th>C</th>
                <th>M</th>
                <th>U</th>
                <th>R</th>
                <th class="categories">Categories</th>
                <th class="actions">Actions</th>
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
            <div>
                <input type="number" id="championId" placeholder="ID" required>
                <input type="text" id="championName" placeholder="Name" required>
                <input type="text" id="championKey" placeholder="Key" required>
            </div>
            <br>

            <div class="center">
                <table>
                    <tbody>
                        <tr class="stat-group">
                            <td>Damage:</td>
                            <td><input type="range" id="damageSlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="damageNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                        <tr class="stat-group">
                            <td>Toughness:</td>
                            <td><input type="range" id="toughnessSlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="toughnessNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                        <tr class="stat-group">
                            <td>CC:</td>
                            <td><input type="range" id="ccSlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="ccNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                        <tr class="stat-group">
                            <td>Mobility:</td>
                            <td><input type="range" id="mobilitySlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="mobilityNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                        <tr class="stat-group">
                            <td>Utility:</td>
                            <td><input type="range" id="utilitySlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="utilityNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                        <tr class="stat-group">
                            <td>Range:</td>
                            <td><input type="range" id="rangeSlider" min="0" max="3" step="1" value="1"></td>
                            <td><input type="number" id="rangeNumber" min="0" max="3" step="1" value="1"></td>
                        </tr>
                    </tbody>
                </table>
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
                        <option value="">-- Select Value --</option>
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
    <br>

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
