// Function to perform matrix operations based on user input
function performMatrixOperation(operation) {
    // Get user input from textarea
    const matrixInput = document.getElementById("matrix-input").value;
    // Parse the input into a 2D array (matrix)
    const matrix = matrixInput.split("\n").map(row => row.split(",").map(Number));
    let resultMatrix;
  
    // Perform matrix operation based on user selection
    switch (operation) {
        case "transpose":
            resultMatrix = transposeMatrix(matrix);
            break;
        case "determinant":
            resultMatrix = determinant(matrix);
            break;
        case "addition":
        case "subtraction":
        case "multiplication":
            // Show the custom modal for entering the second matrix
            showModal(operation);
            break;
        default:
            alert("Invalid operation");
            return;
    }
  
    // Display the result
    if (!["addition", "subtraction", "multiplication"].includes(operation)) {
        const resultElement = document.getElementById("matrix-result");
        resultElement.innerHTML = `<pre>Result:\n${resultMatrix.map(row => row.join(", ")).join("\n")}</pre>`;
    }
}

// Function to show the custom modal for entering the second matrix
function showModal(operation) {
    const confirmButton = document.getElementById("confirm-matrix");
    // Set the data-operation attribute to the operation type
    confirmButton.setAttribute("data-operation", operation);
    // Show the custom modal
    document.getElementById("custom-modal").style.display = "block";
}

// Function to close the custom modal
function closeModal() {
    document.getElementById("custom-modal").style.display = "none";
}

// Function to confirm the matrix input from the custom modal
function confirmMatrixInput() {
    // Get user input from textarea for the second matrix
    const matrixInput2 = document.getElementById("matrix-input-2").value;
    // Parse the input into a 2D array (matrix)
    const matrix2 = matrixInput2.split("\n").map(row => row.split(",").map(Number));
  
    // Get the operation type from the button's data attribute
    const operation = document.getElementById("confirm-matrix").getAttribute("data-operation");
  
    // Perform the operation
    switch (operation) {
        case "addition":
            performMatrixAddition(matrix2);
            break;
        case "subtraction":
            performMatrixSubtraction(matrix2);
            break;
        case "multiplication":
            performMatrixMultiplication(matrix2);
            break;
    }
  
    // Close the modal
    closeModal();
}

// Function to perform matrix addition with user input
function performMatrixAddition(matrix2) {
    // Get user input from textarea for the first matrix
    const matrixInput1 = document.getElementById("matrix-input").value;
    // Parse the input into a 2D array (matrix)
    const matrix1 = matrixInput1.split("\n").map(row => row.split(",").map(Number));
  
    // Perform addition
    const resultMatrix = addMatrices(matrix1, matrix2);
  
    // Display the result
    const resultElement = document.getElementById("matrix-result");
    resultElement.innerHTML = `<pre>Result:\n${resultMatrix.map(row => row.join(", ")).join("\n")}</pre>`;
}

// Function to perform matrix subtraction with user input
function performMatrixSubtraction(matrix2) {
    // Get user input from textarea for the first matrix
    const matrixInput1 = document.getElementById("matrix-input").value;
    // Parse the input into a 2D array (matrix)
    const matrix1 = matrixInput1.split("\n").map(row => row.split(",").map(Number));
  
    // Perform subtraction
    const resultMatrix = subtractMatrices(matrix1, matrix2);
  
    // Display the result
    const resultElement = document.getElementById("matrix-result");
    resultElement.innerHTML = `<pre>Result:\n${resultMatrix.map(row => row.join(", ")).join("\n")}</pre>`;
}

// Function to perform matrix multiplication with user input
function performMatrixMultiplication(matrix2) {
    // Get user input from textarea for the first matrix
    const matrixInput1 = document.getElementById("matrix-input").value;
    // Parse the input into a 2D array (matrix)
    const matrix1 = matrixInput1.split("\n").map(row => row.split(",").map(Number));
  
    // Perform multiplication
    const resultMatrix = multiplyMatrices(matrix1, matrix2);
  
    // Display the result
    const resultElement = document.getElementById("matrix-result");
    resultElement.innerHTML = `<pre>Result:\n${resultMatrix.map(row => row.join(", ")).join("\n")}</pre>`;
}

// Function to calculate the transpose of a matrix
function transposeMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposedMatrix = [];
    for (let j = 0; j < cols; j++) {
        transposedMatrix.push([]);
        for (let i = 0; i < rows; i++) {
            transposedMatrix[j].push(matrix[i][j]);
        }
    }
    return transposedMatrix;
}

// Function to calculate the determinant of a matrix (for 2x2 and 3x3 matrices)
function determinant(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    if (rows !== cols) {
        return "Determinant can only be calculated for square matrices";
    }
    if (rows === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (rows === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    } else {
        return "Determinant calculation for matrices larger than 3x3 is not supported";
    }
}

// Function to add two matrices
function addMatrices(matrix1, matrix2) {
    const rows = matrix1.length;
    const cols = matrix1[0].length;
    const resultMatrix = [];
    for (let i = 0; i < rows; i++) {
        resultMatrix.push([]);
        for (let j = 0; j < cols; j++) {
            resultMatrix[i].push(matrix1[i][j] + matrix2[i][j]);
        }
    }
    return resultMatrix;
}

// Function to subtract two matrices
function subtractMatrices(matrix1, matrix2) {
    const rows = matrix1.length;
    const cols = matrix1[0].length;
    const resultMatrix = [];
    for (let i = 0; i < rows; i++) {
        resultMatrix.push([]);
        for (let j = 0; j < cols; j++) {
            resultMatrix[i].push(matrix1[i][j] - matrix2[i][j]);
        }
    }
    return resultMatrix;
}

// Function to multiply two matrices
function multiplyMatrices(matrix1, matrix2) {
    const rows1 = matrix1.length;
    const cols1 = matrix1[0].length;
    const rows2 = matrix2.length;
    const cols2 = matrix2[0].length;
    if (cols1 !== rows2) {
        return "Cannot multiply matrices: incompatible dimensions";
    }
    const resultMatrix = [];
    for (let i = 0; i < rows1; i++) {
        resultMatrix.push([]);
        for (let j = 0; j < cols2; j++) {
            let sum = 0;
            for (let k = 0; k < cols1; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            resultMatrix[i].push(sum);
        }
    }
    return resultMatrix;
}

// Add event listeners after the DOM content has loaded
document.addEventListener("DOMContentLoaded", function() {
    const confirmButton = document.getElementById("confirm-matrix");
    confirmButton.addEventListener("click", confirmMatrixInput);
});