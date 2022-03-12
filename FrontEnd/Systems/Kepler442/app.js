class Satelite {
    constructor(sateliteElement, orbitElement, startingPosition, speed) {
        this.sateliteElement = sateliteElement
        this.position = startingPosition
        this.radius = parseInt(window.getComputedStyle(orbitElement).width) / 2
        this.speed = speed
        this.center = this.calculateCenter();
        this.addEventListeners();
        this.shouldMove = true
    }

    move() {
        if (this.shouldMove === false) {
            return;
        }
        this.position += this.speed
        const x = this.center.x + (this.radius * Math.sin(this.position));
        const y = this.center.y + (this.radius * Math.cos(this.position));

        this.sateliteElement.style.top = y + "px";
        this.sateliteElement.style.left = x + "px";
    }

    calculateCenter() {
        return {
            x: this.radius - parseInt(window.getComputedStyle(this.sateliteElement).width) / 2,
            y: this.radius - parseInt(window.getComputedStyle(this.sateliteElement).height) / 2
        }
    }

    addEventListeners() {
        this.sateliteElement.addEventListener("mouseover", () => {
            this.toggleImageVisible(this.sateliteElement.querySelector(".bubble"));
            this.shouldMove = false;
        })

        this.sateliteElement.addEventListener("mouseout", () => {
            this.toggleImageVisible(this.sateliteElement.querySelector(".bubble"));
            this.shouldMove = true;
        })

        this.sateliteElement.addEventListener("click", () => {
            window.location.href = this.sateliteElement.getAttribute("clickRedirect")
        })
    }

    toggleImageVisible(element) {
        element.classList.toggle("hidden");
    }
}



const satelitesData = [
    {
        element: document.getElementById("sateliteKepler442"),
        orbit: document.getElementById("orbitKepler442"),
        startPosition: 160,
        speed: 0.02
    }
]


const satelites = satelitesData.map((satelite) => {
    return new Satelite(satelite.element, satelite.orbit, satelite.startPosition, satelite.speed);
});


var loopTimer = setInterval(function() {
    for (const satelite of satelites) {
        satelite.move();
    }
}, 10);

let sun = document.querySelector("#sun");

sun.addEventListener("mouseover", () => {
    toggleImageVisible(sun.querySelector(".bubble"));
})

sun.addEventListener("mouseout", () => {
    toggleImageVisible(sun.querySelector(".bubble"));
})

function toggleImageVisible(element) {
    element.classList.toggle("hidden");
}