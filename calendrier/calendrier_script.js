$(document).ready(function() {


    // Afficher le formulaire de création d'une réunion
    $("#creer-reunion").on("click", function() {
        $("#nouvelle-reunion").addClass("reunion-visible");
    }) 

    // Fermer le formulaire de création d'une réunion
    $("#reunion-retour").on("click", function() {
        $("#nouvelle-reunion").removeClass("reunion-visible");
    }) 

    // Passage à la deuxième partie du formulaire
    $("#reunion-continuer").on("click", function(event) {

        event.preventDefault();

        // Vérifie que tous les champs sont remplis
        if ($("#nouvelle-reunion")[0].checkValidity()) {

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
      




    

})