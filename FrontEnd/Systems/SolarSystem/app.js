const planets = document.querySelectorAll(".planet")

for (let planet of planets) {
    planet.addEventListener("click", () => {
        console.log(planet.id)
    })
}