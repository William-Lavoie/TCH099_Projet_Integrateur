document.addEventListener("DOMContentLoaded", function() {

    //declaration des path dynamic
    const pathDynamic = window.location.origin;

auth0.createAuth0Client({
        domain: "projet-integrateur-eq2.us.auth0.com",
        clientId: "nrLsb1vilAv0TV5kTpyqmP7Gt0NfiXcs",
        authorizationParams: {
                redirect_uri: pathDynamic + "/calendrier/calendrier.html" 
        }
    }).then(async (auth0Client) => {

        const loginButton = document.getElementById("connecter");
        const inscriptionButton = document.getElementById("inscrire");
        
        if(loginButton && inscriptionButton){
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
        }else{


            if (typeof location.search === 'string' &&
            (location.search.includes("state=") && 
            (location.search.includes("code=") || 
            location.search.includes("error=")))) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        }
    

        // Assumes a button with id "logout" in the DOM
        const logoutButton = document.getElementById("deconnexion");
    
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.logout();
        });

    const isAuthenticated = await auth0Client.isAuthenticated();


    //verifie si l'utilisateur est authentifie, si il ne l'ai pas, redirect to landing page
    if (!isAuthenticated) {
        //Redirect to the login page if the user is not authenticated
        window.location.href = 'https://huddleharbor.com';
    return;
    }

    //Si l'utilisateur est authentifier, utuliser les info
    const userProfile = await auth0Client.getUser();

    //const userId = userProfile.user_id; //****************************************** */

            // Envoie de l'identifiant de l'utilisateur 
            const identifiants = {"courriel": userProfile.name};

            fetch(pathDynamic + "/page_accueil/api/api_auth.php/envoyer_identifiant", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(identifiants)
            })
            .then(response => {
    
            if (response.ok) {
            }
            else {
                    console.log("La requête n'a pas fonctionnée");
            }
            });
        }

    }).catch(error => {
        console.log(error);
    });

});
