// Parses a basic JSON object for its message and displays it
const parseJSON = (xhr, content) => {
  const obj = JSON.parse(xhr.response);
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `${obj.message}`;
    content.appendChild(p);
  }
};

// Handles JSON responses from the server and updates HTML accordingly
const handleResponse = (xhr) => {
  const response = document.querySelector('#response');
  const username = document.querySelector('#username');
  
  response.innerHTML = "";

  
  switch(xhr.status) {
    case 200:
      response.innerHTML = '<b>Success!</b>';
      break;
    case 201:
      response.innerHTML = '<b>Created!</b>';
      break;
    case 204:
      response.innerHTML = '<b>Task Updated!</b>'
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

  username.innerHTML = `User: ${localStorage.getItem('username')}`;

  // If there's a message, parse and display it
  if(xhr.response) {
    parseJSON(xhr, response);
  }
};

// Displays tasks in bubbles separated by dates
// xhr.response must be a list of tasks for a specific user
const displayTasks = (xhr) => {
  const username = localStorage.getItem('username');
  const responseJSON = JSON.parse(xhr.response);
  const content = document.querySelector('#content');
  let task;

  content.innerHTML = "";

  // Separates bubbles by date
  // Multiple tasks can appear on the same date
  for(const date in responseJSON[username]) {
    content.innerHTML += `<div id="_${date}"></div>`;
    task = document.querySelector(`#_${date.toString()}`);

    task.innerHTML += `<h3>${date}</h3>`;

    for(const t in responseJSON[username][date]) {
      task.innerHTML += `<b>Task: ${responseJSON[username][date][t].task}</b>`;
      task.innerHTML += `<p class="${responseJSON[username][date][t].type}">Type: ${responseJSON[username][date][t].type}</p>`;
    }
  }
};

// Gets a full list of tasks from the server and displays them
const requestUpdate = (e, form) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/getTasks');

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => displayTasks(xhr); 

  xhr.send();

  e.preventDefault();
  return false;
};

// Gets a filtered list of tasks from the server and displays them
const filterByTask = (e, filterForm) => {
  console.log(filterForm.getAttribute('action'));
  const url = filterForm.querySelector('#typeFilter').value;
  const username = localStorage.getItem('username');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${url}&username=${username}`);

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => displayTasks(xhr); 

  xhr.send();

  e.preventDefault();
  return false;
}

// Sends task data to the server to be stored by username
const sendPost = (e, taskForm) => {
  e.preventDefault();

  const username = localStorage.getItem('username');

  const taskAction = taskForm.getAttribute('action');
  const taskMethod = taskForm.getAttribute('method');

  const dateField = taskForm.querySelector('#dateField');
  const taskField = taskForm.querySelector('#taskField');
  const typeField = taskForm.querySelector('#typeField');

  const xhr = new XMLHttpRequest();
  xhr.open(taskMethod, taskAction);

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () => { handleResponse(xhr); requestUpdate(e); };

  const formData = `username=${username}&date=${dateField.value}&task=${taskField.value}&type=${typeField.value}`;
  xhr.send(formData);
  return false;
};

// Sends a username to the server and runs init() onload
const sendUserName = (username) => {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/addUser');

  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  xhr.onload = () => { handleResponse(xhr); init(); };

  const formData = `username=${username}`;
  xhr.send(formData);

  return false;
}

const init = () => {
  const taskForm = document.querySelector('#taskForm');
  const addTask = (e) => sendPost(e, taskForm);
  taskForm.addEventListener('submit', addTask);

  const filterForm = document.querySelector('#filterForm');
  const filterTasks = (e) => filterByTask(e, filterForm);
  filterForm.addEventListener('change', filterTasks);
};

// https://www.w3schools.com/js/js_popup.asp
// Users need a username in order to see only their tasks 
const userNamePopUp = () => {
  
  if(localStorage.getItem('username') == null) {
    let p;
    
    do {
      p = prompt("Please enter a username", "");
    } while (p == null || p == "");

    localStorage.setItem('username', p);
  } 
  
  sendUserName(localStorage.getItem('username'));
};

window.onload = userNamePopUp;