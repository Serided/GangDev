/*

Math.ceil() to round up
Math.floor() to round down
Math.abs() to get absolute value

Minecraft chunk stuff
negative is -1 to -16, -17 to -32, etc
positive is 0 to 15, 16 to 31, etc
max size is 256 x 256 = 65536

features:
downloadable as a function file in mcfunction format
base level datapack download that automatically inserts this file?
both a forceload add and forceload remove command generator (inform that it is better used in correlation with previous command and previous coords) (save users previous inputs??)
smooth copy-paste in a special box that is inset
diagram of from where to where it generates the commands (interactive with input to show shape and offset from chunk borders?
option for adding / to each line (for datapack, not for datapack?)
live update
can be longer in one direction

format:
text (/forceload add x1 z1 x2 z2)
text (/forceload remove x1 z1 x2 z2)

attach "(/)forceload add " or "(/)forceload remove " to every line

functionality:
compare to see which one is bottom left (- -)
    x1 compare x2, smaller wins, z1 compare z2, smaller wins
set user inputs to their nearest and biggest possible chunk border
    negative bottom corner use x3 = Math.floor(? / 16) * 16, positive bottom corner use z3 = Math.floor(? / 16) * 16
    negative top corner use x4 = (Math.ceil((? + 1) / 16) * 16) - 1, positive top corner use z4 = (Math.ceil((? + 1) / 16) * 16) - 1

    let output = document.getElementById('output');

    let s = check if they want slash

    x3 = block bottom corner x
    x4 = block top corner x
    z3 = block bottom corner z
    z4 = block top corner z

    mBA = 65536
    mCA = 256
    mBL = 4096
    cW = 16
    mCL = 1

    x = (Math.abs(x2 - x1) + 1)
    z = (Math.abs(z2 - z1) + 1)

    let commands = [];

    if(x * z > mBA) {
        if(x = 16) {
            for(let i = 0; i < Math.floor(z/mBL); i++) {
                z4 += mBL
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1))
                z3 += mBL
            }
            z4 += (((z/mBL) - Math.floor(z/mBL)) * mBL)
            commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1))
        }
        elif(z = 16) {
            for(let i = 0; i < Math.floor(x/mBL); i++) {
                x4 += mBL
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4)
                x3 += mBL
            }
            x4 += (((x/mBL) - Math.floor(x/mBL)) * mBL)
            commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4)
        }
        else {
            if(x <= z) {
                for(let i = 0; i < x/cW; i++) {
                    x4 = x3 + cW
                    for(let i = 0; i < Math.floor(z/mBL); i++) {
                        z4 += mBL
                        commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + (z4 - 1))
                        z3 += mBL
                    }
                    z4 += (((z/mBL) - Math.floor(z/mBL)) * mBL)
                    commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + (z4 - 1))
                    x3 += cW
                }
            }
            else {
                for(let i = 0; i < x/cW; i++) {
                    z4 = z3 + cW
                    for(let i = 0; i < Math.floor(x/mBL); i++) {
                        x4 += mBL
                        commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4)
                        x3 += mBL
                    }
                    x4 += (((x/mBL) - Math.floor(x/mBL)) * mBL);
                    commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4);
                    z3 += cW;
                }
            }
        }
    }

    else {
        commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + z4)
    }

    output.innerHTML = commands.join("/n");

    temp = (Math.abs(x2 - x1) + 1) / 256
    xlarge = Math.floor(temp)
    xsmall = (temp - xlarge) * 256

    temp = (Math.abs(z2 - z1) + 1) / 256
    zlarge = Math.floor(temp)
    zsmall = (temp - zlarge) * 256

    for (let i = 0; i < xlarge; i++) {

    }

    if xlarge = 0:
        Math.floor
        continue


    Math.floor(Math.abs(x2-x1)/256)
    set xsize to 255

figure out distance and determine size of each forceload based on that distance
    x1 - x2, z1 - z2

if (z === cW) {
            for (let i = 0; i < Math.floor(x / mBL); i++) {
                x4 += mBL;
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4);
                x3 += mBL;
            }
            x4 += (((x / mBL) - Math.floor(x / mBL)) * mBL);
            commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4);
        }
        else if(x === cW) {
            for (let i = 0; i < Math.floor(z / mBL); i++) {
                z4 += mBL;
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1));
                z3 += mBL;
            }
            z4 += (((z / mBL) - Math.floor(z / mBL)) * mBL);
            commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1));
        }
        else {

 */

let btn = document.getElementById('btn');
let output = document.getElementById('output');

//let s = check if they want slash

//x3 = block bottom corner x
//x4 = block top corner x
//z3 = block bottom corner z
//z4 = block top corner z

mBA = 65536
mCA = 256
mBL = 4096
cW = 16
mCL = 1

function generateForceload() {
    // set an empty array for commands
    let commands = [];

    // get inputs
    var x1 = Number(document.getElementById("x1").value);
    var x2 = Number(document.getElementById("x2").value);
    var z1 = Number(document.getElementById("z1").value);
    var z2 = Number(document.getElementById("z2").value);

    var x = (Math.abs(x4 - x3) + 1)
    var z = (Math.abs(z4 - z3) + 1)

    // organize inputs
    if(x1 < x2) {
        var x3 = Math.floor(x1 / cW) * cW;
        var x4 = (Math.ceil((x2 + 1) / cW) * cW) - 1;
    }
    else {
        var x4 = Math.floor(x1 / cW) * cW;
        var x3 = (Math.ceil((x2 + 1) / cW) * cW) - 1;
    }
    if(z1 > z2) {
        var z3 = Math.floor(z1 / cW) * cW;
        var z4 = (Math.ceil((z2 + 1) / cW) * cW) - 1;
    }
    else {
        var z4 = Math.floor(z1 / cW) * cW;
        var z3 = (Math.ceil((z2 + 1) / cW) * cW) - 1;
    }

    // generate the commands for big areas
    if (x * z > mBA) {
        if (x <= z) {
            for (let i = 0; i < x / cW; i++) {
                x4 = x3 + cW
                for (let i = 0; i < Math.floor(z / mBL); i++) {
                    z4 += mBL;
                    commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1));
                    z3 += mBL;
                }
                z4 += (((z / mBL) - Math.floor(z / mBL)) * mBL);
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + (z4 - 1));
                x3 += cW
            }
        } else {
            for (let i = 0; i < x / cW; i++) {
                z4 = z3 + cW
                for (let i = 0; i < Math.floor(x / mBL); i++) {
                    x4 += mBL;
                    commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4);
                    x3 += mBL;
                }
                x4 += (((x / mBL) - Math.floor(x / mBL)) * mBL);
                commands.push(s + "forceload add " + x3 + " " + z3 + " " + (x4 - 1) + " " + z4);
                z3 += cW;
            }
        }
    }
    // generate the commands for small areas
    else {
        commands.push(s + "forceload add " + x3 + " " + z3 + " " + x4 + " " + z4)
    }

    output.innerHTML = commands.join("/n");
}

btn.getElementById("gFLA").addEventListener('click', generateForceload);
btn.getElementById("gFLR").addEventListener('click', generateForceload);
