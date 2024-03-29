$(document).ready(function() {

    //declaration des variables pour un path dynamic
    let protocol =  window.location.protocol + "//";
    let location = window.location.hostname;
    let port = ":" + window.location.port;
    let pathDynamic;

    if (location === 'localhost' || location === '127.0.0.1'){
        pathDynamic = protocol + location + port;
    }else {
    pathDynamic = protocol + location;
    }

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
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_photo", {
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
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_nom", {
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



//color toggle function
    const toggleButton = document.getElementById("toggleTheme");

    const elementsToToggle = [
        document.querySelector("body"),
        document.querySelector("#ligne-blanche-header"),
        document.querySelector("#lignes-decoratives-header"),
        ...document.querySelectorAll('.btn')
    ];

    /*
    const aside = document.querySelector("aside");
    const collapseBtn = document.querySelector("#collapseBtn");

    // verifying that aside and collapseBtn are in the page so that  
    // the script doesn't break for pages without those elements
    
    if (aside != null && collapseBtn != null) {
        elementsToToggle.push(
            aside,
            collapseBtn
        );
    }
    */

    // Retrieve theme from localStorage
    const savedTheme = localStorage.getItem("theme");

    function applyTheme(theme) {
        elementsToToggle.forEach(el => el.classList.toggle("dark", theme === "dark"));
        toggleButton.innerText = theme === "dark" ? '𖤓' : '☼';
    }

    //local storage for theme
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    toggleButton.addEventListener("click", function () {
        const isLightMode = document.body.classList.toggle("dark");

        // Save theme to localStorage
        localStorage.setItem("theme", isLightMode ? "dark" : "light");

        applyTheme(isLightMode ? "dark" : "light");
    });

});


