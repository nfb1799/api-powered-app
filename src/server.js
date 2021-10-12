const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getStyle,
  '/bundle.js': htmlHandler.getBundle,
  '/getActivities': jsonHandler.getActivities,
  '/addUser': jsonHandler.addUser,
  notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedURL) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    if (parsedURL.pathname === '/addActivity') jsonHandler.addActivity(request, response, bodyParams);
    else if (parsedURL.pathname === '/addUser') jsonHandler.addUser(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else if (urlStruct[parsedURL.pathname]) {
    urlStruct[parsedURL.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
