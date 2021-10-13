const tasks = {};

// Sends a response with a given status code, content, and type
const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// Stringifies JSON content and sends the proper content type to respond()
const respondJSON = (request, response, status, content) => {
  respond(request, response, status, JSON.stringify(content), 'application/json');
};

// Sends meta data back for a JSON response
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Responds with code 404
const notFound = (request, response) => {
  const content = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (request.method === 'HEAD') return respondJSONMeta(request, response, 404);
  return respondJSON(request, response, 404, content);
};

// Adds a task to a specific users list
// Responds with code 400 when parameters are missing
// Responds with code 204 when a task gets updated
const addTask = (request, response, body) => {
  const responseJSON = {
    message: 'Date and task are both required',
  };

  if (!body.date || !body.task) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201; // success

  if (tasks[body.username][body.date]) responseCode = 204; // updated
  else tasks[body.username][body.date] = {};

  tasks[body.username][body.date][body.task] = {};
  tasks[body.username][body.date][body.task].task = body.task;
  tasks[body.username][body.date][body.task].type = body.type;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// Filters tasks based on a given task type for specific users
// Returns a filter list of tasks for that user
const filterTasks = (username, type) => {
  const filteredTasks = {};
  filteredTasks[username] = {};
  Object.keys(tasks[username]).forEach((date) => {
    Object.entries(tasks[username][date]).forEach((e) => {
      if (e[1].type === type) {
        filteredTasks[username][date] = {};
        filteredTasks[username][date][e[0]] = {};
        filteredTasks[username][date][e[0]].task = e[1].task;
        filteredTasks[username][date][e[0]].type = e[1].type;
      }
    });
  });

  return filteredTasks;
};

// Returns a list of tasks
// Filters them if parameters are present
const getTasks = (request, response, body, params) => {
  if (!params.type) {
    if (request.method === 'GET') {
      respondJSON(request, response, 200, tasks);
    } else if (request.method === 'HEAD') {
      respondJSONMeta(request, response, 200);
    }
  } else {
    const filteredTasks = filterTasks(params.username, params.type);

    if (request.method === 'GET') {
      respondJSON(request, response, 200, filteredTasks);
    } else if (request.method === 'HEAD') {
      respondJSONMeta(request, response, 200);
    }
  }
};

// Adds a new user to the task list
// Responds with a different message if the user already exists
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Username Created Successfully',
  };

  if (tasks[body.username]) {
    responseJSON.message = 'User signed in';
  } else {
    tasks[body.username] = {};
  }

  return respondJSON(request, response, 201, responseJSON);
};

module.exports = {
  notFound,
  addTask,
  getTasks,
  addUser,
};
