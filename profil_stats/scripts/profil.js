
document.addEventListener('DOMContentLoaded', function() {

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
