const parseJSON = (xhr, content) => {
  const obj = JSON.parse(xhr.response);
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  else {
    const userList = document.createElement('p');
    userList.textContent = xhr.response;
    content.appendChild(userList);
  }
};

const handleResponse = (xhr) => {
  const content = document.querySelector('#content');
  content.innerHTML = "";

  switch(xhr.status) {
    case 200:
      content.innerHTML = '<b>Success!</b>';
      break;
    case 201:
      content.innerHTML = '<b>Created!</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated</b>'
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

  if(xhr.response) {
    parseJSON(xhr, content);
    console.dir(xhr.response);
  }
};

const sendPost = (e, activityForm) => {
  e.preventDefault();

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

  const formData = `date=${dateField.value}&activity=${activityField.value}&notes=${notesField.value}`;
  xhr.send(formData);

  return false;
};

const init = () => {
  const activityForm = document.querySelector('#activityForm');
  const addActivity = (e) => sendPost(e, activityForm);
  activityForm.addEventListener('submit', addActivity);
};

window.onload = init;