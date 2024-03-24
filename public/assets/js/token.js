// Get access token from local storage
function getAccessToken() {
  return localStorage.getItem('artiwave_access_token');
}

// Set access token to local storage
function setAccessToken(token) {
  localStorage.setItem('artiwave_access_token', token);
}

// Delete access token from local storage
function deleteAccessToken() {
  localStorage.removeItem('artiwave_access_token');
}

// Get connection status
function checkConnectionStatus() {
  // Check if an artiwave_access_token is present in local storage
  var isConnected = localStorage.getItem('artiwave_access_token');
  // console.log(isConnected);

  return isConnected ? true : false;
}