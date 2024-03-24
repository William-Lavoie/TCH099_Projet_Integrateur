$(document).ready(function() {

  console.log(localStorage.getItem('reunionEstModifiee'));
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
   * Transforme les dates fournies par les objets de type Date() 
   * en format requis par la base de données: aaaa/mm/jj
   * @param {Date} date
   * @returns String: heure au format hh:mm
   */
   function formatterDate(date) {
    
    let dateFormatte = "";

    // Ajouter l'année
    dateFormatte += date.getFullYear() + "/";

    // Ajouter le mois (+1 car commence à 0)
    dateFormatte += date.getMonth()+1 + "/";

    // Ajouter la date
    dateFormatte += date.getDate();

    return dateFormatte;
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

          // Ajout d'un écouteur d'évènement
          $("#calendrier").children().eq(i).on('click', function() {

            // Appeler la fonction seulement quand le parent est cliqué
            if (this === event.target) {
              ouvrirReunion($(this));
            }
        });

           // Ajout de l'écouteur d'évènement aux enfants
           $("#calendrier").children().eq(i).children().on('click', function() {

            // Appeler la fonction seulement quand le parent est cliqué
            if (this === event.target) {
              ouvrirReunion($("#calendrier").children().eq(i));
            }
        });
  
  
        // Liste des réunions pour une journée
        let listeReunionsJournee = [];

        // Liste des réunions
        for (let j = 0; j < donnees.length; j++) {

          // Date de la réunion
          let dateNombre = donnees[j]['date'].slice(8);  

          if (dateNombre.toString().padStart(2,'0') == $("#calendrier").children().eq(i).find("p").text().padStart(2,'0')) {
  
            // Afficher la réunion dans la case
            let reunionJournee = $("<div class='reunion-journee'></div>");
            reunionJournee.text(donnees[j]['titre']);
            $("#calendrier").children().eq(i).find(".reunions-date").append(reunionJournee);

            // Stocke les informations de la réunion dans un tableau
            listeReunionsJournee.push(donnees[j]);
         //  console.log(listeReunionsJournee);

        
            // Mettre un écouteur d'évènement qui ouvre la réunion
               reunionJournee.on("click", function() {
                console.log(donnees[j]['courriel_createur']);
                  consulterReunionSpecifique($("#calendrier").children().eq(i), reunionJournee.index(), donnees[j]['courriel_createur']);
            })

          }
        }

            // Mettre le tableau dans la case de la journée pour y accéder ailleurs
            $("#calendrier").children().eq(i).data("listeReunionsJournee",listeReunionsJournee);

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
   * @param {Date} jour: premier jour du mois choisi
   */ 
  function afficherCalendrier(jour) {
   
    // Vider le calendrier
    $("#calendrier").html("");

     // Afficher la date 
     afficherDate(jour.getMonth());
  
    // Compte le nombre de cases remplis
    let compteur = 0;
  
    //Premier jour du mois courant
    const premierDuMois = new Date(jour.getFullYear(), jour.getMonth(), 1);

    // Jour de la semaine où le mois commence
    const premierJour = premierDuMois.getDay();
  
    // Premier jour du mois précédent devant être affiché
    const moisDernier = new Date(premierDuMois.getFullYear(), premierDuMois.getMonth(), 1-premierJour);
    let debutCalendrier = moisDernier.getDate();

    // Affiche les jours appartenant au mois précédant
    for (let i = compteur; i < premierJour; i++) {

      // Affiche la date et crée la case correspondante
      const journee = $("<div class='jour' id='pas-mois-courant'></div>");
      let dateJournee = $("<p>" + debutCalendrier + "</p>");

      journee.append(dateJournee);

      // Espace pour les réunions 
      let reunionDate = $("<div class=reunions-date></div>")
      journee.append(reunionDate);
      journee.css("background-color", "lightgray");
      
      // Ajoute la case contenant la date au calendrier
      $("#calendrier").append(journee);

      // Incrémente la date et le nombre de jours remplis
      debutCalendrier++;
      compteur++;
    }

    
    let dateDebutFormatte = formatterDate(moisDernier);
    let dateFinFormatte = formatterDate(new Date(moisDernier.getFullYear(), moisDernier.getMonth(), moisDernier.getDate()+premierJour-1));
    

    chercherReunions(dateDebutFormatte, dateFinFormatte, 0, compteur);
 
    // Premier jour du mois courant
    const moisCourantPremierJour = new Date(jour.getFullYear(), jour.getMonth(), 1);

    // Dernier jour du mois courant
    const finDuMois = (new Date(jour.getFullYear(), jour.getMonth()+1, 0).getDate());

    // Compteur des jours du mois
    let index = 1;

    // Affiche les jours appartenant au mois courant
    for (let i = compteur; i < premierJour +finDuMois; i++) {

      const journee = $("<div class='jour'></div>");
      let dateJournee = $("<p>" + index + "</p>");
      journee.append(dateJournee);

      // Espace pour les réunions 
      let reunionDate = $("<div class=reunions-date></div>")
      journee.append(reunionDate);
  
      
      // Met une bordure spéciale sur la journée courante
      if (i == new Date().getDate()+premierJour-1 && jour.getFullYear() === new Date().getFullYear() && jour.getMonth() === new Date().getMonth()) {
          journee.css("border", "3px solid #7eccff");
      }

      $("#calendrier").append(journee);
      index++;
      compteur++;
    }

    dateDebutFormatte = formatterDate(premierDuMois);
    dateFinFormatte = formatterDate(new Date(premierDuMois.getFullYear(), premierDuMois.getMonth(), premierDuMois.getDate()+finDuMois-1));

    // Afficher les réunions du mois courant
    chercherReunions(dateDebutFormatte, dateFinFormatte, premierJour, compteur);
    

    // Affiche les jours appartenant au mois suivant
    index = 1;
    for (let j = finDuMois+premierJour -1; j < 41; j++) {
  
      const journee = $("<div class='jour' id='pas-mois-courant'></div>");
      let dateJournee = $("<p>" + index + "</p>");
      journee.append(dateJournee);

      // Espace pour les réunions 
      let reunionDate = $("<div class=reunions-date></div>")
      journee.append(reunionDate);
      journee.css("background-color", "lightgray");
  
      $("#calendrier").append(journee);
      index++;
    }


    // Chercher les réunions du mois prochain 
    dateDebutFormatte = formatterDate(new Date(premierDuMois.getFullYear(), premierDuMois.getMonth()+1, 1))
    dateFinFormatte = formatterDate(new Date(premierDuMois.getFullYear(), premierDuMois.getMonth()+1, premierDuMois.getDate() + 41 - (finDuMois+premierJour)))

    // Affiche les réunions du mois suivant
    chercherReunions(dateDebutFormatte, dateFinFormatte, compteur, 42);
  }

  

  // Remplir le calendrier au mois courant
  afficherCalendrier(jourCourant);

  /**
   * OUVRIR_REUNION
   * Lorsque l'utilisateur appuie sur une journée dans le calendrier, ouvre 
   * le menu présentant les différentes réunions de cette journée
   * @param {div} journee 
   */
  function ouvrirReunion(journee) {

      // Désactiver tous les boutons et rendre le fond moins opaque
      $("#consulter-reunion-calendrier").addClass("ouvrir-reunion");
      $("#consulter-reunion-calendrier").text();
      $("main, header, footer, #creer-reunion").addClass("focus"); 

      // Écrire la date 
      let journeeSemaine = trouverJourneeSemaine(journee.index())
      console.log(journeeSemaine);

      // Prendre la date dans la case
      let date = journee.find("p").text();
      $("#consulter-reunion-calendrier span").html(journeeSemaine + " " + date + "<br>⋆༺𓆩𓆪༻༺𓆩⋆☾⋆☽⋆𓆪༻༺𓆩𓆪༻⋆");

      $("#consulter-reunion-calendrier span").find("button").remove();

      // Bouton pour quitter l'onglet
      let boutonQuitter = $("<button id='quitter-reunion'></button>");
      $("#consulter-reunion-calendrier span").append(boutonQuitter);

      $("#quitter-reunion").on("click", function(event) {
        event.preventDefault();
        $("#consulter-reunion-calendrier").removeClass("ouvrir-reunion");

      })

      // Représenter les différentes réunions dans l'onglet
      $("#panneau-reunions").html("");

      console.log(journee.data("listeReunionsJournee"));
      // Afficher les réunions de la journée
      for (let i = 0; i < journee.data("listeReunionsJournee").length; i++) {
 
        // Affichage des réunions
        const reunion = $("<div class='reunion-pour-panneau'></div>");
        reunion.append("<p>" + journee.data("listeReunionsJournee")[i]['titre'] + "</p>");

        // Afficher l'heure
        reunion.append("<p>" + formatterHeure(journee.data("listeReunionsJournee")[i]['heure_debut']) + "-" + formatterHeure(journee.data("listeReunionsJournee")[i]['heure_fin']) + "</p>");
 
        // Insérer les informations dans la réunion 
        reunion.data("listeReunionsJournee", journee.data("listeReunionsJournee")[i]);

        // Ajouter la réunion
        $("#panneau-reunions").append(reunion);

        $("#panneau-reunions").children().eq(i).on("click", function() {
           consulterReunion($(this), journee.data("listeReunionsJournee")[i]['courriel_createur']);
        })

      }

      if ($("#panneau-reunions").html() === "") {
        $("#panneau-reunions").text("Vous n'avez aucune réunion de planifiée!")
      }
      
  }  


  /**
   * CONSULTER_REUNION
   * Lorsque l'utilisateur appuie sur une réunion parmis le menu des réunions
   * d'une journée, ouvre son onglet et lui offre l'option de la joindre 
   * ou de la modifier
   * @param {div} reunion 
   * @param {String} courriel du créateur de la créunion
   */
  function consulterReunion(reunion, createur) {

    console.log(reunion);
    if (!reunion.hasClass("reunion-visible-panneau")) {

      reunion.addClass("reunion-visible-panneau");
      const infoReunions = $("<div id='informations-reunion'></div>");
      const donnees = {"idReunions": reunion.data("listeReunionsJournee")['id_reunions']};

      // Ajouter la liste des participants
      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_liste_participants", {
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

        // Ajouter les participants
        for (let i = 0; i < data.length; i++) {

          let participant = $("<div class='participant-pour-reunion'><img width='35px' height='35px'><div class='nom-participant-reunion'>" + data[i]['nom'] + "</div></div>");
          infoReunions.append(participant);

          chercherPhoto(data[i]['courriel_utilisateurs'],i, reunion);
        }
      })
      .catch(error => {
      console.log(error);
      });

      reunion.append(infoReunions);

      // Ajouter les boutons pour joindre ou modifier la réunion
      reunion.append("<div id='boutons-pour-panneau'><div id='btn-panneau-reunion'></div></div>");

      // Créer des écouteurs d'évènements pour les boutons
      let boutonJoindre = $("<button id='consulter-reunion-panneau'>Joindre</button>"); 
      boutonJoindre.on("click", function() {
        console.log("temporary");
        joindreReunion(reunion);
      });

      $(reunion).find("#btn-panneau-reunion").append(boutonJoindre);


      // Ajoute le bouton modifier si l'utilisateur est le créateur de la réunion
      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher-courriel", {
      })
      .then(response => {

      if (response.ok) {

      return response.json();
      }

      else {
      }
      })
      .then(reponse => {

          console.log(reponse);
          
       if (reponse == createur) {
           let boutonModifier = $("<button id='modifier-reunion-panneau'>Modifier</button>");
           boutonModifier.on("click", function() {
           modifierReunion(reunion);
           console.log("temporary");
          });

          $(reunion).find("#btn-panneau-reunion").append(boutonModifier);
       }  


      })
      .catch(error => {
      console.log(error);
      });  
     
      reunion.find("#quitter-reunion").remove();

      /* Bouton pour revenir en arrière
      let boutonQuitter = $("<button id='retour-reunion'></button>");
      $("#consulter-reunion-calendrier span").append(boutonQuitter);

      $("#retour-reunion").on("click", function(event) {
        event.preventDefault();

        $("#consulter-reunion-calendrier span").find("button").remove();
        $(reunion).find("#informations-reunion").remove();
        $(reunion).find("#btn-panneau-reunion").remove();

        $(reunion).removeClass("reunion-visible-panneau");

         // Bouton pour quitter l'onglet
        let boutonQuitter = $("<button id='quitter-reunion'></button>");
        $("#consulter-reunion-calendrier span").append(boutonQuitter);

        $("#quitter-reunion").on("click", function(event) {
        event.preventDefault();
        $("#consulter-reunion-calendrier").removeClass("ouvrir-reunion");

      })

      })*/


    }
    
  }

