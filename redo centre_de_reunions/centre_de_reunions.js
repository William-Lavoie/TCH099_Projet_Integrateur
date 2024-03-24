
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


 /**
     * Affiche les réunions spécifiques à un groupe
     */
 function afficherReunionsGroupe(groupe) {

    $("#conteneur-reunions").html("");

    let donnees = {'idGroupe': groupe};
    // Afficher les réunions pour un groupe
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/obtenir_reunions_groupes", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(donnees)
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

            let nouvelleReunion = $("<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +  data[i]['titre'] + "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" + data[i]['description'] + "</div></div></div>");
            $("#conteneur-reunions").append(nouvelleReunion);

            // Ouvrir la réunion quand l'utilisateur clique dessus
            nouvelleReunion.on("click", function() {

                console.log("ok");
                let idReunion = data[i]['id_reunions'];
                window.location.href = "../../réunions/réunions.html?info=" + encodeURIComponent(idReunion);
            });

        }
    
    
    
    })
    .catch(error => {

    });
}

document.addEventListener('DOMContentLoaded', function () {


    afficherReunion();

    function afficherReunion() {
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

                
            let nouvelleReunion = $("<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +  data[i]['titre'] + "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" + data[i]['description'] + "</div></div></div>");
            $("#conteneur-reunions").append(nouvelleReunion);

            // Ouvrir la réunion quand l'utilisateur clique dessus
            nouvelleReunion.on("click", function() {

                console.log("ok");
                let idReunion = data[i]['id_reunions'];
                window.location.href = "../../réunions/réunions.html?info=" + encodeURIComponent(idReunion);
            });

            }

        })
        .catch(error => {

        });
    }
    


    // Afficher la liste des groupes
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/afficher_groupes", {
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

      // Ajouter les groupes à la liste des groupes dans la sidebar
      const groupesTable = $("#table-groupes");

      for (let i = 0; i < data.length; i++) {

        const nouveauGroupe = $("<button class='groupe'>").text(data[i]['nom']); // Changer le nom
        const nouvelleCellule = $("<td>").append(nouveauGroupe);
        groupesTable.find("tr").last().after($("<tr>").append(nouvelleCellule));

        nouveauGroupe.on("click", function(event) {
            event.preventDefault()
            

            // Si le groupe est déjà sélectionné, affiche toutes les réunions
            if ($(this).hasClass("groupe-choisi")) {
                afficherReunion();
                $("button").removeClass("groupe-choisi");

            }

            else {
                $("button").removeClass("groupe-choisi");
                $(this).addClass("groupe-choisi");
                afficherReunionsGroupe(data[i]['id_groupes']);
            }
         
        })
  
      }
        
    })
    .catch(error => {

      console.log("erreur");
    });
});
