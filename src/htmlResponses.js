const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const style = fs.readFileSync(`${__dirname}/../hosted/style.css`);

const getIndex = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(index);
    response.end();
};

const getStyle = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(style);
    response.end();
};

module.exports = {
    getIndex,
    getStyle
};