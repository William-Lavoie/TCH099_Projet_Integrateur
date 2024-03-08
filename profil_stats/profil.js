
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

// pour la modification
document.getElementById('modifier-nom').addEventListener('click', function() {
    let nouveauNom = prompt("Entrez votre nouveau nom :"); // Demande le nouveau nom à l'utilisateur
    if (nouveauNom) {
        let baseDonne = new baseDonne();
        baseDonne.append('nouveauNom', nouveauNom); 

        fetch('/modifier-nom', { // Envoie une requête POST au serveur
            method: 'POST',
            body: baseDonne
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
