const parseJSON = (xhr, content) => {
  const obj = JSON.parse(xhr.response);
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `${obj.message}`;
    content.appendChild(p);
  }
};

const handleResponse = (xhr, display) => {
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

  if(xhr.response) {
    parseJSON(xhr, response);
  }
};

const displayTasks = (xhr) => {
  const username = localStorage.getItem('username');
  const responseJSON = JSON.parse(xhr.response);
  const content = document.querySelector('#content');
  let task;

  content.innerHTML = "";

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

const requestUpdate = (e, form) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/getTasks');

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => displayTasks(xhr); 

  xhr.send();

  e.preventDefault();
  return false;
};

const filterByTask = (e, filterForm) => {
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

const sendUserName = (username) => {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/addUser');

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

    if(obj.result == 'false') {
      sendUserName(username);
      init();
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
// users need a username in order to see only their tasks 
const userNamePopUp = () => {
  
  if(localStorage.getItem('username') == null) {
    let p;
    
    do {
      p = prompt("Please enter a username", "");
    } while (p == null || p == "");

    localStorage.setItem('username', p);
    checkUserName(p);
  }
};

window.onload = userNamePopUp;