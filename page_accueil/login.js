auth0.createAuth0Client({
    domain: "projet-integrateur-eq2.us.auth0.com",
    clientId: "nrLsb1vilAv0TV5kTpyqmP7Gt0NfiXcs",
    authorizationParams: {
        redirect_uri: "http://127.0.0.1:3000/calendrier/calendrier.html" // Specify your desired redirect URL
    }
  }).then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("connecter");
  
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.loginWithRedirect();
    });
  
    if (location.search.includes("state=") && 
        (location.search.includes("code=") || 
        location.search.includes("error="))) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }
  
    // Assumes a button with id "logout" in the DOM
    const logoutButton = document.getElementById("logout");
  
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.logout();
    });
  
    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();
  
    // Assumes an element with id "profile" in the DOM
    const profileElement = document.getElementById("profile");
  
    if (isAuthenticated) {
      profileElement.style.display = "block";
      profileElement.innerHTML = `
              <p>${userProfile.name}</p>
              <img src="${userProfile.picture}" />
            `;
    } else {
      profileElement.style.display = "none";
    }
  });