
function basculerGroupes() {
    var groupes = document.getElementById("conteneur-groupes");
    var btnBasculer = document.getElementById("conteneur-basculer");
    var reunions = document.getElementById("conteneur-reunions");

    if (groupes.style.marginLeft === "-12em") {
        // Fermer la barre latérale contenant les groupes
        groupes.style.marginLeft = "0";
        btnBasculer.style.marginLeft = "0em";
        reunions.style.marginLeft = "0em";
        document.getElementById("basculer").innerText = "⪓";
    } else {
        // Ouvrir la barre latérale contenant les groupes
        groupes.style.marginLeft = "-12em";
        btnBasculer.style.marginLeft = "-12em";
        reunions.style.marginLeft = "-12em";
        document.getElementById("basculer").innerText = "⪔";
    }
}

document.addEventListener('DOMContentLoaded', function () {

     // Afficher les réunions 
     fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/obtenir_reunions_utilisateur", {
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
    
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            $("#conteneur-reunions").append("<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +  data[i]['titre'] + "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" + data[i]['description'] + "</div></div></div>");
        }
    
    })
    .catch(error => {

    });
});
