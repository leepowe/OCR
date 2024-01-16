const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker();

//Storage
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads');
    },
    filename: (req, res, cb) => {
        cb(null, req.file);
    }
});
const upload = multer({ storage: storage }).single('avatar');

app.set('view engine', 'ejs');

// app.get('/uploads', (req, res) => {
//     console.log('uploads');
// })

//Start up server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log("Hey I'm running on port ${PORT}"));