"use strict";

var parseJSON = function parseJSON(xhr, content) {
  var obj = JSON.parse(xhr.response);

  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "Message: ".concat(obj.message);
    content.appendChild(p);
  } else {
    var userList = document.createElement('p');
    userList.textContent = xhr.response;
    content.appendChild(userList);
  }
};

var handleResponse = function handleResponse(xhr) {
  var content = document.querySelector('#content');
  content.innerHTML = "";

  switch (xhr.status) {
    case 200:
      content.innerHTML = '<b>Success!</b>';
      break;

    case 201:
      content.innerHTML = '<b>Created!</b>';
      break;

    case 204:
      content.innerHTML = '<b>Updated</b>';
      break;

    case 400:
      content.innerHTML = '<b>Bad Request :(</b>';
      break;

    case 404:
      content.innerHTML = '<b>Resource Not Found</b>';
      break;

    default:
      content.innerHTML = '<p>Error code not implemented by client! :(</p>';
      break;
  }

  if (xhr.response) {
    parseJSON(xhr, content);
    console.dir(xhr.response);
  }
};

var requestUpdate = function requestUpdate(e, userForm) {
  var url = userForm.querySelector('#urlField').value;
  var method = userForm.querySelector('#methodSelect').value;
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  xhr.send();
  e.preventDefault();
  return false;
};

var sendPost = function sendPost(e, nameForm) {
  e.preventDefault();
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');
  var nameField = nameForm.querySelector('#nameField');
  var ageField = nameForm.querySelector('#ageField');
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "name=".concat(nameField.value, "&age=").concat(ageField.value);
  xhr.send(formData);
  return false;
};

var init = function init() {
  var nameForm = document.querySelector('#nameForm');

  var addUser = function addUser(e) {
    return sendPost(e, nameForm);
  };

  nameForm.addEventListener('submit', addUser);
  var userForm = document.querySelector('#userForm');

  var getUsers = function getUsers(e) {
    return requestUpdate(e, userForm);
  };

  userForm.addEventListener('submit', getUsers);
};

window.onload = init;
