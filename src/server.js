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
    notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedURL) => {
    if(parsedURL.pathname === '/addActivity') {
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
        
            jsonHandler.addActivity(request, response, bodyParams);
        });
    }
};

const onRequest = (request, response) => {
    const parsedURL = url.parse(request.url);

    if(request.method === 'POST') {
        handlePost(request, response, parsedURL);
    } else {
        if (urlStruct[parsedURL.pathname]) {
            urlStruct[parsedURL.pathname](request, response);
        } else {
            urlStruct.notFound(request, response);
        }
    }

    
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
