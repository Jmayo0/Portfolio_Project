
$(document).ready(function(){
    $('#insertForm').submit(function(event){
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        var formData = $(this).serialize();

        // Send form data to backend script
        $.ajax({
            type: 'POST',
            url: 'your_backend_script.php', // Change this to the path of your backend script
            data: formData,
            success: function(response){
                alert(response); // Display a message indicating success or failure
            }
        });
    });
});