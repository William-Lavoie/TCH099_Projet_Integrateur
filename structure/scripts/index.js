$(document).ready(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Afficher le menu-profil sur mobile si on clique sur photo-profil
        $('#photo-profil-header').on('click', function() {
            if ($('#menu-profil-header').css('display') === 'none') {
                $('#menu-profil-header').css('display', 'flex');
            } else {
                $('#menu-profil-header').css('display', 'none');
            }
        });
    } else {
        // Initialiser menu-profil (déjà fait dans le CSS)
        $('#menu-profil-header').css('display', 'none');

        var surMenuProfil = false;

        // Lorsque la souris entre dans photo-profil, afficher menu-profil
        $('#photo-profil-header').mouseenter(function() {
            $('#menu-profil-header').css('display', 'flex');
        });

        // Vérifier si la souris est sur le menu-profil
        $('#menu-profil-header').mouseenter(function() {
            surMenuProfil = true;
        });

        // Lorsque la souris quitte photo-profil
        $('#photo-profil-header').mouseleave(function() {
            // Lorsque la souris quitte conteneur-compte
            $('#conteneur-compte-header').mouseleave(function() {
                // Si la prochaine destination n'est pas le menu-profil
                if (!surMenuProfil) {
                    $('#menu-profil-header').css('display', 'none');
                }
            });
        });

        // Lorsque la souris quitte le menu profil
        $('#menu-profil-header').mouseleave(function() {
            surMenuProfil = false;
            $('#menu-profil-header').css('display', 'none');
        });
    }

    /**
   * AFFICHER_PHOTO
   * Permet d'afficher dans l'en-tête la photo de profil de l'utilisateur connecté
   */
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
    const img = document.createElement('img');

    if (data != undefined && data != null) {

        $("#photo-profil-header").css({
        'background-image': 'url(' + URL.createObjectURL(data) + ')',

        });

    }})
    .catch(error => {

    
        $("#photo-profil-header").css({
            'background-image': 'url("/structure/image_structure/image_profil_vide.png")',
        });
    });

    /**
   * AFFICHER_NOM
   * Permet d'afficher dans l'en-tête le nom de l'utilisateur connecté
   */
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
    
        $("#info-header label").text(data['nom']);        

    })
    .catch(error => {

    });

});
