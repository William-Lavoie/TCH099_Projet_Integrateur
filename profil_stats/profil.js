
document.addEventListener('DOMContentLoaded', function() {
    // Cibler le bouton "Modifier" grâce à sa classe
    const editButton = document.querySelector('.edit-button');

    // Cibler l'onglet de modification grâce à son id
    const modifierOnglet = document.getElementById('modifier-onglet');

    // Ajouter un écouteur d'événement de clic au bouton "Modifier"
    editButton.addEventListener('click', function() {
        // Alterner la visibilité de l'onglet de modification
        if (modifierOnglet.style.display === 'none') {
            modifierOnglet.style.display = 'block';
        } else {
            modifierOnglet.style.display = 'none';
        }
    });
});

// pour la modification NOM
document.getElementById('modifier-nom').addEventListener('click', function() {
    let nouveauNom = prompt("Entrez votre nouveau nom :"); // Demande le nouveau nom à l'utilisateur
    if (nouveauNom) {
        let baseDonne = new baseDonne();
        baseDonne.append('nouveauNom', nouveauNom); 

        const donnees ={"nom" : nouveauNom};

        fetch("http://localhost:3333/profil.php/modifier_nom", { // Envoie une requête POST au serveur
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
document.getElementById('modifier-Photo').addEventListener('click', function() {
    //un clic sur l'input de type fichier
    document.getElementById('inputPhotoProfil').click(); 
});

document.getElementById('inputPhotoProfil').addEventListener('change', function(event) {
    // je récupère le fichier sélectionné
    let fichier = event.target.files[0]; 

    if (fichier) {
        let baseDonne = new baseDonne();

        // jajoute le fichier à l'objet baseDonne
        baseDonne.append('photoProfil', fichier); 
        const dataP = {"photo" : fichier};

        fetch("http://localhost:3333/profil.php/modifier_nom", { 
            // envoier une requête POST au serveur
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataP)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // mise à jour l'image de profil sur la page
                document.getElementById('photo-profil').src = data.nouvelleUrlPhoto;
                alert("La photo de profil a été mise à jour.");
            } else {
                alert("Erreur lors de la mise à jour de la photo de profil.");
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});

