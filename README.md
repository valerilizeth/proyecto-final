# To-Do List App

This is a project of a to-do list application developed in Node.js, using Mongoose to connect to a MongoDB database.

## Setup

Before getting started, make sure you have Node.js and MongoDB installed on your system. Then, follow these steps to set up the project:

1. Clone this repository to your local machine.
2. Install the project dependencies by running the command:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the project and add the following environment variables:

    ```plaintext
    USER=your_mongo_user
    PASS=your_mongo_password
    ```

    Make sure to replace `your_mongo_user` and `your_mongo_password` with the appropriate credentials for your MongoDB database.

## Running

Once you've set up the `.env` file, you can run the application using the following command:

```bash
npm run start