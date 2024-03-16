$(document).ready(function() {

  var joursMoisDernier;
  let joursMoisCourant;
  let nbJoursMoisDernier;
  let reunionsDuJour;



  function trouverJourneeSemaine(index) {
    switch(index % 7) {
      case 0:
        return "Dimanche";
      case 1:
        return "Lundi";
      case 2:
        return "Mardi";
      case 3:
         return "Mercredi";
      case 4:
        return "Jeudi";
      case 5:
        return "Vendredi";
      case 6:
        return "Samedi";
      default:
        return null;
    }
  }

  // Remplit dynamiquement le calendrier 
  function afficherCalendrier(mois) {
   
    // Vider le calendrier
    $("#calendrier").html("");
  
    let compteur = 0;

    // Jour courant 
    const nouveauMois = new Date(jourCourant.getFullYear(), mois);
    joursMoisCourant = nouveauMois;
  
    // Écrire la date 
    const options = {month: 'long'};
    let anneeActuel = jourCourant.getFullYear();
    let moisActuel = nouveauMois.toLocaleDateString('fr-FR',options);

    // Formattage de la date
    let moisFormatte = "";
    for (let i = 0; i < moisActuel.length; i++) {
      if (i ==0) {
        moisFormatte += moisActuel[0].toUpperCase();
      }

      else {
        moisFormatte += moisActuel[i];
      }

    }
    $("#journee-du-mois").text(moisFormatte + " " + anneeActuel);
    

    /***  Peupler le calendrier ***/
  
    //Premier jour du mois courant
    const premierDuMois = new Date(nouveauMois.getFullYear(), nouveauMois.getMonth(), 1);
    const premierJour = premierDuMois.getDay();

    nbJoursMoisDernier = premierJour;
  
    // Remplir les derniers jours du mois passé 
    const moisDernier = new Date(nouveauMois.getFullYear(), premierDuMois.getMonth(), 1-premierJour);
    let debutCalendrier = moisDernier.getDate();


    let i = 0;
    for (i; i < premierJour; i++) {
      const journee = $("<div class='jour'></div>");
      journee.text(debutCalendrier);
      journee.css("background-color", "lightgray");
      
      $("#calendrier").append(journee);
      debutCalendrier++;
      compteur++;
    }

    let dateDebutFormatte = "";

    dateDebutFormatte += moisDernier.getFullYear() + "/";
    dateDebutFormatte += moisDernier.getMonth()+1 + "/";
    dateDebutFormatte += moisDernier.getDate();

    letDateFinFormatte = "";
    if (moisDernier.getDate() > 9) {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-2);
    }

    else {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-1);
    }
    dateFinFormatte += moisDernier.getDate() + premierJour;
    console.log(dateDebutFormatte);

    let debut = {"dateDebut": dateDebutFormatte,
                   "dateFin": dateFinFormatte};


    // Chercher les réunions du mois passé
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_reunions", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(debut)
    })
    .then(response => {

    console.log(response);
    if (response.ok) {

    return response.json();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {
    console.log(data[0]['id_reunions']); 

    for (let i = 0; i < premierJour; i++) {

      let listeReunionsJournee = [];

      for (let j = 0; j < data.length; j++) {
        
        let dateNombre = data[j]['date'].slice(8);
        
        //Mettre un fond rouge si une réunion a étée trouvée
        if (dateNombre == $("#calendrier").children().eq(i).text()) {

          listeReunionsJournee.push(data[j]);
          $("#calendrier").children().eq(i).css("background-color", "red");

          // Mettre le tableau dans la case de la journée pour y accéder ailleurs
          $("#calendrier").children().eq(i).data("listeReunionsJournee", JSON.stringify(listeReunionsJournee));
        }
      }
    }

    
    console.log(JSON.parse($("#calendrier").children().eq(3).data("listeReunionsJournee")));
    })
    .catch(error => {
    console.log(error);
    });

    let index = 1;
  
    const moisProchainPremierJour = new Date(nouveauMois.getFullYear(), nouveauMois.getMonth()+1, 1);
    const finDuMois = (new Date(moisProchainPremierJour -1).getDate());

    joursMoisDernier = finDuMois;
    console.log(joursMoisDernier);

    for (let i = premierJour; i < finDuMois+premierJour; i++) {
      const journee = $("<div class='jour'></div>");
  
      journee.text(index);
  
    
      if (nouveauMois.getFullYear() == new Date().getFullYear() && nouveauMois.getMonth() == new Date().getMonth() && i == new Date().getDate()+premierJour-1) {
          journee.css("border", "3px solid #7eccff");
      }

      $("#calendrier").append(journee);
      index++;
      compteur++;
    }

    dateDebutFormatte = "";

    dateDebutFormatte += premierDuMois.getFullYear() + "/";
    dateDebutFormatte += premierDuMois.getMonth()+1 + "/";
    dateDebutFormatte += premierDuMois.getDate();

    letDateFinFormatte = "";
    if (premierDuMois.getDate() > 9) {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-2);
    }

    else {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-1);
    }
    dateFinFormatte += premierDuMois.getDate() + finDuMois-1;
    console.log(dateDebutFormatte);

    debut = {"dateDebut": dateDebutFormatte,
                   "dateFin": dateFinFormatte};


    // Chercher les réunions du mois courant
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_reunions", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(debut)
    })
    .then(response => {

    console.log(response);
    if (response.ok) {

    return response.json();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {
  
    for (k = 0; k < finDuMois; k++) {

      for (let j = 0; j < data.length; j++) {
        
        let dateNombre = data[j]['date'].slice(8);
        if (dateNombre == $("#calendrier").children().eq(compteur-finDuMois+k).text()) {
          $("#calendrier").children().eq(compteur-finDuMois+k).css("background-color", "red");

        }
      }

    }
    })
    .catch(error => {
    console.log(error);
    });

    chercherReunions(new Date(jourCourant.getFullYear(),jourCourant.getMonth()+1, 1), 41-(finDuMois+premierJour));

    index = 1;
    for (let j = finDuMois+premierJour -1; j < 41; j++) {
  
      const journee = $("<div class='jour'></div>");
      journee.text(index);
      journee.css("background-color", "lightgray");
  
      $("#calendrier").append(journee);
      index++;
    }

    $("#calendrier").children().eq(0).text("Lundi");

  }


  // Mettre les réunions dans le calendrier
  function chercherReunions(dateDebut, nbJours) {

    const reunions = new Array();

    console.log(dateDebut);
    let dateDebutFormatte = "";

    dateDebutFormatte += dateDebut.getFullYear() + "/";
    dateDebutFormatte += dateDebut.getMonth()+1 + "/";
    dateDebutFormatte += dateDebut.getDate();

    letDateFinFormatte = "";
    if (dateDebut.getDate() > 9) {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-2);
    }

    else {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-1);
    }
    dateFinFormatte += dateDebut.getDate() + nbJours;
    console.log(dateDebutFormatte);

    const debut = {"dateDebut": dateDebutFormatte,
                   "dateFin": dateFinFormatte};


    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_reunions", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(debut)
    })
    .then(response => {

    console.log(response);
    if (response.ok) {

    return response.json();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {
    console.log(data); 
    console.log("ok");
    $("calendrier").children().eq(0).text("test");
    })
    .catch(error => {
    console.log(error);
    });

    return reunions;
}

  

console.log(joursMoisDernier);

  // Jour courant 
  let jourCourant = new Date()

  // Remplir le calendrier au mois courant
  afficherCalendrier(jourCourant.getMonth());


  // Afficher photo de profil
  fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php", {
    })
    .then(response => {

    if (response.ok) {

    return response.blob();
    }

    else {
    console.log("error");
    }
    })
    .then(data => {
      const img = document.createElement('img');

      if (data != undefined) {
        img.src = URL.createObjectURL(data)
        // img.width = 50;
        // img.length = 50;
        $("#photo-profil-conteneur").html("");
        $("#photo-profil-conteneur").append(img);
      }
  
    })
    .catch(error => {
    console.log(error);
    });

  // Passer au mois dernier
  $("#btn-dernier-mois").on("click", function() {

    afficherCalendrier(jourCourant.getMonth()-1);
    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()-1);
  })

  // Passer au mois suivant
  $("#btn-prochain-mois").on("click", function() {

    afficherCalendrier(jourCourant.getMonth()+1);
    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()+1);
  })


  // Afficher et supprimer les réunions d'une journée lorsqu'on clique dessus
  $("body").on("click", function(event) {


    console.log($(event.target).is(".jour"));
    if (!$(event.target).closest("#consulter-reunion-calendrier").length &&
         $("#consulter-reunion-calendrier").hasClass("ouvrir-reunion")) {

         $("header, main, footer, #creer-reunion").css("opacity", "100%");
         $("#consulter-reunion-calendrier").removeClass("ouvrir-reunion");
         $("main, header, footer, #creer-reunion").removeClass("hors-focus");

         reunionsDuJour = "";

    }

    else if (!$("#consulter-reunion-calendrier").hasClass("ouvrir-reunion") && $(event.target).is(".jour")) {
      $("#consulter-reunion-calendrier").addClass("ouvrir-reunion");
      $("#consulter-reunion-calendrier").text();
      $("header, main, footer, #creer-reunion").css("opacity", "50%");
      $("main, header, footer, #creer-reunion").addClass("hors-focus");



      // Écrire la date 
      let journeeSemaine = trouverJourneeSemaine($(event.target).index())
      
      console.log($(event.target).index() > joursMoisDernier);
      


      if (journeeSemaine != null) {

        // La journée appartient au mois précédent
        if ($(event.target).index() < nbJoursMoisDernier) {

          console.log(joursMoisDernier);
          const options = {month: 'long', year: 'numeric'};
          let nouveauMois = new Date(joursMoisCourant.getFullYear(), joursMoisCourant.getMonth() -1);
          let moisActuel = nouveauMois.toLocaleDateString('fr-FR',options);

          $("#consulter-reunion-calendrier span").text(journeeSemaine + " " + $(event.target).text() + " " + moisActuel);

        }

        else if ($(event.target).index() >= nbJoursMoisDernier-1 && $(event.target).index() < nbJoursMoisDernier + joursMoisDernier) {
          console.log("test");
          $("#consulter-reunion-calendrier span").text(journeeSemaine + " " + $(event.target).text() + " " + $("#journee-du-mois").text());
        }

        else {
          const options = {month: 'long', year: 'numeric'};
          let nouveauMois = new Date(joursMoisCourant.getFullYear(), joursMoisCourant.getMonth() + 1);
          let moisActuel = nouveauMois.toLocaleDateString('fr-FR',options);
          console.log(moisActuel);
          $("#consulter-reunion-calendrier span").text(journeeSemaine + " " + $(event.target).text() + " " + moisActuel);

        }
      }

      else {
        console.log("erreur");
      }


      $("#panneau-reunions").html("");
     // Afficher les réunions de la journée
     reunionsDuJour = JSON.parse($(event.target).data("listeReunionsJournee"));
     console.log(reunionsDuJour);

     for (let i = 0; i < reunionsDuJour.length; i++) {

      const reunion = $("<div class='reunion-pour-panneau'></div>");
      reunion.append("<p>" + reunionsDuJour[i]['titre'] + "</p>");
      reunion.append("<p>" + reunionsDuJour[i]['heure_debut'] + "-" + reunionsDuJour[i]['heure_fin'] + "</p>");


      $("#panneau-reunions").append(reunion);

     } 

    // Évènement lorsque l'utilisateur clique sur une de ces réunions
    $(event.target).find(".reunion-pour-panneau").on("click", function() {
      alert("test");
    })


    }

    else if ($(event.target).is(".reunion-pour-panneau")) {

      $(event.target).addClass("reunion-visible-panneau")
      console.log(reunionsDuJour);
      console.log(reunionsDuJour[$(event.target).index()]['titre']);
    }
})


})