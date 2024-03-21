// Ensure pop-up message is hidden initially
document.getElementById("popupMessage").style.display = "none";

// Toggle between login and register containers
document.getElementById("registerLink").addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("registerContainer").style.display = "block";
});

document.getElementById("loginLink").addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("registerContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "block";
});

// Function to handle user registration
function registerWithEmailAndPassword() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  // Create a new user with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User registration successful
      const user = userCredential.user;
      console.log("User registered:", user);

      // Show pop-up message
      showPopupMessage("Registration successful!");
    })
    .catch((error) => {
      // Handle registration errors
      handleAuthError(error);
    });
}

// Function to handle user login
function signInWithEmailAndPassword() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Sign in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully, redirect to the next webpage
      window.location.href = "next_page.html"; // Replace "next_page.html" with the URL of the next webpage
    })
    .catch((error) => {
      // Handle login errors
      handleAuthError(error);
    });
}

// Function to handle Firebase authentication errors
function handleAuthError(error) {
  const errorCode = error.code;
  let errorMessage = error.message;

  switch (errorCode) {
    case "auth/email-already-in-use":
      errorMessage = "Email is already in use. Please use a different email.";
      break;
    case "auth/weak-password":
      errorMessage = "Password should be at least 6 characters long.";
      break;
    case "auth/user-not-found":
    case "auth/wrong-password":
      errorMessage = "Invalid email or password. Please try again.";
      break;
    default:
      errorMessage = "Authentication failed. Please try again later.";
  }

  // Display error message to the user
  showErrorMessage(errorMessage);
}

// Function to display pop-up message
function showPopupMessage(message) {
  const popupMessage = document.getElementById("popupMessage");
  const popupMessageText = document.getElementById("popupMessageText");
  popupMessageText.textContent = message;
  popupMessage.style.display = "block";
}

// Function to close the pop-up message
document.getElementById("popupCloseBtn").addEventListener("click", function() {
  document.getElementById("popupMessage").style.display = "none";
});

// Function to display error message
function showErrorMessage(message) {
  showPopupMessage(message);
}