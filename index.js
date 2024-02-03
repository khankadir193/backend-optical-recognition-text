
const express = require('express');
const multer = require('multer'); // For handling file uploads
const axios = require('axios');

const app = express();
const port = 4000;

// Set up multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Access the image buffer
        const imageBuffer = req.file.buffer;
        res.header('Access-Control-Allow-Origin', '*');

        // Convert the imageBuffer to Base64
        const imageBase64 = imageBuffer.toString('base64');

        // Construct the OCR API URL
        const apiUrl = 'https://api.ocr.space/parse/image';

        // Make the POST request to the OCR API
        const ocrApiResponse = await axios.post(apiUrl, {
            apikey: 'K89496159888957',
            language: 'eng', // Specify the language code as needed
            base64image: `data:image/jpeg;base64,${imageBase64}`, // Include image data
        });

        // Handle OCR API response
        const ocrResult = ocrApiResponse.data;
        console.log('OCR Result:', ocrResult);

        res.json({ ocrResult });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
