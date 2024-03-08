
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
