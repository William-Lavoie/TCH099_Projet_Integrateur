$(document).ready(function() {


    // Afficher le formulaire de création d'une réunion
    $("#creer-reunion").on("click", function() {
        $("#nouvelle-reunion").addClass("reunion-visible");
    
        $("header, main, footer").css("opacity", "50%");
        $("#nouvelle-reunion").css("opacity", "2");
        $(this).prop("disabled", true);
    }) 

    // Fermer le formulaire de création d'une réunion
    $("#reunion-retour").on("click", function() {
        $("#nouvelle-reunion").removeClass("reunion-visible");
        $("header, main, footer").css("opacity", "100%");
        $("#creer-reunion").prop("disabled", false);


    }) 

    // TODO: make it so clicking the "créer réunion" button also closes the form properly
    $("body").on("click", function(event) {

        if (!$(event.target).closest("#formulaires-reunion").length &&
             $("#nouvelle-reunion").hasClass("reunion-visible") &&
             !$(event.target).is("#creer-reunion")) {
            $("header, main, footer").css("opacity", "100%");
            $("#creer-reunion").prop("disabled", false);
            $("#nouvelle-reunion").removeClass("reunion-visible");


        }
    })

    // Passage à la deuxième partie du formulaire
    $("#reunion-continuer").on("click", function(event) {

        event.preventDefault();

        // Vérifie que tous les champs sont remplis
        if ($("#nouvelle-reunion")[0].checkValidity()) {

            // Conserver les informations 
            let titre = $("#titre-reunion").val();
            let debutReunion = $("#debut-reunion").val();
            let finReunion = $("#fin-reunion").val();
            let dateReunion = $("#date-reunion").val();

            // Passer à la page suivante
            $("#nouvelle-reunion").removeClass("reunion-visible");

            if ($("#btn-radio")[0].checked) {
                $("#creer-reunion-groupe").addClass("reunion-visible");
            }

            if ($("#groupes")[0].checked) {
                $("#creer-reunion-participants").addClass("reunion-visible");
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

     // Soumissions de la création d'une réunion côté participants
     
      




    

})