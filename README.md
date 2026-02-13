# FeedbackForm-Website

## Running with Docker (Recommended)

To run the application with Docker and ensure your feedback is saved to `feedback.xlsx`:

1.  **Build the image:**
    ```bash
    npm run docker:build
    ```

2.  **Run the container:**
    ```bash
    npm run docker:run
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** Using `npm run docker:run` (or `docker compose up`) is important because it correctly mounts your local `feedback.xlsx` file into the container. If you use `docker run` manually without flags, your data will not be saved to your desktop.

## Running Locally (without Docker)

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the server:
    ```bash
    npm start
    ```
# FeedbackForm-Website
