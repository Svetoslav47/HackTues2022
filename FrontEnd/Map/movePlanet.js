let orbitMercury = document.getElementById("orbit");
let sateliteMercuryElement = document.getElementById("sateliteMercury");
let sateliteVenusElement = document.getElementById("sateliteVenus");

function createSatelite(orbit,satelite, speed = 0.005){
    return {
        elt: satelite,
        a: 0 // in radian
            ,
        r: parseInt(window.getComputedStyle(orbit).width) / 2 // radius
            ,
        da: speed // in radian
            ,
        x: 0,
        y: 0
            // Center is actualy center (100, 100) minus
            // half the size of the orbiting object 15x15
            ,
        center: {
            x: (parseInt(window.getComputedStyle(orbit).width) / 2 - parseInt(window.getComputedStyle(satelite).width) / 2),
            y: (parseInt(window.getComputedStyle(orbit).height) / 2 - parseInt(window.getComputedStyle(satelite).height) / 2)
        }
    }
}

    const sateliteMercury = createSatelite(orbitMercury, sateliteMercuryElement);

sateliteMercury.move = function() {
    // each modification
    this.a += this.da
    this.x = this.center.x + (this.r * Math.sin(this.a));
    this.y = this.center.y + (this.r * Math.cos(this.a));
    //console.log(this.x, this.y);
    this.elt.style.top = this.y + "px";
    this.elt.style.left = this.x + "px";
}

sateliteMercuryElement.addEventListener("mouseover",()=>{
    setImageVisible("visible","bubble");
})

sateliteMercuryElement.addEventListener("mouseout",()=>{
    setImageVisible("hidden","bubble");
})

function setImageVisible(visibility, id) {
    document.getElementById(id).style.visibility = visibility;
}

sateliteMercuryElement.addEventListener("click",()=>{
    window.location.href="../Planets/Earth/Earth.html";
})

var loopTimer = setInterval(function() {
    sateliteMercury.move();
}, 10);