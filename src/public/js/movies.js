const selectedY = document.querySelector(".selected-year");
const optionsContainerY = document.querySelector(".options-container-year");

const optionListY = document.querySelectorAll(".options-container-year > div");

selectedY.addEventListener("click", () => {
    optionsContainerY.classList.toggle("active")
});

optionListY.forEach( o => {
    o.addEventListener("click", () => {
        selectedY.innerHTML = o.querySelector("label").innerHTML;
        optionsContainerY.classList.remove("active");
    });
});


const selectedG = document.querySelector(".selected-genre");
const optionsContainerG = document.querySelector(".options-container-genre");

const optionListG = document.querySelectorAll(".options-container-genre > div");

selectedG.addEventListener("click", () => {
    optionsContainerG.classList.toggle("active")
});

optionListG.forEach( o => {
    o.addEventListener("click", () => {
        selectedG.innerHTML = o.querySelector("label").innerHTML;
        optionsContainerG.classList.remove("active");
    });
});


const selectedC = document.querySelector(".selected-country");
const optionsContainerC = document.querySelector(".options-container-country");

const optionListC = document.querySelectorAll(".options-container-country > div");

selectedC.addEventListener("click", () => {
    optionsContainerC.classList.toggle("active")
});

optionListC.forEach( o => {
    o.addEventListener("click", () => {
        selectedC.innerHTML = o.querySelector("label").innerHTML;
        optionsContainerC.classList.remove("active");
    });
});


const selectedS = document.querySelector(".selected-sort");
const optionsContainerS = document.querySelector(".options-container-sort");

const optionListS = document.querySelectorAll(".options-container-sort > div");

selectedS.addEventListener("click", () => {
    optionsContainerS.classList.toggle("active")
});

optionListS.forEach( o => {
    o.addEventListener("click", () => {
        selectedS.innerHTML = o.querySelector("label").innerHTML;
        optionsContainerS.classList.remove("active");
    });
});