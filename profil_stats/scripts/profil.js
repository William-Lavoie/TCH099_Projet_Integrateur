
document.addEventListener('DOMContentLoaded', function() {

    // Afficher la photo de profil 
    fetch(window.location.protocol + "//" + window.location.hostname + "/calendrier/api/api_calendrier.php/afficher_photo", {
    })
    .then(response => {

    if (response.ok) {

    return response.blob();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {

    if (data != undefined && data != null) {

        
        $("#photo").css({
        'background-image': 'url(' + URL.createObjectURL(data) + ')',

        });

    }})
    .catch(error => {

    
        $("#photo").css({
            'background-image': 'url("/structure/image_structure/image_profil_vide.png")',
        });
    });

    // Afficher le nom 
    fetch(window.location.protocol + "//" + window.location.hostname + "/calendrier/api/api_calendrier.php/afficher_nom", {
    })
    .then(response => {

    if (response.ok) {

    return response.json();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {
    
        $("#nom-prenom").text(data['nom']);        

    })
    .catch(error => {

    });

    // Afficher le courriel
     // Vérifier si le message a été écrit par l'utilisateur connecté
     fetch(window.location.protocol + "//" + window.location.hostname + "/calendrier/api/api_calendrier.php/chercher-courriel", {
    })
    .then(response => {

    if (response.ok) {

    return response.json();
    }

    else {
    }
    })
    .then(reponse => {

        $("#courriel-utilisateur").text(reponse);
    })
    .catch(error => {
    console.log(error);
    });  

    // Cibler l'onglet de modification grâce à son id
    const modifierOnglet = document.getElementById('modifier-onglet');

    // Ajouter un écouteur d'événement de clic au bouton "Modifier"
    $('#edit-button').on('click', function() {

        // Alterner la visibilité de l'onglet de modification
        $("#conteneur-boutons-modifications").toggleClass("modifier-visible");

    });

// pour la modification NOM
    $("#modifier-nom").on('click', function() {

        let nouveauNom = $("#nom-choisi").val(); 
       
      
        const donnees ={"nom" : nouveauNom};

        fetch(window.location.protocol + "//" + window.location.hostname + "/profil_stats/api/profil.php/modifier-nom", { // Envoie une requête POST au serveur
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
        })
        .then(response => response.json())
        .then(data => {
            
            window.location.reload();
        })
        .catch(error => console.error('Erreur:', error));
    });


   /* // pour la modification PHOTO 
    $('#modifier-photo').on('click', function(event) {

        event.preventDefault();
        // je récupère le fichier sélectionné
        let fichier = $("#photo-choisie")[0].files[0]; 
        console.log(fichier);
        if (fichier != null) {

            let reader = new FileReader();

            // Define a callback function to handle the loaded file data
            reader.onload = function(event) {
                // The result property contains the Blob data
                let blobData = event.target.result;
    
                // Now you can do something with the Blob data, such as sending it to the server
                sendBlobToServer(blobData);
            let formData = new FormData();
            formData.append('photo', blobData);
            
        fetch(window.location.protocol + "//" + window.location.hostname + "/profil_stats/api/profil.php/modifier-photo", { // Envoie une requête POST au serveur
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log("La photo a été modifiée avec succès")
            }

            else {
                console.log("La photo n'a pas été modifiée");
            }
        })
        .catch(error => console.error('Erreur:', error));
            
        }};

        else {
            alert("vous devez choisir une image");
        }
        });
*/
});
