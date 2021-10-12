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
  var response = document.querySelector('#response');
  response.innerHTML = "";

  switch (xhr.status) {
    case 200:
      response.innerHTML = '<b>Success!</b>';
      break;

    case 201:
      response.innerHTML = '<b>Created!</b>';
      break;

    case 204:
      response.innerHTML = '<b>Updated</b>';
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

  console.dir(xhr);

  if (xhr.response) {
    parseJSON(xhr, response);
  }
};

var displayActivities = function displayActivities(xhr) {
  var responseJSON = JSON.parse(xhr.response);
  var content = document.querySelector('#content');
  var activity;
  content.innerHTML = "";

  for (var date in responseJSON) {
    console.dir(date);
    content.innerHTML += "<div id=\"_".concat(date, "\"></div>");
    activity = document.querySelector("#_".concat(date.toString()));
    activity.innerHTML += "<h3>".concat(date, "</h3>");

    for (var act in responseJSON[date]) {
      console.dir(responseJSON[date][act]);
      activity.innerHTML += "<b>Activity: ".concat(responseJSON[date][act].activity, "</b>");
      if (responseJSON[date][act].notes) activity.innerHTML += "<p>Notes: ".concat(responseJSON[date][act].notes, "</p>");
    }
  }
};

var requestUpdate = function requestUpdate(e, activityForm) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/getActivities');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return displayActivities(xhr);
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
  console.log(xhr);
  return false;
};

var sendUserName = function sendUserName(username) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/addUser');
  console.log(xhr);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    return handleResponse(xhr);
  };

  var formData = "username=".concat(username);
  xhr.send(formData);
  return false;
}; //returns true if username already exists


var checkUserName = function checkUserName(username) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'checkUser');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = function () {
    var obj = JSON.parse(xhr.response); //if(obj.result == 'false')
    //sendUserName(localStorage.getItem('username'));

    return obj.result == 'true';
  };

  var formData = "username=".concat(username);
  xhr.send(formData);
  console.log(xhr);
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
  activityForm.addEventListener('submit', getActivity); //console.log(localStorage.getItem('username'));
  //console.log(checkUserName(localStorage.getItem('username')));
}; // https://www.w3schools.com/js/js_popup.asp
// users need a username in order to see only their activities


var userNamePopUp = function userNamePopUp() {
  if (localStorage.getItem('username') == null) {
    var p;

    do {
      p = prompt("Please enter a username", "");
    } while (p == null || p == "");

    while (checkUserName(p)) {
      //loop until a valid name is entered
      p = prompt("Username is already in use. Enter a different username.", "");
    }

    console.log(checkUserName(p));
    localStorage.setItem('username', p);
  }

  init();
};

window.onload = userNamePopUp;
