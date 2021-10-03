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

var sendPost = function sendPost(e, activityForm) {
  e.preventDefault();
  var activityAction = activityForm.getAttribute('action');
  var activityMethod = activityForm.getAttribute('method');
  var dateField = activityForm.querySelector('#dateField');
  var activityField = activityForm.querySelector('#activityField');
  var notesField = activityForm.querySelector('#notesField');
  var xhr = new XMLHttpRequest();
  xhr.open(activityMethod, activityAction);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "date=".concat(dateField.value, "&activity=").concat(activityField.value, "&notes=").concat(notesField.value);
  xhr.send(formData);
  return false;
};

var init = function init() {
  var activityForm = document.querySelector('#activityForm');

  var addActivity = function addActivity(e) {
    return sendPost(e, activityForm);
  };

  activityForm.addEventListener('submit', addActivity);
};

window.onload = init;
