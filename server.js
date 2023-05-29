const http = require('http');
const { spawn } = require('child_process');

const port = 8088;

const server = http.createServer((req, res) => {
  if (req.url !== '/brainiac-deploy') {
    res.writeHead(404);
    res.end();
    return;
  }

  const deploy = spawn('/bin/bash', ['/home/giorgi/programing/brainiac/deploy/deploy.sh']);

  deploy.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  deploy.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  deploy.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.writeHead(200);
  res.end('Deploying...');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

