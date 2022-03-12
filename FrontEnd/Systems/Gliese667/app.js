const planets = document.querySelectorAll(".planet")

for (let planet of planets) {
    planet.addEventListener("click", () => {
        window.location.href = `/Planets/${planet.id}/${planet.id}.html`
    })
}