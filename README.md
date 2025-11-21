# Bitsnet

Bitsnet is a modern web application built with React and Vite, designed for Web3 and blockchain interactions. It leverages the power of Ethereum and other blockchain networks to provide a seamless user experience.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bitsnet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

2.  **Build for production:**
    ```bash
    npm run build
    ```

3.  **Preview the production build:**
    ```bash
    npm run preview
    ```

## 🛠️ Tech Stack & Dependencies

This project uses a robust set of tools and libraries to ensure performance, scalability, and developer experience.

### Core Framework
-   **[React](https://react.dev/)**: A JavaScript library for building user interfaces. It's the foundation of our application.
-   **[Vite](https://vitejs.dev/)**: A build tool that aims to provide a faster and leaner development experience for modern web projects.

### State Management
-   **[Redux Toolkit](https://redux-toolkit.js.org/)**: The official, opinionated, batteries-included toolset for efficient Redux development. Used for managing global application state.
-   **[React Redux](https://react-redux.js.org/)**: Official React bindings for Redux.
-   **[Redux Persist](https://github.com/rt2zz/redux-persist)**: Persist and rehydrate a redux store. This ensures that the user's state (like login session or preferences) is saved even after refreshing the page.

### Blockchain & Web3
-   **[Ethers.js](https://docs.ethers.org/v6/)**: A complete and compact library for interacting with the Ethereum Blockchain and its ecosystem. Used for wallet connection, contract interaction, and transaction management.
-   **[Web3.js](https://web3js.readthedocs.io/)**: Another popular library for interacting with Ethereum nodes. (Note: The project includes both, likely for compatibility or specific feature requirements).

### Routing
-   **[React Router](https://reactrouter.com/)**: The standard routing library for React. It enables navigation among views of various components in the application, allows changing the browser URL, and keeps the UI in sync with the URL.

### UI & Styling
-   **[DaisyUI](https://daisyui.com/)**: The most popular component library for Tailwind CSS. It adds component class names to Tailwind CSS so you can make beautiful websites faster.
-   **[Lucide React](https://lucide.dev/guide/packages/lucide-react)** & **[React Icons](https://react-icons.github.io/react-icons/)**: Libraries for including popular icons in your React projects easily.

### Development Tools
-   **[ESLint](https://eslint.org/)**: A static code analysis tool for identifying problematic patterns found in JavaScript code.
