# Dayze
-------

Dayze is a simple web application built with React and Firebase, that allows users to manage their profiles, calculate their age in days, and connect with friends.

Features
--------

-   User authentication with email and password using Firebase Auth
-   User profile management with the ability to update name, birthday, and profile image
-   Age calculation in days based on the user's birthday
-   Public profile page accessible via custom handle
-   Responsive design for a seamless experience on both desktop and mobile devices

Getting Started
---------------

### Prerequisites

To get started with the project, make sure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14.0.0 or higher)
-   [npm](https://www.npmjs.com/) (v6.0.0 or higher)
-   [Firebase CLI](https://firebase.google.com/docs/cli) (v9.0.0 or higher)

### Installation

1.  Clone the repository: `git clone https://github.com/yourusername/dayze.git`
    `cd dayze`

2.  Install the dependencies: `npm install`

3.  Create a Firebase project and enable Email/Password authentication and Cloud Firestore.

4.  Set up your Firebase configuration file (`src/firebaseConfig.js`) with your project credentials:

    `import { initializeApp } from 'firebase/app';`
    `const firebaseConfig = {`
    `  apiKey: 'your-api-key',`
   `   authDomain: 'your-auth-domain',`
      `projectId: 'your-project-id',`
      `storageBucket: 'your-storage-bucket',`
      `messagingSenderId: 'your-messaging-sender-id',`
      `appId: 'your-app-id',`
   ` };`

    `const app = initializeApp(firebaseConfig);`

    `export default app;`

5.  Configure Firestore security rules and indexes as needed.

6.  Start the development server:

    `npm start`

    The application will be available at `http://localhost:3000`.

Deployment
----------

To deploy the application, follow the Firebase Hosting deployment guide [here](https://firebase.google.com/docs/hosting/quickstart).

Built With
----------

-   [React](https://reactjs.org/)
-   [Firebase](https://firebase.google.com/)
-   [Ant Design](https://ant.design/)

Contributing
------------

Please read [CONTRIBUTING.md](https://CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

License
-------

This project is licensed under the MIT License - see the [LICENSE](https://LICENSE) file for details.