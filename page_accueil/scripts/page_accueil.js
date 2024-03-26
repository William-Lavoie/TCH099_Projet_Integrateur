document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("btn-en-aprendre-plus");
    let containerCafe = document.querySelector(".container-coffee");
    let bureauAcceuil = document.getElementById("bureau-acceuil");
    
    button.addEventListener("click", function() {
        //cacher elements apres en aprendre plus
        if(containerCafe.style.display === "none") {
            containerCafe.style.display = "";
        } else {
            containerCafe.style.display = "none";
        }
        
        if(bureauAcceuil.style.display === "none") {
            bureauAcceuil.style.display = "";
        } else {
            bureauAcceuil.style.display = "none";
        }

        let containerTitrePage = document.getElementById('conteneur-titre-page-accueil');
        containerTitrePage.classList.toggle('collapse');

        if (button.innerHTML === "En aprendre plus") {
            button.innerHTML = "▼";
        } else {
            button.innerHTML = "En aprendre plus";
        }

        //afficher apres en aprendre plus
        let containerAprendrePlus = document.getElementById('conteneur-aprendre-plus');
        containerAprendrePlus.classList.toggle('collapse');

        let h1ElementsPremiereBoite = document.querySelectorAll('#premiere-boite-aprendre h1');

            h1ElementsPremiereBoite[0].classList.add('animate__animated' );
            h1ElementsPremiereBoite[0].classList.add('animate__zoomIn');
                
            h1ElementsPremiereBoite[1].classList.add('cacher');

        setTimeout(function() {


            setTimeout(function() {
                h1ElementsPremiereBoite[1].classList.remove('cacher');
                h1ElementsPremiereBoite[1].classList.add('animate__animated');
                h1ElementsPremiereBoite[1].classList.add('animate__zoomIn');
            }, 600);
        }, 100); 
    });



    //******************** */
    //action seolon la hauteur de la page
    //************************ */
    window.addEventListener('scroll', function() {
        let scrollHeight = document.documentElement.scrollHeight;
        let clientHeight = document.documentElement.clientHeight;
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
        let scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
        let h1ElementsDeuxiemeBoite = document.querySelectorAll('#premier-message-boite-deux h1');
        let h1ElementsTroisiemeBoite = document.querySelectorAll('#troisieme-boite-aprendre h1');
        let h1ElementsQuatriemeBoite = document.querySelectorAll('#quatrieme-boite-aprendre h1');
        let h1ElementsCinquiemeBoite = document.querySelectorAll('#cinquieme-boite-aprendre h1');


        // action a 20% height pour la deuxime boite
        if (scrollPercentage >= 20 && scrollPercentage < 40) {
            h1ElementsDeuxiemeBoite[0].classList.add('animate__animated' );
            h1ElementsDeuxiemeBoite[0].classList.add('animate__slideInRight' );


        //  action a 40% height pour la troisieme boite
        } else if (scrollPercentage >= 40 && scrollPercentage < 60) {

            h1ElementsTroisiemeBoite[0].classList.add('animate__animated' );
            h1ElementsTroisiemeBoite[0].classList.add('animate__zoomIn' );

        //  action a 60% height pour la quatrieme boite
        } else if (scrollPercentage >= 60 && scrollPercentage < 80) {
            h1ElementsQuatriemeBoite[0].classList.add('animate__animated' );
            h1ElementsQuatriemeBoite[0].classList.add('animate__zoomIn' );


        //  action a 60% height pour la quatrieme boite
        } else if (scrollPercentage >= 90) {
            h1ElementsCinquiemeBoite[0].classList.add('animate__animated' );
            h1ElementsCinquiemeBoite[0].classList.add('animate__zoomIn' );
        }
        
    });



    //**************** */
    //slide dans les conteneur
    //*************** */


    //deuxieme boite
    const btnGaucheDeux = document.getElementById("btn-gauche-deuxieme-boite");
    const btnDroiteDeux = document.getElementById("btn-droite-deuxieme-boite");
    const premierMessageDeux = document.getElementById("premier-message-boite-deux");
    const deuxiemeMessageDeux = document.getElementById("deuxieme-message-boite-deux");
    const troisiemeMessageDeux = document.getElementById("troisieme-message-boite-deux");

    let currentSlideDeux = 1;

    btnGaucheDeux.addEventListener("click", function() {
        if (currentSlideDeux === 1) {
            return; 
        }
        currentSlideDeux--;
        updateSlideDisplayDeux();
    });

    btnDroiteDeux.addEventListener("click", function() {
        if (currentSlideDeux === 3) {
            return;
        }
        currentSlideDeux++;
        updateSlideDisplayDeux();
    });

    function updateSlideDisplayDeux() {
        premierMessageDeux.style.display = "none";
        deuxiemeMessageDeux.style.display = "none";
        troisiemeMessageDeux.style.display = "none";
    
        if (currentSlideDeux === 1) {
            premierMessageDeux.style.display = "flex";
        } else if (currentSlideDeux === 2) {
            deuxiemeMessageDeux.style.display = "flex";
        } else if (currentSlideDeux === 3) {
            troisiemeMessageDeux.style.display = "flex";
        }
    
        const indicatorsDeux = document.querySelectorAll(".indicateur-de-slide");
        indicatorsDeux.forEach((indicatorsDeux, index) => {
            if (index === currentSlideDeux - 1) {
                indicatorsDeux.style.backgroundColor = "#00c1f3"; 
                indicatorsDeux.style.transform = "scale(1.5)"; 
            } else {
                indicatorsDeux.style.backgroundColor = "white"; 
                indicatorsDeux.style.transform = "scale(1)"; 
            }
        });
    }
    
    const premierIndicateurDeux = document.querySelector("#premier-indicateur-deux");
    premierIndicateurDeux.style.backgroundColor = "#00c1f3";
    premierIndicateurDeux.style.transform = "scale(1.5)";




    //troisieme boite
    const btnGaucheTrois = document.getElementById("btn-gauche-troisieme-boite");
    const btnDroiteTrois = document.getElementById("btn-droite-troisieme-boite");
    const premierMessageTrois = document.getElementById("premier-message-boite-trois");
    const deuxiemeMessageTrois = document.getElementById("deuxieme-message-boite-trois");
    const troisiemeMessageTrois = document.getElementById("troisieme-message-boite-trois");

    let currentSlideTrois = 1;

    btnGaucheTrois.addEventListener("click", function() {
        if (currentSlideTrois === 1) {
            return; 
        }
        currentSlideTrois--;
        updateSlideDisplayTrois();
    });

    btnDroiteTrois.addEventListener("click", function() {
        if (currentSlideTrois === 3) {
            return;
        }
        currentSlideTrois++;
        updateSlideDisplayTrois();
    });

    function updateSlideDisplayTrois() {
        premierMessageTrois.style.display = "none";
        deuxiemeMessageTrois.style.display = "none";
        troisiemeMessageTrois.style.display = "none";
    
        if (currentSlideTrois === 1) {
            premierMessageTrois.style.display = "flex";
        } else if (currentSlideTrois === 2) {
            deuxiemeMessageTrois.style.display = "flex";
        } else if (currentSlideTrois === 3) {
            troisiemeMessageTrois.style.display = "flex";
        }
    
        const indicatorsTrois = document.querySelectorAll(".indicateur-de-slide-dark");
        indicatorsTrois.forEach((indicatorsTrois, index) => {
            if (index === currentSlideTrois - 1) {
                indicatorsTrois.style.backgroundColor = "#00c1f3"; 
                indicatorsTrois.style.transform = "scale(1.5)"; 
            } else {
                indicatorsTrois.style.backgroundColor = "black"; 
                indicatorsTrois.style.transform = "scale(1)"; 
            }
        });
    }
    
    const premierIndicateurTrois = document.querySelector("#premier-indicateur-trois");
    premierIndicateurTrois.style.backgroundColor = "#00c1f3";
    premierIndicateurTrois.style.transform = "scale(1.5)";













});
