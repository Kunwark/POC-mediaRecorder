const express = require('express');
const app = express();
const port = 3001;
const path = require('path');
const fs = require("fs");
const recordingsFolder = path.join(__dirname, 'recordings');
// Serve recordings statically

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/recordings', express.static(path.join(__dirname, 'recordings')));




// Define a route for the home page
app.get('/', (req, res) => {
    // Render the 'home.ejs' view
    res.render('index', { title: 'Screen recorder practice', recordingsFolder });
});

app.post('/save-recording', (req, res) => {
    const fileName = `recording_${Date.now()}.webm`;
    const filePath = path.join(recordingsFolder, fileName);
    const fileStream = fs.createWriteStream(filePath);

    res.header('Content-Type', 'video/webm')
    req.pipe(fileStream);

    fileStream.on('finish', () => {
        console.log('Recording saved!');
        res.status(200).header('Content-Type', 'video/webm').end();
    });

    fileStream.on('error', (err) => {
        console.error(err);
        console.log('Error saving recording');
        res.status(500).end(); // Send an error response
    });
});

app.get('/get-recordings', (req, res) => {
    // Read the contents of the recordings folder
    fs.readdir(recordingsFolder, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Error reading recordings folder' });
        }

        // Filter out non-webm files (adjust as needed)
        const webmFiles = files.filter(file => file.endsWith('.webm'));

        res.status(200).json({ success: true, recordings: webmFiles });
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
