const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

// serve resources in `www`
app.use(express.static(path.join(__dirname, 'www')));

// route GET request for sentiment analysis of a book
app.get('/book/:title', (req, res) => {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['./scripts/afinn_analysis.py']);
	
	// pipe stdout of python script to reponse
  pyProg.stdout.on('data', function(data) {
    res.write(data);
  });

  pyProg.on('exit', function() {
    res.end();
  })

	// create stream from book text
  var readStream = fs.createReadStream('./books/' + req.params.title + '.txt',{encoding:'utf8'});

  readStream.pipe(pyProg.stdin);
});

// start listening on port
app.listen(port, () => console.log('Application listening on port ' + port + '!'));
