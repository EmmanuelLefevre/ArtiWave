// Get access token from local storage
function getAccessToken() {
  // Local storage not available in execution environment
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('artiwave_access_token');
  }
  return null;
}

// Set access token to local storage
function setAccessToken(token) {
  // Local storage not available in execution environment
  if (typeof localStorage !== 'undefined') {
    if (token !== undefined) {
      localStorage.setItem('artiwave_access_token', token);
    }
    else {
      deleteAccessToken();
    }
  }
}

// Delete access token from local storage
function deleteAccessToken() {
  // Local storage not available in execution environment
  if (typeof localStorage !== 'undefined') {
    const accessToken = localStorage.getItem('artiwave_access_token');
    if (accessToken !== null) {
      localStorage.removeItem('artiwave_access_token');
    }
  }
}

// Get connection status
function getConnectionStatus() {
  // Value converted to boolean
  return !!getAccessToken();
}

// Parse token
function parseToken(token) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

// Get nickname from token
function getNicknameFromToken(tokenContent) {
  // Checks if token content is defined nickname key is present in token
  if (!tokenContent || !tokenContent.nickname) {
    return null;
  }
  // Returns value of nickname key
  return tokenContent.nickname;
}