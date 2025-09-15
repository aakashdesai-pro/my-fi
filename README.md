# Personnel Finance App

A modern, responsive personal finance management application built with React, Material-UI, and Appwrite. This application allows users to track their accounts, transactions, loans, and incomes in a clean and intuitive interface.

## Features

- **Authentication:** Secure user authentication (Login, Register) using Appwrite.
- **Real-time Updates:** Data on all listing pages updates in real-time.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for:
  - **Categories:** Manage account categories.
  - **Accounts:** Track different financial accounts.
  - **Transactions:** Record debit and credit transactions.
  - **Loans:** Keep track of loans.
  - **Incomes:** Manage income sources.
- **Responsive Design:** A mobile-first design that looks great on all devices.
- **Modern UI:** Built with Material-UI for a clean and modern user experience.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Material-UI](https://mui.com/)
  - [React Router](https://reactrouter.com/)
- **Backend:**
  - [Appwrite](https://appwrite.io/) (for database, authentication, and real-time features)
- **Build Tool:**
  - [Vite](https://vitejs.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/)
- An [Appwrite](https://appwrite.io/) instance. You can set one up locally or use Appwrite Cloud.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/personnelfinanceapp.git
    cd personnelfinanceapp
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. Create a `.env` file in the root of your project.

`VITE_APPWRITE_URL`
`VITE_APPWRITE_PROJECT_ID`
`VITE_APPWRITE_DATABASE_ID`
`VITE_APPWRITE_COLLECTION_ID_CATEGORIES`
`VITE_APPWRITE_COLLECTION_ID_ACCOUNTS`
`VITE_APPWRITE_COLLECTION_ID_TRANSACTIONS`
`VITE_APPWRITE_COLLECTION_ID_LOANS`
`VITE_APPWRITE_COLLECTION_ID_INCOMES`

You can get these values from your Appwrite project console.

### Running the Application

Once the dependencies are installed and the environment variables are set, you can run the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
