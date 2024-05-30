document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const loginButton = document.getElementById('loginButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const responseSection = document.getElementById('responseSection');
  const responseElement = document.getElementById('response');
  const loginMessage = document.getElementById('loginMessage');

  loadingIndicator.style.display = 'block';
  loginButton.disabled = true;
  responseSection.style.display = 'none';
  loginMessage.style.display = 'none';

  fetch(`/appstate?e=${mobile}&p=${password}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Incorrect password or email');
      }
      return response.json();
    })
    .then(data => {
      return fetch('/file?src=appstate.json')
        .then(response => response.json())
        .then(fileData => {
          responseElement.textContent = JSON.stringify(fileData, null, 2);
          responseSection.style.display = 'block';
        });
    })
    .catch(error => {
      responseElement.textContent = '';
      loginMessage.textContent = error.message;
      loginMessage.style.display = 'block';
    })
    .finally(() => {
      loadingIndicator.style.display = 'none';
      loginButton.disabled = false;
    });
});

document.getElementById('copyButton').addEventListener('click', function() {
  const responseText = document.getElementById('response').textContent;
  navigator.clipboard.writeText(responseText)
    .then(() => {
      const copyMessage = document.getElementById('copyMessage');
      copyMessage.textContent = 'Appstate copied to clipboard successfully';
      copyMessage.style.display = 'block';
    })
    .catch(error => {
      console.error('Error copying to clipboard:', error);
    });
});

document.getElementById('passwordToggle').addEventListener('click', function() {
  const passwordField = document.getElementById('password');
  const toggleText = document.getElementById('passwordToggle');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    toggleText.textContent = 'Hide';
  } else {
    passwordField.type = 'password';
    toggleText.textContent = 'Show';
  }
});
