<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Game Engine (Alpha)</title>
	<link rel="stylesheet" href="style.css">
</head>
    <body>
        <div class="custom_values">
            <label class="label_size" id="gResult">Gravity = 10</label>
            <input type="text" id="gInput" placeholder="default=10" class="input_size" style="margin-right: 0">
            <button onclick="getGravity()" class="input_size fancy_button" style="margin-left: 0">Submit</button>
        </div>
        <div class="custom_values">
            <label class="label_size" id="sResult">Speed = 1</label>
            <input type="text" id="sInput" placeholder="default=1" class="input_size" style="margin-right: 0">
            <button onclick="getSpeed()" class="input_size fancy_button" style="margin-left: 0">Submit</button>
        </div>
        <canvas id="game"></canvas>
        <script src="script.js"></script>
    </body>
</html>