// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    // Close mobile menu if open
    mobileMenu.classList.add("hidden");

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add shadow to navbar on scroll
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 10) {
    nav.classList.add("shadow-lg");
    nav.classList.add("bg-gray-900/90");
  } else {
    nav.classList.remove("shadow-lg");
    nav.classList.remove("bg-gray-900/90");
  }
});
