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

let gen = document.getElementById('gen');
let cpy = document.getElementById('cpy');

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
    // set an empty array for commands and coords
    let commands = [];
    // stored info as possible, [x1,x2],[z1,z2],[x3,x4],[z3,z4],[x,z]
    let c = [[], [], [], []]

    // get format inputs to form a command
    if(document.getElementById("sYN").checked) {
        var s = "/"
    }
    else {
        var s = ""
    }

    if(document.getElementById("lO").checked) {
        var l = "execute in overworld run "
    }
    else if(document.getElementById("lE").checked) {
        var l = "execute in the_end run "
    }
    else if(document.getElementById("lN").checked) {
        var l = "execute in the_nether run "
    }
    else {
        var l = ""
    }

    if(document.getElementById("tR").checked) {
        var t = "remove "
    }
    else if(document.getElementById("tQ").checked) {
        var t = "query "
    }
    else {
        var t = "add "
    }

    let m = String(s + l + "forceload " + t)

    // organize coord inputs
    c[0].push(Number(document.getElementById("x1").value), Number(document.getElementById("x2").value))
    c[1].push(Number(document.getElementById("z1").value), Number(document.getElementById("z2").value))
    c[0].sort()
    c[1].sort()

    console.log(c)

    var x3 = Math.floor(c[0][0] / cW) * cW;
    var z3 = Math.floor(c[1][0] / cW) * cW;
    var x4 = (Math.ceil((c[0][1]+ 1) / cW) * cW) - 1;
    var z4 = (Math.ceil((c[1][1] + 1) / cW) * cW) - 1;

    // set lengths of the sides of designated chunks
    var x = (Math.abs(x4 - x3) + 1)
    var z = (Math.abs(z4 - z3) + 1)

    // generate the commands for big areas
    if ((x * z) > mBA) { // if the area is too big for a single command
        if (x <= z) { // if x is less than or equal to z
            for (let i = 0; i <= (x / cW); i++) { // increment 1 for every time 16 goes into x
                x4 = x3 + cW // set x4 to 16 plus x3 at the start
                let z5 = z3
                let z6 = z3
                for (let i = 0; i < Math.floor(z / mBL); i++) { // for every time that z goes into the max block limit 4096 run a cycle of max length commands
                    z6 += mBL;
                    commands.push(m + x3 + " " + z5 + " " + (x4 - 1) + " " + (z6 - 1));
                    z5 += mBL;
                }
                z6 += (((z / mBL) - Math.floor(z / mBL)) * mBL);
                commands.push(m + x3 + " " + z5 + " " + (x4 - 1) + " " + (z6 - 1));
                x3 += cW
            }
        } else {
            for (let i = 0; i <= (x / cW); i++) {
                let x5 = x3
                let x6 = x3
                z4 = z3 + cW
                for (let i = 0; i < Math.floor(x / mBL); i++) {
                    x6 += mBL;
                    commands.push(m + x5 + " " + z3 + " " + (x6 - 1) + " " + (z4 - 1));
                    x5 += mBL;
                }
                x6 += (((x / mBL) - Math.floor(x / mBL)) * mBL);
                commands.push(m + x5 + " " + z3 + " " + (x6 - 1) + " " + (z4 - 1));
                z3 += cW;
            }
        }
    }
    // generate the commands for small areas
    else {
        commands.push(m + x3 + " " + z3 + " " + x4 + " " + z4)
    }

    output.innerHTML = commands.join(`<br>`);
}

async function copyEvent(id) {
    let text = document.querySelector(id).value;
    await navigator.clipboard.writeText(text)
}

gen.addEventListener('click', generateForceload);
cpy.addEventListener('click', copyEvent("output"));