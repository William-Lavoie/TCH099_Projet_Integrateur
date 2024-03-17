$(document).ready(function() {
    // Hide menu-profil initially
    $('#menu-profil').hide();

    // Show menu-profil when mouse enters photo-profil
    $('#photo-profil').mouseenter(function() {
        $('#menu-profil').show();
    });

    // Hide menu-profil when mouse leaves photo-profil
    $('#photo-profil').mouseleave(function() {
        $('#menu-profil').hide();
    });
});
