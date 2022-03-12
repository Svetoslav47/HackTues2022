const containers = document.querySelectorAll(".solarContainer")

let shouldTriggerMouseOut = false;

for (const container of containers) {
    container.addEventListener("mouseleave", (event) => {
        console.log("out")
        container.querySelector(".solarDescription").classList.add("disabled")
    })

    container.addEventListener("mouseenter", (event) => {
        console.log("enter")
        container.querySelector(".solarDescription").classList.remove("disabled")
    })

    container.addEventListener("click", () => {
        window.location.href = `/Systems/${container.id}/index.html`
    })
}