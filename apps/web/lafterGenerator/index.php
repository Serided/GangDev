<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Champion List Generator</title>
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
						<th>Roles</th>
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
					<label>Damage Type:</label>
					<select id="damageType" multiple size="2">
						<option value="ap">AP</option>
						<option value="ad">AD</option>
					</select>
					<br>
					<label>Roles:</label>
					<select id="roles" multiple size="5">
						<option value="top">Top</option>
						<option value="jg">Jungle</option>
						<option value="mid">Mid</option>
						<option value="supp">Support</option>
						<option value="bot">ADC/Bot</option>
					</select>
					<br>
					<label>Team Comp:</label>
					<select id="teamComp" required>
						<option value="">Select</option>
						<option value="dive">Dive</option>
						<option value="peel">Peel</option>
						<option value="kite">Kite</option>
					</select>
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
