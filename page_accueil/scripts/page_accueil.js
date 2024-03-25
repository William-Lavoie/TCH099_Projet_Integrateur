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

        let h1Elements = document.querySelectorAll('#premiere-boite-aprendre h1');

            h1Elements[0].classList.add('animate__animated' );
            h1Elements[0].classList.add('animate__zoomIn');
            
            h1Elements[1].classList.add('cacher');

        setTimeout(function() {


            setTimeout(function() {
                h1Elements[1].classList.remove('cacher');
                h1Elements[1].classList.add('animate__animated');
                h1Elements[1].classList.add('animate__zoomIn');
            }, 600);
        }, 100); 
    });




});
