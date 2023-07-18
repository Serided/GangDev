let btn = document.getElementById('btn');
let output = document.getElementById('output');
let roasts = [
    'You are built like an exotic Oompa Loompa.',
    'You have no earnings.',
    'Go have yourself a donut and fill that elongated hole of a mouth you have.',
    'You are one unusually silly billy.'
    ];

btn.addEventListener('click', function(){
    var randomRoast = roasts[Math.floor(Math.random() * roasts.length)]
    output.innerHTML = randomRoast;
})