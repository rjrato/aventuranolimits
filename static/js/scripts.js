/* HOMEPAGE CAROUSEL */
const buttons = document.querySelectorAll(".carousel-btn");
const slideRow = document.getElementById("slide-row");
const testimonials = document.getElementById("testimonials-div");
const leftControl = document.querySelector(".carousel-left-control")
const rightControl = document.querySelector(".carousel-right-control")

let currentIndex = 0;
const totalSlides = buttons.length;

// Function to update the visible slide
function updateSlide() {
    const testimonialsWidth = testimonials.offsetWidth;
    const translateValue = currentIndex * -testimonialsWidth;
    slideRow.style.transform = `translateX(${translateValue}px)`;

    buttons.forEach((button, index) => {
        button.classList.toggle("active", index === currentIndex);
    });
}

// Manually change slides with buttons
buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        currentIndex = index;
        updateSlide();
    });
});

window.addEventListener("resize", () => {
    updateSlide();
});

// Left arrow click handler
leftControl.addEventListener("click", () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
    updateSlide();
});

// Right arrow click handler
rightControl.addEventListener("click", () => {
    currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
    updateSlide();
});

// Automatically change slides every 10 seconds
setInterval(() => {
    currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
    updateSlide();
}, 5000);