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
    id: 'notFound',
  };

  if (request.method === 'HEAD') return respondJSONMeta(request, response, 404);
  return respondJSON(request, response, 404, content);
};

// needs to be refactored for usernames!!
const addActivity = (request, response, body) => {
  const responseJSON = {
    message: 'Date and Activity are both required',
  };

  if (!body.date || !body.activity) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201; // success

  console.dir(body.date);

  if (activities[body.username][body.date]) responseCode = 204; // updated
  else activities[body.username][body.date] = {};

  activities[body.username][body.date][body.activity] = {};
  activities[body.username][body.date][body.activity].activity = body.activity;
  if (body.notes) activities[body.username][body.date][body.activity].notes = body.notes;
  console.dir(activities);

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const getActivities = (request, response) => {
  if (request.method === 'GET') {
    respondJSON(request, response, 200, activities);
  } else if (request.method === 'HEAD') {
    respondJSONMeta(request, response, 200);
  }
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Username is required',
  };

  let responseCode = 201;

  if (activities[body.username]) {
    responseCode = 403;
    responseJSON.message = 'User already exists';
  } else {
    activities[body.username] = {};
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
  }

  return respondJSON(request, response, responseCode, responseJSON);
};

// returns true if the username exists
const checkUser = (request, response, body) => {
  const username = body.query.slice(9); // query is 'username='
  const responseJSON = {
    result: 'false',
  };

  console.log(activities[username]);
  if (activities[username]) responseJSON.result = 'true';

  return respondJSON(request, response, 201, responseJSON);
};

module.exports = {
  notFound,
  addActivity,
  getActivities,
  addUser,
  checkUser,
};
