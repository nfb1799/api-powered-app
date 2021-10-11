"use strict";

var parseJSON = function parseJSON(xhr, content) {
  var obj = JSON.parse(xhr.response);

  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "Message: ".concat(obj.message);
    content.appendChild(p);
  }

  console.dir(obj);
};

var handleResponse = function handleResponse(xhr, display) {
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

  console.dir(xhr);

  if (xhr.response) {
    parseJSON(xhr, content);
  }
};

var displayActivity = function displayActivity(xhr, date) {
  var responseJSON = JSON.parse(xhr.response);
  var content = document.querySelector('#content');

  if (responseJSON[date]) {
    content.innerHTML = "<h3>".concat(date, "</h3>");

    for (var act in responseJSON[date]) {
      console.dir(responseJSON[date][act]);
      content.innerHTML += "<b>".concat(responseJSON[date][act].activity, "</b>");
      if (responseJSON[date][act].notes) content.innerHTML += "<p>".concat(responseJSON[date][act].notes, "</p>");
    }
    /*content.innerHTML = `<h3>${date}</h3>`;
    content.innerHTML += `<b>${responseJSON[date].activity[0]}</b>`;
    content.innerHTML += `<p>Notes: ${responseJSON[date].notes}</p>`;*/

  } else {
    content.innerHTML = "No activities found on ".concat(date);
  }
};

var requestUpdate = function requestUpdate(e, activityForm) {
  var date = activityForm.querySelector('#dateField').value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getActivities');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return displayActivity(xhr, date);
  };

  xhr.send();
  e.preventDefault();
  return false;
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

  var getActivity = function getActivity(e) {
    return requestUpdate(e, activityForm);
  };

  activityForm.addEventListener('submit', addActivity);
  activityForm.addEventListener('submit', getActivity);
};

window.onload = init;
