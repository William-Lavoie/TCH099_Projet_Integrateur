$(document).ready(function() {

    let titre;
    let dateReunion;
    let debutReunion;
    let finReunion;
    let description;

    // Vider tous les champs et fermer les formulaires
    function fermerFormulaires() {

        $("form").removeClass("reunion-visible");
        $("header, main, footer").css("opacity", "100%");
        $("#creer-reunion").prop("disabled", false);

        // Vider les formulaires
        $("#titre-reunion").val("");
        $("#debut-reunion").val("");
        $("#fin-reunion").val("");
        $("#date-reunion").val("");
        $("#description-reunion").val("");

        $("#liste-participants").text("");
        
        // Réinitialiser les variables
        titre = null;
        debutReunion = null;
        finReunion = null;
        dateReunion = null;
        description = null;
    }

    // Vérifier que les heures et la date choisies sont valides
    function heureDateValides() {

        const [heureDebut, minuteDebut] = debutReunion.split(':').map(Number);
        const [heureFin, minuteFin] = finReunion.split(':').map(Number);

        const dateFormate = dateReunion.replace(/-/g, '/'); 
        const date = new Date(dateFormate);

        const dateActuelle = new Date();
        console.log(date);
        console.log(dateActuelle);
    
        if (heureFin < heureDebut) {

            $("#messages-erreur").text("L'heure de fin ne peut précéder l'heure de début");
            return false;
        }

        else if (heureFin == heureDebut && minuteDebut > minuteFin) {

            $("#messages-erreur").text("L'heure de fin ne peut précéder l'heure de début");
            return false;
        }

        else if (date.getFullYear() < dateActuelle.getFullYear() ||
                 date.getMonth() < dateActuelle.getMonth()  ||
                 date.getDate() < dateActuelle.getDate()) {

            $("#messages-erreur").text("La date ne peut pas déjà être passée");
            return false;
        }

        else if (date.getDay() == dateActuelle.getDay() && date.getMonth() == dateActuelle.getMonth() 
                && date.getFullYear() == dateActuelle.getFullYear() 
                && (heureDebut < dateActuelle.getHours() || minuteDebut < dateActuelle.getMinutes())) {

                $("#messages-erreur").text("L'heure ne peut pas être déjà passée");
                return false;
        }

        return true;
    }

    function courrrielPresent(courriel) {

        const listeParticipants = $("#liste-participants p");

        for (let i=0; i < listeParticipants.length; i++) {

            if (listeParticipants[i].innerText === courriel) {
                return true;
            }
        }

        return false;
    }


    $("form button[type != 'reset']").on("click", function(event) {
        event.preventDefault();
    })

    // Afficher le formulaire de création d'une réunion
    $("#creer-reunion").on("click", function() {
        $("#nouvelle-reunion").addClass("reunion-visible");
    
        $("header, main, footer").css("opacity", "20%");
        $("#nouvelle-reunion").css("opacity", "2");
        $(this).prop("disabled", true);
    }) 

    // Fermer le formulaire de création d'une réunion
    $("#reunion-retour").on("click", function() {
       $("#messages-erreur").text("");
       fermerFormulaires();
    }) 

    // TODO: make it so clicking the "créer réunion" button also closes the form properly
    $("body").on("click", function(event) {

        if (!$(event.target).closest("#formulaires-reunion").length &&
             $("#nouvelle-reunion").hasClass("reunion-visible") &&
             !$(event.target).is("#creer-reunion")) {
            $("header, main, footer").css("opacity", "100%");
            $("#creer-reunion").prop("disabled", false);
            $("#nouvelle-reunion").removeClass("reunion-visible");
            $("#messages-erreur").text("");
        }
    })

    // Passage à la deuxième partie du formulaire
    $("#reunion-continuer").on("click", function(event) {

        event.preventDefault();

        // Vérifie que tous les champs sont remplis
        if ($("#nouvelle-reunion")[0].checkValidity()) {

            // Conserver les informations 
            titre = $("#titre-reunion").val();
            debutReunion = $("#debut-reunion").val();
            finReunion = $("#fin-reunion").val();
            dateReunion = $("#date-reunion").val();
            description = $("#description-reunion").val();

            if (heureDateValides()) {

                // Passer à la page suivante
                $("#nouvelle-reunion").removeClass("reunion-visible");

                if ($("#btn-radio")[0].checked) {
                    $("#creer-reunion-groupe").addClass("reunion-visible");
                }

                if ($("#groupes")[0].checked) {
                    $("#creer-reunion-participants").addClass("reunion-visible");
                }
            }

           
        }

        else {

            if ($("#titre-reunion").val() == "") {

                $("#messages-erreur").text("Vous devez choisir un titre");
            }

            else if ($("#debut-reunion").val() == "") {

                $("#messages-erreur").text("Vous devez choisir une heure de début");
            }

            else if($("#fin-reunion").val() == "") {

                $("#messages-erreur").text("Vous devez choisir une heure de fin");
            }

            else if ($("#date-reunion").val() == "") {

                $("#messages-erreur").text("Vous devez choisir une date");
            }

            else {
                $("#messages-erreur").text("Vous devez choisir entre Groupe et Participants");
            }
        }
     })

     // Retour vers la première page du formulaire depuis la page des groupes
     $("#btn-retour-groupe").on("click", function(event) {
       
        $("#creer-reunion-groupe").removeClass("reunion-visible");
        $("#nouvelle-reunion").addClass("reunion-visible");
     })

    // Retour vers la première page du formulaire depuis la page des participants
     $("#btn-retour-participants").on("click", function(event) {
       
        $("#creer-reunion-participants").removeClass("reunion-visible");
        $("#nouvelle-reunion").addClass("reunion-visible");
     })


     
    // Ajout d'un participant
    $("#btn-creer-participant").on("click", function() {

        $("#messages-erreur-participants").text("");

        let texte = $("#nouveau-participant").val();

        const nouveauParticipant = $("<div class='nom-participant'> <p></p> </div> ");
        const boutonSupprimer = $("<button class='supprimer-participant'>X</button>");

        if (courrrielPresent(texte)) {
            $("#nouveau-participant").val("");
            $("#messages-erreur-participants").text(texte + " a déjà été ajouté!");
        }

        else if (texte != "" && texte.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

            const courriel = {"courriel": texte};
    
            fetch("http://localhost:3333/calendrier/api/api_calendrier.php/chercher_participants", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(courriel)
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
                
               if (data["existe"]) {

                $("#nouveau-participant").val("");

                    boutonSupprimer.on("click", function() {
                    nouveauParticipant.remove();
                });
 
 
                 nouveauParticipant.children("p").text(texte);
                 nouveauParticipant.append(boutonSupprimer);
 
                 $("#liste-participants").append(nouveauParticipant);
               }

               else {

                $("#messages-erreur-participants").text(texte + " ne correspond pas à un compte HuddleHarbor");

               }
                
            })
            .catch(error => {
            console.log(error);
            });
        }
        
        else {
            $("#messages-erreur-participants").text(texte + " n'est pas une adresse valide!");
        }
        }) 



    // Soumission de la création d'une réunion côté participants
   $("#btn-confirmer-participants").on("click", function(event) {

    event.preventDefault();

        const donnees = {"titre": titre,
                         "debutReunion": debutReunion,
                         "finReunion": finReunion,
                         "dateReunion": dateReunion,
                         "description": description};
           
                         console.log(donnees);
        fetch("http://localhost:3333/calendrier/api/api_calendrier.php/creer_reunion", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
        })
        .then(response => {

            console.log(response);
            if (response.ok) {

                // Fermer les formulaires
                fermerFormulaires();

                return response.json();
            }

            else {
                console.log("error");
            }
        })
        .then(data => {
            console.log(data); 
        })
        .catch(error => {
            console.log(error);
        });

   })
      


  

    

})