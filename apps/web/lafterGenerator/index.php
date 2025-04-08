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

    <div>
        <h2>Champion List (<span id="listLength">0</span> entries)</h2>
        <table id="championTable">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Damage Type(s)</th>
                <th>Positions</th>
                <th>Team Comp</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <!-- Table rows inserted dynamically -->
            </tbody>
        </table>
    </div>

    <div>
        <h2>Add/Edit Champion</h2>
        <form id="championForm">
            <input type="number" id="championId" placeholder="ID" required>
            <input type="text" id="championName" placeholder="Name" required>
            <br>
            <!-- Damage Type Checkboxes -->
            <div>
                <label>Damage Type:</label><br>
                <label><input type="checkbox" name="damageType[]" value="ap"> AP</label>
                <label><input type="checkbox" name="damageType[]" value="ad"> AD</label>
            </div>
            <br>
            <!-- Positions (Roles) Checkboxes -->
            <div>
                <label>Positions:</label><br>
                <label><input type="checkbox" name="roles[]" value="top"> Top</label>
                <label><input type="checkbox" name="roles[]" value="jg"> Jungle</label>
                <label><input type="checkbox" name="roles[]" value="mid"> Mid</label>
                <label><input type="checkbox" name="roles[]" value="supp"> Support</label>
                <label><input type="checkbox" name="roles[]" value="bot"> ADC/Bot</label>
            </div>
            <br>
            <!-- Team Comp Checkboxes -->
            <div>
                <label>Team Comp:</label><br>
                <label><input type="checkbox" name="teamComp[]" value="dps"> DPS</label>
                <label><input type="checkbox" name="teamComp[]" value="burst"> Burst</label>
                <label><input type="checkbox" name="teamComp[]" value="tank"> Tank</label>
                <label><input type="checkbox" name="teamComp[]" value="fighter"> Fighter</label>
            </div>
            <br>
            <button type="submit" class="btn" id="saveChampion">Save</button>
            <button type="button" class="btn" id="clearForm">Clear</button>
        </form>
    </div>

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
