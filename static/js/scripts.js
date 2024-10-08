/* NAVBAR NAVIGATION */
document.querySelectorAll(".nav-link").forEach(item => {
    item.addEventListener("click", event => {
        event.preventDefault();
        document.getElementById("hamburger").checked = false;
        setTimeout(() => window.location.hash = item.getAttribute("href"), 50);
    });
});

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

// reCAPTCHA && FEEDBACK MESSAGE
document.addEventListener("DOMContentLoaded", function() {
    const siteKey = document.getElementById("recaptcha-site-key").value;

    grecaptcha.ready(function() {
        document.getElementById("contact-form").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevents form submission

            // Execute reCAPTCHA
            grecaptcha.execute(siteKey, { action: "submit" }).then(function(token) {
                document.getElementById("recaptcha-token").value = token; // Set token to hidden field

                // Submit form via AJAX
                var formData = new FormData(document.getElementById("contact-form"));
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/contact", true);
                xhttp.setRequestHeader("Accept", "application/json");

                xhttp.onload = function () {
                    var response = JSON.parse(xhttp.responseText);
                    var feedbackMessage = document.getElementById("feedback-message");

                    if (xhttp.status === 200 && response.status === "success") {
                        feedbackMessage.innerText = response.message;
                        feedbackMessage.classList.add("show");
                        document.getElementById("contact-form").reset();

                        setTimeout(function() {
                            feedbackMessage.classList.remove("show");
                            feedbackMessage.innerText = "";
                        }, 6000);

                    } else {
                        feedbackMessage.innerText = response.message;
                        feedbackMessage.style.color = "red";
                        feedbackMessage.classList.add("show");

                        setTimeout(function() {
                            feedbackMessage.classList.remove("show");
                            feedbackMessage.innerText = "";
                        }, 6000);
                    }
                };

                xhttp.send(formData); // Send form data via AJAX
            });
        });
    });
});

// FADE-IN ELEMENTS
document.addEventListener("DOMContentLoaded", function () {
    const initialStateElements = document.querySelectorAll(".initial-state");

    // Function to check if an element is in view
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return elementTop <= viewportHeight * (percentageScroll / 100);
    };

    // Function to add the visible class when the element is in view
    const displayScrollElement = (element) => {
        element.classList.add("fade-in");
        element.classList.remove("initial-state");
    };

    // Loop through all initial-state elements and check if they're in view
    const handleScrollAnimation = () => {
        initialStateElements.forEach((el) => {
            if (elementInView(el, 100) && el.classList.contains("initial-state")) {
                displayScrollElement(el);
            }
        });
    };

    // Initial check in case elements are already in view
    handleScrollAnimation();

    // Add scroll event listener to trigger the animation on scroll
    window.addEventListener("scroll", handleScrollAnimation);
});

