// validation.js

$(document).ready(function() {
    // Function to validate the login form
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        let phoneNumber = $('#loginPhone').val();
        let password = $('#loginPassword').val();
        if (validatePhoneNumber(phoneNumber) && validatePassword(password)) {
            // Proceed with form submission
            this.submit();
        } else {
            alert('Please enter valid credentials.');
        }
    });

    // Function to validate the registration form
    $('#registrationForm').on('submit', function(event) {
        event.preventDefault();
        let username = $('#regUsername').val();
        let phoneNumber = $('#regPhone').val();
        let password = $('#regPassword').val();
        let confirmPassword = $('#regConfirmPassword').val();
        if (validateUsername(username) && validatePhoneNumber(phoneNumber) && validatePassword(password) && (password === confirmPassword)) {
            // Proceed with form submission
            this.submit();
        } else {
            alert('Please ensure all fields are valid and passwords match.');
        }
    });

    // Function to validate phone number
    function validatePhoneNumber(phone) {
        const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed
        return phoneRegex.test(phone);
    }

    // Function to validate password
    function validatePassword(password) {
        return password.length >= 6; // Minimum length of 6 characters
    }

    // Function to validate username
    function validateUsername(username) {
        return username.trim() !== ''; // Ensure username is not empty
    }
});