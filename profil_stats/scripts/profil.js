
document.addEventListener('DOMContentLoaded', function() {

    // Afficher la photo de profil 
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/afficher_photo", {
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
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/afficher_nom", {
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
     fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher-courriel", {
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
    $('.edit-button').on('click', function() {
        // Alterner la visibilité de l'onglet de modification
        $("#modifier-onglet").toggleClass("onglet-visible");
    });

// pour la modification NOM
    $("#modifier-nom").on('click', function() {
        let nouveauNom = prompt("Entrez votre nouveau nom :"); // Demande le nouveau nom à l'utilisateur
        if (nouveauNom) {
      

        const donnees ={"nom" : nouveauNom};

        fetch("http://localhost:3333/profil_stats/api/profil.php", { // Envoie une requête POST au serveur
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mettre à jour l'affichage du nom sur la page
                document.getElementById('header_nom').querySelector('h1').textContent = nouveauNom;
            } else {
                alert("Erreur lors de la modification du nom.");
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});


// pour la modification PHOTO 
    $('#modifier-Photo').on('modifier-Photo', function(event) {
        // je récupère le fichier sélectionné
        let fichier = event.target.files[0]; 
        if (fichier) {
          const donneesP ={"photo" : fichier};

        fetch("http://localhost:3333/profil_stats/api/profil.php", { // Envoie une requête POST au serveur
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donneesP)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mettre à jour l'affichage du nom sur la page
                document.getElementById('conteneur_profile').querySelector('h1').textContent = fichier;
            } else {
                alert("Erreur lors de la modification de la photo de profil.");
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});

});
