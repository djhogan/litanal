const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'www')));

app.get('/book/:title', (req, res) => {
  const { spawn } = require('child_process');
  const pyProg = spawn('python', ['./scripts/afinn_analysis.py']);
  pyProg.stdout.on('data', function(data) {
    res.write(data);
  });
  pyProg.on('exit', function() {
    res.end();
  })
  var readStream = fs.createReadStream('./books/' + req.params.title + '.txt',{encoding:'utf8'});
  readStream.pipe(pyProg.stdin);
});

app.listen(port, () => console.log('Application listening on port ' + port + '!'));
