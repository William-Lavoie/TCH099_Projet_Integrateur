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
        
        // Réinitialiser les variables
        titre = null;
        debutReunion = null;
        finReunion = null;
        dateReunion = null;
        description = null;
    }

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

            // Passer à la page suivante
            $("#nouvelle-reunion").removeClass("reunion-visible");

            if ($("#btn-radio")[0].checked) {
                $("#creer-reunion-groupe").addClass("reunion-visible");
            }

            if ($("#groupes")[0].checked) {
                $("#creer-reunion-participants").addClass("reunion-visible");
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