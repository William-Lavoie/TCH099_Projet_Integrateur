document.addEventListener("DOMContentLoaded", function() {
    let button = document.getElementById("btn-en-aprendre-plus");
    let containerCafe = document.querySelector(".container-coffee");
    let bureauAcceuil = document.getElementById("bureau-acceuil");
    
    button.addEventListener("click", function() {
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

        let container = document.getElementById('conteneur-titre-page-accueil');
        container.classList.toggle('collapse');

        if (button.innerHTML === "En aprendre plus") {
            button.innerHTML = "Fermer";
        } else {
            button.innerHTML = "En aprendre plus";
        }
    });
});
