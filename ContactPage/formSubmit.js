$(document).ready(function(){
    $('#insertForm').submit(function(event){
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        var formData = $(this).serialize();

        // Send form data to backend script
        $.ajax({
            type: 'POST',
            url: 'form.php', // Path to your backend script
            data: formData,
            success: function(response){
                alert(response); // Display a message indicating success or failure
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error: " + textStatus + ": " + errorThrown);
                alert("An error occurred while submitting the form: " + textStatus);
            }
        });
    });
});