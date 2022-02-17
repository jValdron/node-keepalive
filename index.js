const axios = require('axios'),
      http = require('http'),
      https = require('https');

const client = axios.create({
  timeout: 40000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  httpAgent: new http.Agent({ keepAlive: true }),
});

const args = process.argv.slice(2),
      times = parseInt(args[0]) || 5,
      targetUrl = args[1] || 'https://reqbin.com/echo/get/json';

let totalTimes = 0,
    loop = null;

const requestListener = function (req, res) {
  if (req.url === '/once')
  {
    Promise.all(Array(times).map(() => client.get(targetUrl))).then(() => {
      totalTimes += times;
      res.writeHead(200);
      res.end(`Done! ... I have done ${totalTimes} requests in total since start`);
    });
  }
  else if (req.url === '/start')
  {
    res.writeHead(200);
    res.end(`Good to go... unlimited requests starting.`);

    loop = setInterval(() => {
      client.get(targetUrl).then(() => {
        totalTimes += times;
      });
    }, 1);
  }
  else if (req.url === '/stop')
  {
    if (loop)
    {
      clearInterval(loop);
      res.writeHead(200);
      res.end(`Requests stopped.`);
    }
    else
    {
      res.writeHead(400);
      res.end(`No requests loop running.`);
    }
  }
  else
  {
    res.writeHead(200);
    res.end(`Hello, World! ... I have done ${totalTimes} requests in total since start`);
  }
}

const server = http.createServer(requestListener);
server.listen(8080);
console.log('Listening on 8080...');
