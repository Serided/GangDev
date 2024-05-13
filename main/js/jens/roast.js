let btn = document.getElementById('btn');
let output = document.getElementById('output');

let timer = document.getElementById('timer');
let time = 15;
let timerId;

var end = [
    "with no earnings","with no rizz","with no dexterity","without basic cooking ability","with positively gigantic cooking mits",
    "with sweaty hands","without chicken nuggets",
];

var nouns = [
    "Aerococcus Urinae","Pediococcus Acidilactici","Tetragenococcus Halophilus","Bacillus Anthracis","Klebsiella Aerogenes",
    "Vibrio Parahaemolyticus","Campylobacter Rectus","Spirillum Minus","Treponema Denticola","African Wild Dog","American Bulldog",
    "Chinese Crested Dog","Oompa Loompa","doorknob"
];

function generateInsult(){
    var adjs= [
        "corpulent","obese","portly","stout","fleshy","rotund",
        "adipose","bloated","porcine","pursy","dull","foolish","futile","ill-advised","irrelevant","laughable",
        "ludicrous","naive","senseless","shortsighted","simple","trivial","rash", "thick","unintelligent",
        "dazed","deficient","dense","dim","doltish","dopey","gullible","half-baked","half-witted","imbecilic","inane","indiscreet",
        "insensate","meaningless","mindless","moronic","nonsensical","obtuse","out to lunch","pointless","puerile","simpleminded","slow",
        "sluggish","stolid","stupefied", "thick-headed","unthinking","witless","sus","toe-sucking","bibbling"
    ];

    let roast = ["You"];
    // var roastLength = Math.floor(Math.random() * adjs.length);
    var noun = Math.floor(Math.random() * nouns.length);
    var ending = Math.floor(Math.random() * end.length);

    for (let i = 0; i < 13; i++) {
        var adj = Math.floor(Math.random() * adjs.length);
        roast.push(adjs[adj]);
        adjs.splice(adj,1);
    }

    roast.push(nouns[noun]);
    roast.push(end[ending]);
    // console.log(roastLength);

    output.innerHTML = roast.join(" ");

    time = 30
}


function decreaseTimer() {
    if (time > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        time--;
        // console.log(time);
    }
    if (time <= 0) {
        generateInsult();
    }
    timer.innerHTML = time;
}

decreaseTimer()

btn.addEventListener('click', generateInsult)