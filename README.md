# Online Complaint Management System (OCMS-SaaS)

## Overview
The Online Complaint Management System (OCMS-SaaS) is a web-based application designed to facilitate the submission and management of complaints. This system allows users to register, log in, submit complaints, and track their status efficiently.

## Project Structure
```
ocms-saas-frontend
├── index.html               # Main entry point of the application
├── pages                    # Contains all the HTML pages
│   ├── login.html          # User login page
│   ├── registration.html    # User registration page
│   ├── dashboard.html       # User dashboard after login
│   ├── complaint-form.html   # Form for submitting a new complaint
│   └── complaint-list.html   # List of submitted complaints
├── css                      # Contains all the CSS stylesheets
│   ├── style.css            # Main styles for the application
│   ├── navbar.css           # Styles for the navigation bar
│   ├── forms.css            # Styles for form elements
│   └── responsive.css       # Responsive styles for various screen sizes
├── js                       # Contains all the JavaScript files
│   ├── main.js              # Main JavaScript functionality
│   ├── auth.js              # User authentication functions
│   ├── complaint.js         # Functions for managing complaints
│   └── validation.js        # Input validation functions
├── assets                   # Contains images and icons
│   ├── images               # Directory for images
│   │   └── .gitkeep         # Placeholder for version control
│   └── icons                # Directory for icons
│       └── .gitkeep         # Placeholder for version control
└── README.md                # Documentation for the project
```

## Setup Instructions
1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd ocms-saas-frontend
   ```

2. **Open the Project**
   Open `index.html` in your preferred web browser to view the application.

3. **Dependencies**
   Ensure you have an internet connection to load external libraries such as Bootstrap and jQuery.

## Features
- User registration and authentication
- Complaint submission and management
- User dashboard for tracking complaints
- Responsive design for mobile and desktop views

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.