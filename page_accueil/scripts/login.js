document.addEventListener("DOMContentLoaded", function () {
  //declaration des path dynamic
    const pathDynamic = window.location.origin;

    auth0
        .createAuth0Client({
        domain: "projet-integrateur-eq2.us.auth0.com",
        clientId: "nrLsb1vilAv0TV5kTpyqmP7Gt0NfiXcs",
        authorizationParams: {
            audience:  'https://HHValidation/api',
            redirect_uri: pathDynamic + "/calendrier/calendrier.html",
        },
        })
        .then(async (auth0Client) => {
        const loginButton = document.getElementById("connecter");
        const inscriptionButton = document.getElementById("inscrire");

        //envoi l'utilisateur a la page d'authentification apres l'appuie du bouton de 
        if (loginButton && inscriptionButton) {
            //bouton d'authentification
            loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.loginWithRedirect();
            });

            //bouton d'inscription
            inscriptionButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.loginWithRedirect({
                authorizationParams: {
                screen_hint: "signup",
                },
            });
            });
        } else {
            if (
            typeof location.search === "string" &&
            location.search.includes("state=") &&
            (location.search.includes("code=") ||
                location.search.includes("error="))
            ) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
            }

            const logoutButton = document.getElementById("deconnexion");

            logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth0Client.logout();
            });

            const isAuthenticated = await auth0Client.isAuthenticated();

            //verifie si l'utilisateur n'est pas authentifier, renvoi a la page d'acceuil
            if (!isAuthenticated) {
            if (
                window.location.hostname === "localhost:" ||
                window.location.hostname === "127.0.0.1:"
            ) {
                window.location.href =
                window.location.protocol +
                window.location.hostname +
                window.location.port +
                "index.html";
            } else {
                window.location.href = "https://huddleharbor.com";
            }
            return;
            }

            const userProfile = await auth0Client.getUser();


            //recevoir token apres l'authentification
            const token = await auth0Client.getTokenSilently();
            
            console.log(token); //*********************************************************************
            // Evoi le token au backend
            fetch(
                pathDynamic + 
                "/page_accueil/api/JWTValidation.php/valider_token", 
                {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: token }),
            })
            .then((response) => {
                if (response.ok) {
                //Si l'utilisateur est authentifier et le token valider, utuliser les info

                // Envoie de l'identifiant de l'utilisateur
                const identifiants = { courriel: userProfile.name };

                fetch(
                    pathDynamic +
                    "/calendrier/api/api_calendrier.php/envoyer_identifiant",
                    {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(identifiants),
                    }
                ).then((response) => {
                    if (response.ok) {
                    } else {
                    console.log("La requête n'a pas fonctionnée");
                    
                    // si le token n'est pas valid, renvoi l'utilisateur a la page d'acceuil
                    window.location.href = "https://huddleharbor.com";

                    }
                });
               
                }
            })
            .catch((error) => {
                // error avec la validation de token
                console.error(error);
                returnError(error.message);
            });
        }
        })
        .catch((error) => {
        //erreur avec auth
        console.log(error);
        });
});
