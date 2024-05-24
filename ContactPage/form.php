<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Get form data
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';

// Validate data (simple validation for example purposes)
if(empty($name) || empty($email)) {
    echo "Name and email are required fields.";
    exit();
}

// Database connection details
$servername = "localhost"; // Change to localhost since you are using XAMPP
$username = "root"; // Default username for XAMPP MySQL
$password = ""; // Default password for XAMPP MySQL is empty
$dbname = "userdata"; // Replace with the name of your XAMPP database

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);

// Execute the query
if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $stmt->error;
}

// Close connection
$stmt->close();
$conn->close();
?>