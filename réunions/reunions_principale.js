
// Fonction pour aside pliable

// Le Domain Object Model est chargée
document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner les éléments nécessaires pour la transition
    var toggleButton = document.querySelector('#BtnPliable');
    var aside = document.querySelector('aside');
    var content = document.querySelector('#main_aside');
    var btnPliable = document.querySelector('.BtnPliable');
    
    toggleButton.addEventListener('click', function () {
        // État de la barre
        var isCollapsed = aside.classList.toggle('collapsed');

        // Changer la barre par rapport à son état
        if (isCollapsed) {
            btnPliable.classList.add('collapsed');
            content.classList.add('collapsed');
        } else {
            btnPliable.classList.remove('collapsed');
            content.classList.remove('collapsed');
        }
    });

    // Au survol de la souris, changer la couleur du bouton
    toggleButton.addEventListener('mouseenter', function () {
        toggleButton.style.color = '#a5a5a5';
    });

    // Lorsque la souris quitte, restaurer la couleur par défaut du bouton
    toggleButton.addEventListener('mouseleave', function () {
        toggleButton.style.color = ''; // Revenir à la couleur par défaut
    });
});