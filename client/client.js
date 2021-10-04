const parseJSON = (xhr, content) => {
  const obj = JSON.parse(xhr.response);
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  console.dir(obj);
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
  console.dir(xhr);
  if(xhr.response) {
    parseJSON(xhr, content);
  }
};

const displayActivity = (xhr, date) => {
  const responseJSON = JSON.parse(xhr.response);

  const content = document.querySelector('#content');

  if(responseJSON[date]) {
    content.innerHTML = `<b>${responseJSON[date].activity} - (${date})</b>`;
    content.innerHTML += `<p>Notes: ${responseJSON[date].notes}</p>`;
  } else {
    content.innerHTML = `No activities found on ${date}`;
  }
};

const requestUpdate = (e, dateForm) => {
  const date = dateForm.querySelector('#getDateField').value;
  
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/getActivities');

  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = () => displayActivity(xhr, date); 

  xhr.send();

  e.preventDefault();
  return false;
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

  const dateForm = document.querySelector('#dateForm');
  const getActivity = (e) => requestUpdate(e, dateForm);
  dateForm.addEventListener('submit', getActivity);
};

window.onload = init;