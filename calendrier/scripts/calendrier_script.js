$(document).ready(function() {

    // Informations par rapport à une réunion
    let titre;
    let dateReunion;
    let debutReunion;
    let finReunion;
    let description;
    let participantsReunion = [];

    // Vide tous les champs et ferme les formulaires de création d'une réunion
    function fermerFormulaires() {

        $("form").removeClass("reunion-visible");

        // Rend le bouton créer réunion fonctionnel
        $("#creer-reunion").prop("disabled", false);

        // Vider les formulaires
        $("#titre-reunion").val("");
        $("#debut-reunion").val("");
        $("#fin-reunion").val("");
        $("#date-reunion").val("");
        $("#description-reunion").val("");

        $("#liste-participants").text("");

        // Ne change pas le focus si l'onglet d'une réunion est ouverte 
        if (!$("#consulter-reunion-calendrier").hasClass("ouvrir-reunion")) {

            $("header, main, footer, #creer-reunion").css("opacity", "100%");
            $("main, header, footer, #creer-reunion").removeClass("hors-focus");
        }

        
        // Réinitialiser les variables
        titre = null;
        debutReunion = null;
        finReunion = null;
        dateReunion = null;
        description = null;
    }

    // Vérifier que les heures et la date choisie sont valides
    function heureDateValides() {

        // Sépare les heures et les minutes (par exemple 13:47 = [13,47])
        const [heureDebut, minuteDebut] = debutReunion.split(':').map(Number);
        const [heureFin, minuteFin] = finReunion.split(':').map(Number);

        // Remplace tous les '-' dans la date par '/' (exemple: 2024-12-10 = 2024/12/10)
        const dateFormate = dateReunion.replace(/-/g, '/'); 

        // Date de la réunion
        const date = new Date(dateFormate);

        // Date courante
        const dateActuelle = new Date();
    
        // Vérifie si l'heure de fin de la réunion est après son début
        if (heureFin < heureDebut) {

            $("#messages-erreur").text("L'heure de fin ne peut précéder l'heure de début");
            return false;
        }

        else if (heureFin == heureDebut && minuteDebut > minuteFin) {

            $("#messages-erreur").text("L'heure de fin ne peut précéder l'heure de début");
            return false;
        }

        // Vérifie que la date de la réunion ne soit pas déjà passée
        else if (date.getFullYear() < dateActuelle.getFullYear() ||
                 date.getFullYear() == dateActuelle.getFullYear() && date.getMonth() < dateActuelle.getMonth()  ||
                 date.getFullYear() == dateActuelle.getFullYear() && date.getMonth() == dateActuelle.getMonth() && date.getDate() < dateActuelle.getDate()) {

            $("#messages-erreur").text("La date ne peut pas déjà être passée");
            return false;
        }

        // Vérifie que l'heure de la réunion ne soit pas déjà passée, si la date est la date courante
        else if (date.getDay() == dateActuelle.getDay() && date.getMonth() == dateActuelle.getMonth() 
                && date.getFullYear() == dateActuelle.getFullYear() 
                && (heureDebut < dateActuelle.getHours() || minuteDebut < dateActuelle.getMinutes())) {

                $("#messages-erreur").text("L'heure ne peut pas être déjà passée");
                return false;
        }

        return true;
    }

    // Retourne true si le courriel passé en paramètre a été ajouté à la liste des participants dans le formulaire de création d'une réunion
    function courrrielPresent(courriel) {

        const listeParticipants = $("#liste-participants p");

        for (let i=0; i < listeParticipants.length; i++) {

            if (listeParticipants[i].innerText === courriel) {
                return true;
            }
        }

        return false;
    }

    // Vérifie si un formulaire est vide
    function formulaireEstRempli() {
     return ($("#titre-reunion").val() != "" ||
             $("#debut-reunion").val() != "" ||
             $("#fin-reunion").val() != ""   ||
             $("#date-reunion").val() != ""  ||
             $("#description-reunion").val() != "");        
    }


    // Prévient le comportement par défaut des boutons (sauf ceux de type 'reset')
    $("form button[type != 'reset']").on("click", function(event) {
        event.preventDefault();
    })

    // Afficher le formulaire de création d'une réunion
    $("#creer-reunion").on("click", function() {
        $("#nouvelle-reunion").addClass("reunion-visible");
    
        $("header, main, footer, #creer-reunion").css("opacity", "50%");
        $("#nouvelle-reunion").css("opacity", "1");
        $(this).prop("disabled", true);
        $("main, header, footer, #creer-reunion").addClass("hors-focus");

    }) 

    // Fermer le formulaire de création d'une réunion en appuyant sur retour
    $("#reunion-retour").on("click", function() {

        if (formulaireEstRempli()) {

            //TODO: annoying bug where alert deletes the meeting info
            if (confirm("Vos modifications ne seront pas sauvegardées, êtes-vous sûr de vouloir continuer?")) {
                $("#messages-erreur").text("");
                fermerFormulaires();
            }

        }
        else {
            $("#messages-erreur").text("");
            fermerFormulaires();
        }
      
    }) 

    // Fermer le formulaire de création d'une réunion en appuyant n'importe ou ailleurs sur la page
    $("body").on("click", function(event) {

        // Le formulaire est actif, l'utilisateur ne clique par dessus ni sur le bouton
        if (!$(event.target).closest("#formulaires-reunion").length &&
             $("#nouvelle-reunion").hasClass("reunion-visible") &&
             !$(event.target).is("#creer-reunion")) {

            fermerFormulaires();
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

        // Contenant pour le participant
        const nouveauParticipant = $("<div class='nom-participant'> <p></p> </div> ");
        const boutonSupprimer = $("<button class='supprimer-participant'>X</button>");

        // Le même participant ne doit pas être ajouté plus d'une fois
        if (courrrielPresent(texte)) {
            $("#nouveau-participant").val("");
            $("#messages-erreur-participants").text(texte + " a déjà été ajouté!");
        }

        // Le courriel du participant doit être valide
        else if (texte != "" && texte.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

            const courriel = {"courriel": texte};
    
            // Le participant doit avoir un compte dans la base de données
            fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_participants", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(courriel)
            })
            .then(response => {
    
            if (response.ok) {
                 return response.json();
            }
    
            else {
                console.log("La requête n'a pas fonctionnée");
            }
            })
            .then(data => {
                
               // Un utilisateur a été trouvé
               if (data["existe"]) {

                // Le participant est ajouté à la liste
                $("#nouveau-participant").val("");

                    boutonSupprimer.on("click", function() {
                    nouveauParticipant.remove();
                });
 
                
                 nouveauParticipant.children("p").text(texte);
                 nouveauParticipant.append(boutonSupprimer);

                 // Ajouter au tableau de participants
                 participantsReunion.push(texte);
 
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

        else if (texte == "") {
            $("#messages-erreur-participants").text("Vous devez entrer une adresse courriel");
        }
        
        else {
            $("#messages-erreur-participants").text(texte + " n'est pas une adresse valide!");
        }
        }) 



   // Soumission de la création d'une réunion côté participants
   $("#btn-confirmer-participants").on("click", function(event) {

    event.preventDefault();

    // Les informations de la réunions sont ajoutées à la base de données
        const donnees = {"titre": titre,
                         "debutReunion": debutReunion,
                         "finReunion": finReunion,
                         "dateReunion": dateReunion,
                         "description": description,
                         "listeParticipants": participantsReunion};
           
                         console.log(donnees);
        fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/creer_reunion", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
        })
        .then(response => {

            console.log(response);
            if (response.ok) {

                // Fermer les formulaires et rafraîchir la page
                fermerFormulaires();
                window.location.reload();
                return response.json();
            }

            else {
                console.log("error");
            }
        })
        .catch(error => {
            console.log(error);
        });

   })
      


  

    

})