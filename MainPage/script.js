document.addEventListener("DOMContentLoaded", function() {
    // Get the current page URL
    const currentPage = window.location.pathname;
  
    // Get the link elements
    const workLink = document.getElementById("work-link");
    const contactLink = document.getElementById("contact-link");
  
    // Check if the current page is the Work page
    if (currentPage.includes("MainPage.html")) {
      workLink.classList.add("active");
      contactLink.classList.remove("active"); // Remove "active" class from contact link
    } else {
      // Otherwise, assume it's the Contact page
      contactLink.classList.add("active");
      workLink.classList.remove("active"); // Remove "active" class from work link
    }
  });