/**
 * Permet d'afficher directement une réunion spécifique en appuyant 
 * dessus sur la calendrier
 * @param {div} journee 
 * @param {int} index 
 */
  function consulterReunionSpecifique(journee, index, createur) {

    ouvrirReunion(journee);
    consulterReunion($("#panneau-reunions").children().eq(index), createur);
  }

  /**
   * Permet d'afficher la photo d'un utilisateur pour une réunion
   * L'index correspond à sa position dans la liste  
   * @param {String} courriel 
   * @param {int} index
   */
  async function chercherPhoto(courriel, index, reunion) {

    const donnees = {"courriel": courriel};
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_photo", {
    method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(donnees)
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
      

      if (data != undefined && data != null) {

       reunion.children().eq(2).children().eq(index).children().eq(0).css({
          'background-image': 'url(' + URL.createObjectURL(data) + ')',

        });
  
    }})
    .catch(error => {

       console.log("Erreur")
      
    });
  }



  /**
   * Permet à un utilisateur d'accéder à une de ses réunions en appuyant sur "Joindre"
   * @param {div} reunion 
   */
  function joindreReunion(reunion) {

    let idReunion = reunion.data("listeReunionsJournee")['id_reunions'];
    window.location.href = "../../réunions/réunions.html?info=" + encodeURIComponent(idReunion);
  }



  /**
   * MODIFIER_REUNION
   * Permet de modifier une réunion pour tous les participants. Les nouvelles
   * valeurs doivent être valides
   * Note: Toute la vérification est faite dans calendrier_script.js
   * @param {div} reunion 
   */
  function modifierReunion(reunion) {

    localStorage.setItem('reunionEstModifiee', true);
    localStorage.setItem('reunionIdentifiant', reunion.data("listeReunionsJournee")['id_reunions']);


    $("#nouvelle-reunion").addClass("reunion-visible");

    // Remplir le formulaire avec les données courantes
    $(".formulaire-header").html("Modifier la réunion <br> ⋆༺𓆩𓆪༻༺𓆩⋆☾⋆☽⋆𓆪༻༺𓆩𓆪༻⋆");

    $("#titre-reunion").val(reunion.data("listeReunionsJournee")['titre']);
    $("#debut-reunion").val(formatterHeure(reunion.data("listeReunionsJournee")['heure_debut']));
    $("#fin-reunion").val(formatterHeure(reunion.data("listeReunionsJournee")['heure_fin']));    
    $("#date-reunion").val(reunion.data("listeReunionsJournee")['date']);
    $("#description-reunion").val(reunion.data("listeReunionsJournee")['description']);

    // Cocher la case "Participants" ou "Groupe"
    if (reunion.data("listeReunionsJournee")['id_groupes'] == null) {
         
      $("#groupes").prop("checked", true);

      donnees = {"idReunions": reunion.data("listeReunionsJournee")['id_reunions']};

      // Ajouter la liste des participants déjà invités à la réunion
      fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_liste_participants", {
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

        // Ajouter les participants
        for (let i = 0; i < data.length; i++) {

          if (reunion.data("listeReunionsJournee")['courriel_createur'] != data[i]['courriel_utilisateurs']) {

            // Contenant pour le participant
            const nouveauParticipant = $("<div class='nom-participant'> <p></p> </div> ");
            const boutonSupprimer = $("<button class='supprimer-participant'>🗑</button>");

            // Le participant est ajouté à la liste
            $("#nouveau-participant").val("");

            // Bouton pour supprimer le participant 
            boutonSupprimer.on("click", function(event) {
                event.stopPropagation();
                nouveauParticipant.remove();
            });

            // Création du participant dans le formulaire 
            nouveauParticipant.children("p").text(data[i]['courriel_utilisateurs']);
            nouveauParticipant.append(boutonSupprimer);
            $("#liste-participants").append(nouveauParticipant);
            console.log("ok");
            }
          
        }
      })
      .catch(error => {
      console.log(error);
      });
      
    }

    else {
      $("#btn-radio").prop("checked", true);



    }


    // Afficher la liste des tâches 
    donnees = {'idReunions': reunion.data("listeReunionsJournee")['id_reunions']};
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_liste_taches", {
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

          console.log("test");
            const nouvelleTache = $("<div class='nom-participant'> <p></p> </div> ");
            const boutonSupprimer = $("<button class='supprimer-tache'>🗑</button>");

            // Bouton pour supprimer la tâche 
            boutonSupprimer.on("click", function(event) {

                // Évite de supprimer les parents également
                event.stopPropagation(); 
                $(this).parent().remove();
            });

            // Création de la tâche dans le formulaire 
              nouvelleTache.children("p").text(data[i]['titre']);
              nouvelleTache.append(boutonSupprimer);
              $("#liste-taches").append(nouvelleTache);
            }

        })
        .catch(error => {
        console.log(error);
        });




  }

  /**
   * Permet de passer au mois précédant
   */
  $("#btn-dernier-mois").on("click", function() {

    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()-1);
    afficherCalendrier(jourCourant);
  })

  /**
   * Permet de passer au mois suivant
   */
  $("#btn-prochain-mois").on("click", function() {

    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()+1);
    afficherCalendrier(jourCourant);
  })


})