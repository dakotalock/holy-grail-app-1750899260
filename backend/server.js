// server.js

// 1. Environment Variable Configuration
// Load environment variables from .env file if not in production
// This is primarily for local development. Render will provide `process.env.PORT` automatically.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// 2. Framework and Dependencies
const express = require('express'); // Express.js framework
const cors = require('cors');       // CORS middleware for Cross-Origin Resource Sharing

// 3. Server Initialization
const app = express();
// Define the port to listen on. Use the PORT environment variable provided by Render,
// or default to 3000 for local development.
const PORT = process.env.PORT || 3000;

// 4. Middleware Configuration

// CORS Middleware: Essential for allowing the frontend (on Netlify) to make requests
// to this backend (on Render).
// For simplicity and initial deployment success, allow all origins.
// In a production application, you would restrict this to your specific Netlify frontend URL:
// e.g., cors({ origin: 'https://your-netlify-frontend.netlify.app' })
app.use(cors());

// Body Parser Middleware: Enable express.json() to parse incoming request bodies
// with JSON payloads. This is necessary to receive the chat message from the frontend.
app.use(express.json());

// 5. API Endpoint Definition

// Basic health check endpoint (GET /)
// This is useful for Render to confirm the service is running and for simple testing.
app.get('/', (req, res) => {
    res.status(200).json({ message: 'EchoBot Backend is running!' });
});

/**
 * API Endpoint: /api/chat
 * Method: POST
 * Description: Receives a user's text message and responds with a bot-generated echo message.
 */
app.post('/api/chat', (req, res) => {
    try {
        // Extract the 'message' property from the request body.
        const userMessage = req.body.message;

        // 8. Request Validation: Basic validation for the 'message' parameter.
        // If 'message' is missing or empty, send a 400 Bad Request response.
        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
            console.warn('Received bad request: Missing or empty message parameter.');
            return res.status(400).json({ error: 'Message parameter is required and cannot be empty.' });
        }

        // 5. Bot Logic: Implement the extremely simple echo logic.
        // Construct the bot's response by echoing the user's input.
        const botMessage = `EchoBot received: ${userMessage.trim()}`;

        // Send the constructed bot message back as a JSON response with a 200 OK status.
        console.log(`Received message: "${userMessage}" - Responding with: "${botMessage}"`);
        res.status(200).json({ botMessage: botMessage });

    } catch (error) {
        // 4. Error Handling: Catch any unhandled server-side errors.
        // Log the error for debugging purposes.
        console.error('Error processing chat message:', error);
        // Send a 500 Internal Server Error response.
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// 6. Server Listener
// Start the Express server, listening on the specified PORT.
app.listen(PORT, () => {
    console.log(`EchoBot Backend server listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// For testing purposes or if you want to export the app for a different server setup (e.g., serverless),
// you might export it, but for a standard Render Web Service, app.listen() is sufficient.
// module.exports = app;