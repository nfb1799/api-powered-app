const respond = (request, response, status, content, type) => {
    response.writeHead(status, { 'Content-Type': type });
    response.write(content);
    response.end();
};

const respondJSON = (request, response, status, content) => {
    respond(request, response, status, JSON.stringify(content), 'application/json');
};

const notFound = (request, response) => {
    const content = {
        message: 'The page you are looking for was not found.',
        id: 'notFound'
    };

    return respondJSON(request, response, 404, content);
};

module.exports = {
    notFound,
};