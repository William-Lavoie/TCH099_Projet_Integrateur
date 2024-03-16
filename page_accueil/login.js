document.addEventListener("DOMContentLoaded", function() {

auth0.createAuth0Client({
    domain: "projet-integrateur-eq2.us.auth0.com",
    clientId: "nrLsb1vilAv0TV5kTpyqmP7Gt0NfiXcs",
    authorizationParams: {
        redirect_uri: "http://127.0.0.1:3000/calendrier/calendrier.html" // Specify your desired redirect URL
    }
  }).then(async (auth0Client) => {
    // Assumes a button with id "login" in the DOM
    const loginButton = document.getElementById("connecter");
    const inscriptionButton = document.getElementById("inscrire");
    


    //bouton d'authentification
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.loginWithRedirect();
    });

    //bouton d'inscription
    inscriptionButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.loginWithRedirect({authorizationParams: {
        screen_hint: "signup",
      }})
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

  //const userId = userProfile.user_id; //****************************************** */

      // profile de Auth0
      const profileElement = document.getElementById("profile");
  
      if (userProfile) {
        console.log(userProfile.name);
      //  profileElement.innerHTML = `<p>${userProfile.name}</p>`;
      } else {
        profileElement.style.display = "none";
      }

      // Envoie de l'identifiant de l'utilisateur 
      const identifiants = {"courriel": userProfile.name};

      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/envoyer_identifiant", {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(identifiants)
       })
       .then(response => {
   
       if (response.ok) {
            console.log("Succès");
       }
       else {
           console.log("La requête n'a pas fonctionnée");
       }
       });
    
  });

 
});
  //<img src="${userProfile.picture}" />
