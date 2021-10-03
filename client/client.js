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

const init = () => {
  
};

window.onload = init;