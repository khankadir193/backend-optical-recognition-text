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
        // Access the image buffer as a Blob
        const imageBlob = req.file.buffer;
        res.header('Access-Control-Allow-Origin', '*');


        // Convert the imageBlob to Base64
        const imageBase64 = Buffer.from(imageBlob).toString('base64');

        // Construct the URL with the Base64-encoded image
        const apiUrl = `https://api.ocr.space/parse/imageurl?apikey=K89496159888957&url=${encodeURIComponent(imageBase64)}`;

        // Make the GET request
        axios.get(apiUrl)
            .then(response => {
                const ocrResult = response.data;
                console.log('OCR Result:', ocrResult);
            })
            .catch(error => {
                console.error('Error making OCR API request:', error);
            });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
