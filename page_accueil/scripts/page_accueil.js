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

            // action a 25% height pour la deuxime boite
        if (scrollPercentage >= 25 && scrollPercentage < 50) {
            h1ElementsDeuxiemeBoite[0].classList.add('animate__animated' );
            h1ElementsDeuxiemeBoite[0].classList.add('animate__slideInRight' );


                //  action a 50% height pour la troisieme boite
        } else if (scrollPercentage >= 50 && scrollPercentage < 75) {

            h1ElementsTroisiemeBoite[0].classList.add('animate__animated' );
            h1ElementsTroisiemeBoite[0].classList.add('animate__zoomIn' );

          //  action a 75% height pour la quatrieme boite
        } else if (scrollPercentage >= 90) {
            h1ElementsQuatriemeBoite[0].classList.add('animate__animated' );
            h1ElementsQuatriemeBoite[0].classList.add('animate__zoomIn' );
        }
    });



    //**************** */
    //slider
    //*************** */
    const btnGauche = document.getElementById("btn-gauche-deuxieme-boite");
    const btnDroite = document.getElementById("btn-droite-deuxieme-boite");
    const premierMessage = document.getElementById("premier-message-boite-deux");
    const deuxiemeMessage = document.getElementById("deuxieme-message-boite-deux");
    const troisiemeMessage = document.getElementById("troisieme-message-boite-deux");

    let currentSlide = 1;

    btnGauche.addEventListener("click", function() {
        if (currentSlide === 1) {
            return; 
        }
        currentSlide--;
        updateSlideDisplay();
    });

    btnDroite.addEventListener("click", function() {
        if (currentSlide === 3) {
            return;
        }
        currentSlide++;
        updateSlideDisplay();
    });

    function updateSlideDisplay() {
        premierMessage.style.display = "none";
        deuxiemeMessage.style.display = "none";
        troisiemeMessage.style.display = "none";
    
        if (currentSlide === 1) {
            premierMessage.style.display = "flex";
        } else if (currentSlide === 2) {
            deuxiemeMessage.style.display = "flex";
        } else if (currentSlide === 3) {
            troisiemeMessage.style.display = "flex";
        }
    
        const indicators = document.querySelectorAll(".indicateur-de-slide");
        indicators.forEach((indicator, index) => {
            if (index === currentSlide - 1) {
                indicator.style.backgroundColor = "#00c1f3"; 
                indicator.style.transform = "scale(1.5)"; 
            } else {
                indicator.style.backgroundColor = "white"; 
                indicator.style.transform = "scale(1)"; 
            }
        });
    }
    
    const firstIndicator = document.querySelector(".indicateur-de-slide");
    firstIndicator.style.backgroundColor = "#00c1f3";
    firstIndicator.style.transform = "scale(1.5)";

});
