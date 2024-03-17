$(document).ready(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#photo-profil').on('click', function() {
            if ($('#menu-profil').css('display') === 'none') {
                $('#menu-profil').css('display', 'flex');
            } else {
                $('#menu-profil').css('display', 'none');
            }
        });
    } else {
        // Initialiser menu-profil (déjà fait dans le CSS)
        $('#menu-profil').css('display', 'none');

        var surMenuProfil = false;

        // Lorsque la souris entre dans photo-profil, afficher menu-profil
        $('#photo-profil').mouseenter(function() {
            $('#menu-profil').css('display', 'flex');
        });

        // Vérifier si la souris est sur le menu-profil
        $('#menu-profil').mouseenter(function() {
            surMenuProfil = true;
        });

        // Lorsque la souris quitte photo-profil
        $('#photo-profil').mouseleave(function() {
            // Lorsque la souris quitte conteneur-compte
            $('#conteneur-compte').mouseleave(function() {
                // Si la prochaine destination n'est pas le menu-profil
                if (!surMenuProfil) {
                    $('#menu-profil').css('display', 'none');
                }
            });
        });

        // Lorsque la souris quitte le menu profil
        $('#menu-profil').mouseleave(function() {
            surMenuProfil = false;
            $('#menu-profil').css('display', 'none');
        });
    }
});