const fs = require("fs");
const express = require('express');
const path = require('path');
//const { Readable } = require("stream");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/about.html', (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/about.html'));
});

app.get('/editor.html', (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/editor.html'));
});

app.get('/playList.html', (req, res) =>{
	res.sendFile(path.join(__dirname, '/public/playList.html'));
});

app.get('/getList', (req, res) =>{
	// fs.readFile('./output/playList.json', 'utf8', (err, data) => {
	// 	if (err) {
	// 	  console.error(err);
	// 	  return;
	// 	}
	// 	data = JSON.parse(data);
	//   });
	res.sendFile(path.join(__dirname, '/output/playList.json'));
});

app.get('*', (req, res) =>{
	console.log("GET request received from: " + req.ip);
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use(express.json());

app.post('/write', (req, res) => {
	console.log("POST request to write playlist recieved from: " + req.ip);
	req.body; // JavaScript object containing the parsed JSON
	//res.json(req.body);
	//console.log(typeof(JSON.stringify(req.body)));
	let content = JSON.stringify(req.body, null, 2);

	fs.writeFile('./output/playList.json', content, err => {
		if (err) 
			console.error(err);
		else {
			console.log("Playlist written successfully to server.")
		}
	});

});

app.post('/pull', (req, res) => {
	console.log("POST request to retrieve playlist recieved from: " + req.ip);
	req.body; // JavaScript object containing the parsed JSON
	//res.json(req.body);
	//console.log(typeof(JSON.stringify(req.body)));
	res.sendFile(path.join(__dirname, '/output/playList.json'));
	console.log("Last Saved Playlist sent to: " + req.ip);
});

// app.use(function(req, res, next) {
// 	res.status(404).render('error/404.html');
// });

app.listen(port, ()=> {
	console.log(`Express server listening on port: ${port}!`);
});