"use strict";

var parseJSON = function parseJSON(xhr, content) {
  var obj = JSON.parse(xhr.response);

  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "".concat(obj.message);
    content.appendChild(p);
  }
};

var handleResponse = function handleResponse(xhr, display) {
  var response = document.querySelector('#response');
  var username = document.querySelector('#username');
  response.innerHTML = "";

  switch (xhr.status) {
    case 200:
      response.innerHTML = '<b>Success!</b>';
      break;

    case 201:
      response.innerHTML = '<b>Created!</b>';
      break;

    case 204:
      response.innerHTML = '<b>Task Updated!</b>';
      break;

    case 400:
      response.innerHTML = '<b>Bad Request :(</b>';
      break;

    case 404:
      response.innerHTML = '<b>Resource Not Found</b>';
      break;

    default:
      response.innerHTML = '<p>Error code not implemented by client! :(</p>';
      break;
  }

  username.innerHTML = "User: ".concat(localStorage.getItem('username'));

  if (xhr.response) {
    parseJSON(xhr, response);
  }
};

var displayTasks = function displayTasks(xhr) {
  var username = localStorage.getItem('username');
  var responseJSON = JSON.parse(xhr.response);
  var content = document.querySelector('#content');
  var task;
  content.innerHTML = "";

  for (var date in responseJSON[username]) {
    content.innerHTML += "<div id=\"_".concat(date, "\"></div>");
    task = document.querySelector("#_".concat(date.toString()));
    task.innerHTML += "<h3>".concat(date, "</h3>");

    for (var t in responseJSON[username][date]) {
      task.innerHTML += "<b>Task: ".concat(responseJSON[username][date][t].task, "</b>");
      task.innerHTML += "<p class=\"".concat(responseJSON[username][date][t].type, "\">Type: ").concat(responseJSON[username][date][t].type, "</p>");
    }
  }
};

var requestUpdate = function requestUpdate(e, form) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getTasks');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return displayTasks(xhr);
  };

  xhr.send();
  e.preventDefault();
  return false;
};

var filterByTask = function filterByTask(e, filterForm) {
  var url = filterForm.querySelector('#typeFilter').value;
  var username = localStorage.getItem('username');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "".concat(url, "&username=").concat(username));
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return displayTasks(xhr);
  };

  xhr.send();
  e.preventDefault();
  return false;
};

var sendPost = function sendPost(e, taskForm) {
  e.preventDefault();
  var username = localStorage.getItem('username');
  var taskAction = taskForm.getAttribute('action');
  var taskMethod = taskForm.getAttribute('method');
  var dateField = taskForm.querySelector('#dateField');
  var taskField = taskForm.querySelector('#taskField');
  var typeField = taskForm.querySelector('#typeField');
  var xhr = new XMLHttpRequest();
  xhr.open(taskMethod, taskAction);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    handleResponse(xhr);
    requestUpdate(e);
  };

  var formData = "username=".concat(username, "&date=").concat(dateField.value, "&task=").concat(taskField.value, "&type=").concat(typeField.value);
  xhr.send(formData);
  return false;
};

var sendUserName = function sendUserName(username) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addUser');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "username=".concat(username);
  xhr.send(formData);
  return false;
};

var checkUserName = function checkUserName(username) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/checkUser?username=".concat(username));
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //checks usernames until a unique one is entered 

  xhr.onload = function () {
    var obj = JSON.parse(xhr.response);

    if (obj.result == 'false') {
      sendUserName(username);
      init();
    } else {
      var p;

      do {
        p = prompt("Username is already in use. Enter a different username.", "");
      } while (p == null || p == "");

      localStorage.setItem('username', p);
      checkUserName(p);
    }
  };

  xhr.send();
  return false;
};

var init = function init() {
  var taskForm = document.querySelector('#taskForm');

  var addTask = function addTask(e) {
    return sendPost(e, taskForm);
  };

  taskForm.addEventListener('submit', addTask);
  var filterForm = document.querySelector('#filterForm');

  var filterTasks = function filterTasks(e) {
    return filterByTask(e, filterForm);
  };

  filterForm.addEventListener('change', filterTasks);
}; // https://www.w3schools.com/js/js_popup.asp
// users need a username in order to see only their tasks 


var userNamePopUp = function userNamePopUp() {
  if (localStorage.getItem('username') == null) {
    var p;

    do {
      p = prompt("Please enter a username", "");
    } while (p == null || p == "");

    localStorage.setItem('username', p);
    checkUserName(p);
  } else {
    checkUserName(localStorage.getItem('username'));
  }
};

window.onload = userNamePopUp;
