const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker();

//Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage }).single('avatar');

app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res) => {
	res.render('index');
});

app.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
			if (err) return console.log('This is your error', err);

			worker
				.recognize(data, "eng", { tessjs_create_pdf: "1" })
				.progress((progress) => {
					console.log(progress);
				})
				.then(result => {
					res.send(result.text);
				})
				.finally(() => worker.terminate());
		});
	});
});

//Start up server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));
