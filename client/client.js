const parseJSON = (xhr, content) => {
  const obj = JSON.parse(xhr.response);
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  console.dir(obj);
};

const handleResponse = (xhr, display) => {
  const response = document.querySelector('#response');
  
  response.innerHTML = "";

  
  switch(xhr.status) {
    case 200:
      response.innerHTML = '<b>Success!</b>';
      break;
    case 201:
      response.innerHTML = '<b>Created!</b>';
      break;
    case 204:
      response.innerHTML = '<b>Updated</b>'
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
  if(xhr.response) {
    parseJSON(xhr, response);
  }
};

const displayActivities = (xhr) => {
  const username = localStorage.getItem('username');
  const responseJSON = JSON.parse(xhr.response);
  const content = document.querySelector('#content');
  let activity;

  content.innerHTML = "";

  for(const date in responseJSON[username]) {
    console.dir(date);
    content.innerHTML += `<div id="_${date}"></div>`;
    activity = document.querySelector(`#_${date.toString()}`);

    activity.innerHTML += `<h3>${date}</h3>`;

    for(const act in responseJSON[username][date]) {
      console.dir(responseJSON[username][date][act]);
      activity.innerHTML += `<b>Activity: ${responseJSON[username][date][act].activity}</b>`;
      if(responseJSON[username][date][act].notes) 
      activity.innerHTML += `<p>Notes: ${responseJSON[username][date][act].notes}</p>`;
    }
  }
};

const requestUpdate = (e, activityForm) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/getActivities');

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => displayActivities(xhr); 

  xhr.send();

  e.preventDefault();
  return false;
};

const sendPost = (e, activityForm) => {
  e.preventDefault();

  const username = localStorage.getItem('username');

  const activityAction = activityForm.getAttribute('action');
  const activityMethod = activityForm.getAttribute('method');

  const dateField = activityForm.querySelector('#dateField');
  const activityField = activityForm.querySelector('#activityField');
  const notesField = activityForm.querySelector('#notesField');

  const xhr = new XMLHttpRequest();
  xhr.open(activityMethod, activityAction);

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () => handleResponse(xhr);

  const formData = `username=${username}&date=${dateField.value}&activity=${activityField.value}&notes=${notesField.value}`;
  xhr.send(formData);
  console.log(xhr);
  return false;
};

const sendUserName = (username) => {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/addUser');

  console.log(xhr);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () => handleResponse(xhr);

  const formData = `username=${username}`;
  xhr.send(formData);

  return false;
}

const checkUserName = (username) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/checkUser?username=${username}`);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  //checks usernames until a unique one is entered 
  xhr.onload = () => {
    let obj = JSON.parse(xhr.response);
    console.log(obj);

    if(obj.result == 'false') {
      sendUserName(username);
    } else {
      let p;
      do {
        p = prompt("Username is already in use. Enter a different username.", "");
      } while (p == null || p == "");
      localStorage.setItem('username', p);
      checkUserName(p);
    }
  };

  xhr.send();
  console.log(xhr);
  
  return false; 
}

const init = () => {
  const activityForm = document.querySelector('#activityForm');
  const addActivity = (e) => sendPost(e, activityForm);
  const getActivity = (e) => requestUpdate(e, activityForm);
  activityForm.addEventListener('submit', addActivity);
  activityForm.addEventListener('submit', getActivity);
  //console.log(localStorage.getItem('username'));
  //console.log(checkUserName(localStorage.getItem('username')));
  //checkUserName(username);
};

// https://www.w3schools.com/js/js_popup.asp
// users need a username in order to see only their activities
const userNamePopUp = () => {
  
  if(localStorage.getItem('username') == null) {
    let p;
    
    do {
      p = prompt("Please enter a username", "");
    } while (p == null || p == "");

    localStorage.setItem('username', p);
    checkUserName(p);
  } else {
    checkUserName(localStorage.getItem('username'));
  }

  init();
};

window.onload = userNamePopUp;