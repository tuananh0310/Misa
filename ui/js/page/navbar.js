/**
 * RESPONSIVE NAVBAR
 * LXTANH (07/07/2022)
 */

let btn = document.querySelector("#btn-toggle");
let sidebar = document.querySelector(".sidebar");
let extraNav = document.querySelector(".extra-nav");
let minNav = document.querySelector(".min-nav");
btn.onclick = () => {
    sidebar.classList.toggle("active");
}

extraNav.onclick = () => {
    sidebar.classList.toggle("active");
}

minNav.onclick = () => {
    sidebar.classList.toggle("active");
}






