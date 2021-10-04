const activities = {};

const respond = (request, response, status, content, type) => {
    response.writeHead(status, { 'Content-Type': type });
    response.write(content);
    response.end();
};

const respondJSON = (request, response, status, content) => {
    respond(request, response, status, JSON.stringify(content), 'application/json');
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const notFound = (request, response) => {
    const content = {
        message: 'The page you are looking for was not found.',
        id: 'notFound'
    };

    return respondJSON(request, response, 404, content);
};

const addActivity = (request, response, body) => {
    const responseJSON = {
        message: 'Date and Activity are both required',
    };

    if(!body.date || !body.activity) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    console.dir(body.date);

    if(activities[body.date]) responseCode = 204;
    else activities[body.date] = {};

    activities[body.date].date = body.date;
    activities[body.date].activity = body.activity;
    if(body.notes) activities[body.date].notes = body.notes;

    if(responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
};

const getActivities = (request, response) => {
    respondJSON(request, response, 200, activities);
};

module.exports = {
    notFound,
    addActivity,
    getActivities,
};