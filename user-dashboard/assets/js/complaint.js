// This file contains JavaScript functions for managing complaints, including submitting and retrieving complaint data.

$(document).ready(function() {
    // Function to submit a new complaint
    $('#complaintForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const complaintData = {
            title: $('#complaintTitle').val(),
            description: $('#complaintDescription').val(),
            userId: $('#userId').val() // Assuming user ID is stored in a hidden input
        };

        // Validate the form data
        if (validateComplaint(complaintData)) {
            // Send the complaint data to the server (mocked with a console log)
            console.log('Submitting complaint:', complaintData);
            // Here you would typically use AJAX to send the data to your server
            // $.post('/api/complaints', complaintData, function(response) {
            //     alert('Complaint submitted successfully!');
            // });
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    // Function to validate complaint data
    function validateComplaint(data) {
        return data.title && data.description; // Simple validation check
    }

    // Function to retrieve and display complaints
    function loadComplaints() {
        // Mocked data retrieval
        const complaints = [
            { id: 1, title: 'Complaint 1', status: 'Pending' },
            { id: 2, title: 'Complaint 2', status: 'Resolved' }
        ];

        // Display complaints in a list
        complaints.forEach(complaint => {
            $('#complaintList').append(`
                <li>
                    <strong>${complaint.title}</strong> - Status: ${complaint.status}
                </li>
            `);
        });
    }

    // Load complaints on page load
    loadComplaints();
});