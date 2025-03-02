# Clubhouse Project

## Overview

Clubhouse is a retro-styled web application that serves as an exclusive online community for users to interact and share messages. Users can sign up, become members, and even gain admin privileges to manage the platform. The application features a nostalgic UI inspired by classic computing aesthetics while ensuring a smooth and responsive user experience.

## Features

-   **User Authentication**: Secure login and signup system.
-   **Membership System**: Users can join as members to unlock additional content.
-   **Admin Privileges**: Members can apply to become admins, gaining the ability to moderate messages.
-   **Message Board**: Users can create and view messages, with authors visible only to members.
-   **Message Deletion**: Admins have the ability to remove inappropriate messages.
-   **Retro Aesthetic**: A pixel-inspired design with a warm pastel color scheme.
-   **Responsive Design**: Optimized for different screen sizes (mobile, tablet, desktop).

## Live Demo

Check out the live app here: [Clubhouse Project](https://clubhouse-project.onrender.com/)

## Technologies Used

-   **Backend**: Node.js, Express
-   **Database**: PostgreSQL (Neon.tech)
-   **Authentication**: Passport.js, bcrypt
-   **Deployment**: Render (backend), Neon.tech (database)
-   **Templating**: EJS
-   **Styling**: Custom retro-themed CSS

## Installation

1. Clone this repository:
    ```sh
    git clone https://github.com/stef44n/clubhouse-project.git
    ```
2. Navigate into the project folder:
    ```sh
    cd clubhouse-project
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Set up a `.env` file with the following variables:
    ```env
    DATABASE_URL=your_database_url
    SESSION_SECRET=your_secret_key
    ```
5. Run the app locally:
    ```sh
    npm start
    ```
6. Open `http://localhost:3000` in your browser.

## Usage

-   Sign up and log in to access the clubhouse.
-   Apply for membership to unlock exclusive content.
-   Members can apply for admin privileges.
-   Post and read messages on the board.
-   Admins can delete inappropriate messages.

## Future Enhancements

-   Implement user avatars.
-   Improve moderation tools for admins.
-   Add reactions or likes to messages.
-   Expand customization options for users.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Enjoy the nostalgia of Clubhouse! 🎮✨
