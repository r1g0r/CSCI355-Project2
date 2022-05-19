const fs = require("fs");
const express = require('express');
const path = require('path');
const { Readable } = require("stream");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) =>{
	console.log("New Client Connected.");
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/getList', (req, res) =>{
	// fs.readFile('./output/playList.json', 'utf8', (err, data) => {
	// 	if (err) {
	// 	  console.error(err);
	// 	  return;
	// 	}
	// 	data = JSON.parse(data);
	// 	console.log(data);
	//   });
	res.sendFile(path.join(__dirname, '/output/playList.json'));
});

app.use(express.json());

app.post('*', (req, res) => {
	console.log("POST Request Recieved.");
	req.body; // JavaScript object containing the parsed JSON
	//res.json(req.body);
	//console.log(typeof(JSON.stringify(req.body)));
	let content = JSON.stringify(req.body, null, 2);

	fs.writeFile('./output/playList.json', content, err => {
		if (err) 
			console.error(err);
		else {
			console.log("Playlist Written Successfully.")
		}
	});

});

app.use(function(req, res, next) {
	res.status(404).render('error/404.html');
});


app.listen(port, ()=> {
	console.log(`Express Server Listening On Port ${port}!`);
});