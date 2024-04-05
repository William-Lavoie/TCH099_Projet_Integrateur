document.addEventListener("DOMContentLoaded", function () {
    //declaration des path dynamic
    const pathDynamic = window.location.origin;

    // Afficher la photo de profil
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_photo", {})
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                console.log("error");
            }
        })
        .then((data) => {
            if (data != undefined && data != null) {
                $("#photo").css({
                    "background-image": "url(" + URL.createObjectURL(data) + ")",
                });
            }
        })
        .catch((error) => {
            $("#photo").css({
                "background-image":
                    'url("/structure/image_structure/image_profil_vide.png")',
            });
        });

    // Afficher le nom
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_nom", {})
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("error");
            }
        })
        .then((data) => {
            $("#nom-prenom").text(data["nom"]);
        })
        .catch((error) => {});

    // Afficher le courriel
    // Vérifier si le message a été écrit par l'utilisateur connecté
    fetch(
        pathDynamic + "/calendrier/api/api_calendrier.php/chercher-courriel",
        {}
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((reponse) => {
            $("#courriel-utilisateur").text(reponse);
        })
        .catch((error) => {
            console.log(error);
        });

    // Cibler l'onglet de modification grâce à son id
    const modifierOnglet = document.getElementById("modifier-onglet");

    // Ajouter un écouteur d'événement de clic au bouton "Modifier"
    $("#edit-button").on("click", function () {
        // Alterner la visibilité de l'onglet de modification
        $("#conteneur-boutons-modifications").toggleClass("modifier-visible");
    });

    // pour la modification NOM
    $("#modifier-nom").on("click", function () {
        let nouveauNom = $("#nom-choisi").val();

        const donnees = { nom: nouveauNom };

        fetch(pathDynamic + "/profil_stats/api/profil.php/modifier-nom", {
            // Envoie une requête POST au serveur
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donnees),
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => console.error("Erreur:", error));
    });



    // modifier photo de profil 
    document.addEventListener("DOMContentLoaded", function () {
        const pathDynamic = window.location.origin;
    
        // Gérer le clic sur le bouton de modification de la photo
        $("#modifier-photo").on("click", function () {
            let fichierPhoto = $('#photo-choisie')[0].files[0];  // Récupérer le fichier sélectionné
    
            if (fichierPhoto) {
                let formData = new FormData();
                formData.append('photo', fichierPhoto);  // Ajouter le fichier à l'objet FormData
    
                fetch(pathDynamic + "/profil_stats/api/profil.php/modifier-photo", {
                 method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees),
            

                    
                })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        // Mettre à jour l'affichage de la photo de profil
                        $("#photo").css("background-image", `url(${URL.createObjectURL(fichierPhoto)})`);
                    } else {
                        alert('Erreur lors de la modification de la photo de profil.');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                });
            }
        });
    });
    

    
});
