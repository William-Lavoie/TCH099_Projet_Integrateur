$(document).ready(function() {

  // Information par rapport au mois courant
  var joursMoisDernier;
  let joursMoisCourant;
  let nbJoursMoisDernier;

  // Réunions pour une journée
  let reunionsDuJour;

  // Jour actuel (est modifé automatiquement chaque jour)
  let jourCourant = new Date()


  /**
   * TROUVER_JOURNEE_SEMAINE
   * Détermine le jour de le semaine associé à une position dans la grille
   * en commençant par le dimanche 
   * @param {number} index 
   * @returns String: jour de la semaine
   */
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

  /**FORMATTER_HEURE 
   * Transforme les heures fournies par la base de données au format hh:mm:ss
   * en heures au format hh:mm
   * @param {String} heureNonFormatte: heure fournie par la base de données
   * @returns String: heure au format hh:mm
   */
  function formatterHeure(heureNonFormatte) {
    return heureNonFormatte.slice(0, 2) + ":" + heureNonFormatte.slice(3,5);

  }

   /**FORMATTER_DATE 
   * Transforme les dates fournies par les "input" de type "Date" au format
   * requis par la base de données: aaaa/mm/jj
   * @param {String} date: date au format 
   * @returns String: heure au format hh:mm
   */
   function formatterHeure(heureNonFormatte) {
    return heureNonFormatte.slice(0, 2) + ":" + heureNonFormatte.slice(3,5);

  }


  /**
   * AFFICHER_DATE
   * Affiche le mois et l'année dans l'en-tête. Par défaut le mois actuel 
   * est affiché, et l'utilisateur utilise les flèches pour changer de mois
   * @param {String} mois
   */
  function afficherDate(mois) {

     // Obtient le premier jour du mois sélectionné
     let moisAnnee = new Date(jourCourant.getFullYear(), mois);
   
     // Crée une chaîne de caractère correspond au mois et à l'année 
     const options = {month: 'long', year: 'numeric'};
     let moisAnneeActuel = moisAnnee.toLocaleDateString('fr-FR',options);
 
     // Met la première lettre du mois en majuscule
     let moisAnneeFormatte = "";
     for (let i = 0; i < moisAnneeActuel.length; i++) {
       if (i ==0) {
         moisAnneeFormatte += moisAnneeActuel[0].toUpperCase();
       }
 
       else {
         moisAnneeFormatte += moisAnneeActuel[i];
       }
 
     }
 
     // Affiche le mois et l'année dans l'en-tête
     $("#journee-du-mois").text(moisAnneeFormatte);
     
  }

  /**
   * CHERCHER_REUNIONS
   * Fait une requête asynchrone à la base de données pour obtenir toutes les
   * réunions entre une date de début et une date de fin. Marque les cases
   * ayant des réunions et y insèreles informations concernant celles-ci
   * @param {Date} debut 
   * @param {Date} fin 
   * @param {int} : indice de la case correspondant au premier et dernier jour à remplir, respectivement
   */
  async function chercherReunions(debut, fin, premierJour, dernierJour) {
    
    try {

      const dates = {'debut': debut, 'fin': fin}
      const reponse = await fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_reunions", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dates)
      });

      if (!reponse.ok) {
        throw new Error("Les réunions n'ont pas pu être cherchées");
      }

      const donnees = await reponse.json();
      // Pour les cases entre la date de début et de fin 
      for (let i = premierJour; i < dernierJour; i++) {

        // Liste des réunions pour une journée
        let listeReunionsJournee = [];
  
        // Liste des réunions
        for (let j = 0; j < donnees.length; j++) {
          
          // Date de la réunion
          let dateNombre = donnees[j]['date'].slice(8);
          
         // console.log(dateNombre.toString().padStart(2,'0'));
         // console.log($("#calendrier").children().eq(i).text());
          //Mettre un fond rouge si une réunion a été trouvée pour une certaine date
          if (dateNombre.toString().padStart(2,'0') == $("#calendrier").children().eq(i).text()) {
  
            $("#calendrier").children().eq(i).css("background-color", "red");
            console.log(i);
            // Stocke les informations de la réunion dans un tableau
            listeReunionsJournee.push(donnees[j]);
  
            // Mettre le tableau dans la case de la journée pour y accéder ailleurs
            $("#calendrier").children().eq(i).data("listeReunionsJournee", JSON.stringify(listeReunionsJournee));
          }
        }
    } 
      return donnees;
    }

    catch (error) {
      throw error;
    }
    

  }


  /**
   * AFFICHER_CALENDRIER
   * Remplit le calendrier avec les dates lorsque la page est chargée et 
   * lorsque l'utilisateur appuie sur les flèches pour changer de mois
   * @param {String} mois
   */ 
  function afficherCalendrier(mois) {
   
    // Vider le calendrier
    $("#calendrier").html("");

     // Afficher la date 
     afficherDate(mois);
  
    // Compte le nombre de cases remplis
    let compteur = 0;

    //??
    //joursMoisCourant = nouveauMois;
    
  
    //Premier jour du mois courant
    const premierDuMois = new Date(jourCourant.getFullYear(), jourCourant.getMonth(), 1);

    // Jour de la semaine où le mois commence
    const premierJour = premierDuMois.getDay();

                    //nbJoursMoisDernier = premierJour;
  
    // Premier jour du mois précédent devant être affiché
    const moisDernier = new Date(premierDuMois.getFullYear(), premierDuMois.getMonth(), 1-premierJour);
    let debutCalendrier = moisDernier.getDate();

    // Affiche les jours appartenant au mois précédant
    for (let i = compteur; i < premierJour; i++) {

      // Affiche la date et crée la case correspondante
      const journee = $("<div class='jour'></div>");
      journee.text(debutCalendrier);
      journee.css("background-color", "lightgray");
      
      // Ajoute la case contenant la date au calendrier
      $("#calendrier").append(journee);

      // Incrémente la date et le nombre de jours remplis
      debutCalendrier++;
      compteur++;
    }

    
console.log(moisDernier);
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

  chercherReunions(dateDebutFormatte, dateFinFormatte, 0, compteur);
 


  
    // Premier jour du mois courant
    const moisCourantPremierJour = new Date(jourCourant.getFullYear(), jourCourant.getMonth(), 1);

    // Dernier jour du mois courant
    const finDuMois = (new Date(jourCourant.getFullYear(), jourCourant.getMonth()+1, -1).getDate());

    //joursMoisDernier = finDuMois;
    //console.log(joursMoisDernier);

    // Compteur des jours du mois
    let index = 1;

    // Affiche les jours appartenant au mois courant
    for (let i = compteur; i < premierJour +finDuMois; i++) {

      const journee = $("<div class='jour'></div>");
      journee.text(index);
  
      // Met une bordure spéciale sur la journée courante
      if (i == new Date().getDate()+premierJour-1) {
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

    // Afficher les réunions du mois courant
    chercherReunions(dateDebutFormatte, dateFinFormatte, premierJour, compteur);
    

    // Affiche les jours appartenant au mois suivant
    index = 1;
    for (let j = finDuMois+premierJour -1; j < 41; j++) {
  
      const journee = $("<div class='jour'></div>");
      journee.text(index);
      journee.css("background-color", "lightgray");
  
      $("#calendrier").append(journee);
      index++;
    }


    // Chercher les réunions du mois prochain 
    dateDebutFormatte = "";

    dateDebutFormatte += premierDuMois.getFullYear() + "/";
    dateDebutFormatte += premierDuMois.getMonth()+2 + "/";
    dateDebutFormatte += premierDuMois.getDate();

    letDateFinFormatte = "";
    if (premierDuMois.getDate() > 9) {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-2);
    }

    else {
      dateFinFormatte = dateDebutFormatte.slice(0,dateDebutFormatte.length-1);
    }
    dateFinFormatte += premierDuMois.getDate() + 41 - (finDuMois+premierJour);
    console.log(dateFinFormatte);

    // Affiche les réunions du mois suivant
    console.log(compteur);
    chercherReunions(dateDebutFormatte, dateFinFormatte, compteur, 41);
  }

  

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


    if (!$(event.target).closest("#consulter-reunion-calendrier").length &&
        !$(event.target).closest("#formulaires-reunion").length &&
         $("#consulter-reunion-calendrier").hasClass("ouvrir-reunion")) {

          console.log("test");
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


      reunion.append("<p>" + formatterHeure(reunionsDuJour[i]['heure_debut']) + "-" + formatterHeure(reunionsDuJour[i]['heure_fin']) + "</p>");


      $("#panneau-reunions").append(reunion);

     } 

    // Évènement lorsque l'utilisateur clique sur une de ces réunions
    $(event.target).find(".reunion-pour-panneau").on("click", function() {
      alert("test");
    })


    }

    else if ($(event.target).is(".reunion-pour-panneau") && !$(event.target).hasClass("reunion-visible-panneau")) {

      $(event.target).addClass("reunion-visible-panneau")

      const infoReunions = $("<div id=informations-reunion></div>");

      const donnees = {"idReunions": reunionsDuJour[$(event.target).index()]['id_reunions']};

      // Ajouter la liste des participants
      console.log(reunionsDuJour[$(event.target).index()]['id_reunions']);
      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_liste_participants", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(donnees)
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

        for (let i = 0; i < data.length; i++) {

          let participant = $("<div class='participant-pour-reunion'><img src='../images/image_profil_vide.png' width='25px' height='25px'><div class='nom-participant-reunion'>" + data[i]['nom'] + "</div></div>");
          infoReunions.append(participant);

        }
      console.log(data); 
      console.log("ok");
      })
      .catch(error => {
      console.log(error);
      });

      $(event.target).append(infoReunions);
      $(event.target).append("<div id='boutons-pour-panneau'>" +
      "<div id='btn-panneau-reunion'><button id='consulter-reunion-panneau'>Joindre</button>" +
          "<button id='modifier-reunion-panneau'>Modifier</button></div></div>");
    }

    // Ouvrir l'onglet de modification de la réunion
    else if ($(event.target).is("#modifier-reunion-panneau")) {
      console.log("alright");

      $("#nouvelle-reunion").addClass("reunion-visible");
      
      // Remplir le formulaire avec les données courantes
      $("#formulaire-header").html("Modifier la réunion <br> ⋆༺𓆩𓆪༻༺𓆩⋆☾⋆☽⋆𓆪༻༺𓆩𓆪༻⋆");

      console.log(formatterHeure(reunionsDuJour[$(event.target).index()-1]['heure_fin']));

      $("#titre-reunion").val(reunionsDuJour[$(event.target).index()-1]['titre']);
      $("#debut-reunion").val(formatterHeure(reunionsDuJour[$(event.target).index()-1]['heure_debut']));
      $("#fin-reunion").val(formatterHeure(reunionsDuJour[$(event.target).index()-1]['heure_fin']));
      $("#date-reunion").val(reunionsDuJour[$(event.target).index()-1]['date']);
      $("#description-reunion").val(reunionsDuJour[$(event.target).index()-1]['description']);

      // Cocher la bonne case
      if (reunionsDuJour[$(event.target).index()]['id_groupes'] == null) {
         
        $("#groupes").prop("checked", true);
      }

      else {
        $("#btn-radio").prop("checked", true);
      }

      // Ajouter la liste des participants déjà invités
      const donnees = {"idReunions": reunionsDuJour[$(event.target).index()]['id_reunions']};

      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_liste_participants", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(donnees)
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

        
        // Contenant pour le participant
        const nouveauParticipant = $("<div class='nom-participant'> <p></p> </div> ");
        const boutonSupprimer = $("<button class='supprimer-participant'>X</button>");

        boutonSupprimer.on("click", function() {
          nouveauParticipant.remove();
      });

      
       nouveauParticipant.children("p").text(data[0]['nom']);
       nouveauParticipant.append(boutonSupprimer);

       console.log(data[0]['nom']);


       $("#liste-participants").append(nouveauParticipant);

      console.log(data); 
      console.log("ok");
      })
      .catch(error => {
      console.log(error);
      });



    }
})


})