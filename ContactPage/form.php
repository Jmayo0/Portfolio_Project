<?php
// Get form data
$name = $_POST['name'];
$email = $_POST['email'];

// Validate data (not shown in this example)

// Connect to the database
$servername = "portfoliodb.cnc6uy4as2oh.eu-west-2.rds.amazonaws.com";
$username = "admin";
$password = "Portfolio";
$dbname = "portfoliodb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert data
$sql = "INSERT INTO your_table_name (name, email) VALUES ('$name', '$email')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close connection
$conn->close();
?>