$(document).ready(function() {

    
    // Informations par rapport à une réunion
    let titre;
    let dateReunion;
    let debutReunion;
    let finReunion;
    let description;

    // Liste des participants à ajouter à une réunion
    let participantsReunion = [];

    // Liste des tâches à ajouter à une réunion
    let listeTaches = [];

    // Détermine si la réunion doit être créée ou modifiée
    localStorage.setItem('reunionEstModifiee', false);  

    /**
     * Vide tous les champs et ferme les formulaires de création d'une réunion
     */ 
    function fermerFormulaires() {

        $("form").removeClass("reunion-visible");

        // Vider les formulaires
        $("#titre-reunion").val("");
        $("#debut-reunion").val("");
        $("#fin-reunion").val("");
        $("#date-reunion").val("");
        $("#description-reunion").val("");

        $("#liste-participants").text("");

        $("#messages-erreur").text("");

        // Réinitialiser les variables
        titre = null;
        debutReunion = null;
        finReunion = null;
        dateReunion = null;
        description = null;
        listeTaches = [];
        participantsReunion = [];
    }


    /** Lorsqu'un onglet ou un formulaire est ouvert, réduit l'opacité et 
     * empêche l'interaction avec tout élément autre que l'onglet
     */
    function enleverFocus() {
        $("main, header, footer, #creer-reunion").removeClass("hors-focus");
    }


    /**
     * Vérifier que les heures et la date choisie sont valides. 
     * Retourne un booléen et affiche un message d'erreur si nécessaire
     */ 
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

        // L'heure est la même mais les minutes ne concordent pas
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

                    console.log(date.getDay());
                $("#messages-erreur").text("L'heure ne peut pas être déjà passée");
                return false;
        }

        return true;
    }


    /**  Vérifie si le courriel passé en paramètre a été ajouté à la liste
    *    des participants dans le formulaire de création d'une réunion
    */
    function courrrielPresent(courriel) {

        //Liste des participants entrés par l'utilisateur
        const listeParticipants = $("#liste-participants p");

        // Compare chaque courriel dans la liste au nouveau courriel ajouté
        for (let i=0; i < listeParticipants.length; i++) {

            if (listeParticipants[i].innerText === courriel) {
                return true;
            }
        }

        return false;
    }


    // Vérifie si un formulaire est vide (i.e aucun champ n'a été rempli)
    function formulaireEstRempli() {
     return ($("#titre-reunion").val() != "" ||
             $("#debut-reunion").val() != "" ||
             $("#fin-reunion").val() != ""   ||
             $("#date-reunion").val() != ""  ||
             $("#description-reunion").val() != "");        
    }

    function afficherListeGroupes() {


        $("#choix-groupe").html("");
        $("#choix-groupe").append("<option value='null'>Veuillez choisir un groupe</option>");

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
          for (let i = 0; i < data.length; i++) {

            // Mettre comme valeur l'identifiant de la réunion
            const nouvelleValeur = $("<option value='" + data[i]['id_groupes'] + "'>" + data[i]['nom'] +"</option>");
            $("#choix-groupe").append(nouvelleValeur);
          }
            
        })
        .catch(error => {
    
          console.log("erreur");
        });
    }

/**
 * A_CONFLIT_HORAIRE
 * Détermine si un participant a une réunion de prévue à l'heure choisie lors de la création d'une nouvelle réunion
 * @param {String} courriel 
 * @param {heure} debut 
 * @param {heure} fin 
 * @param {Date} date 
 */
    function aConflitHoraire(courriel, debut, fin, date) {

        const donnees = {'courriel': courriel,
                         'debut': debut,
                         'fin': fin,
                         'date': date};

        fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/chercher_conflit", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
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
                
              if (data.length > 0) {
                alert(courriel + " a une réunion à " + data[0]['heure_debut']);
              }
            })
            .catch(error => {
            console.log(error);
            });

    }



    /**
     * Prévient le comportement par défaut des boutons dans les formulaires
     * afin d'utiliser notre propre implémentation
     * */ 

    $("form button").on("click", function(event) {
        event.preventDefault();
    })


    /**  Afficher le formulaire de création d'une réunion lorsque l'utilisateur
    *    Appuie sur le bouton "Réunion"
    */
    $("#creer-reunion").on("click", function() {


        fermerFormulaires();

        localStorage.setItem('reunionEstModifiee', false);
        $(".formulaire-header").html("Créer une nouvelle réunion <br> ⋆༺𓆩𓆪༻༺𓆩⋆☾⋆☽⋆𓆪༻༺𓆩𓆪༻⋆");
        console.log(localStorage.getItem('reunionEstModifiee'));

        // Affiche le formulaire
        $("#nouvelle-reunion").addClass("reunion-visible");

        // Réduit l'opacité et désactive toutes les fonctionalités de tout l'écran sauf le formulaire
        $("main, header, footer, #creer-reunion").addClass("focus");
    }) 


    // Fermer le formulaire de création d'une réunion en appuyant sur retour
    $("#reunion-retour").on("click", function() {

        // Si le formulaire contient des informations, demande une confirmation
        if (formulaireEstRempli()) {

            // L'utilisateur confirme vouloir fermer le formulaire
            if (confirm("Vos modifications ne seront pas sauvegardées, êtes-vous sûr de vouloir continuer?")) {
                
                fermerFormulaires();
                $("main, header, footer, #creer-reunion").removeClass("focus");

                enleverFocus();
            }

        }
        // Le formulaire est vide
        else {
            fermerFormulaires();
            $("main, header, footer, #creer-reunion").removeClass("focus");

            enleverFocus();
        }
      
    }) 

    /**
     * Fermer le formulaire de création d'une réunion en appuyant n'importe où 
     * ailleurs sur la page
     */
    $("body").on("click", function(event) {

        // Le formulaire est actif et l'utilisateur ne clique pas dessus ni sur "Modifier"
        if ($("#formulaires-reunion").has(event.target).length <= 0 &&
             // Empêche le formulaire de fermer dès son ouverture
             !$(event.target).is("#creer-reunion") &&
             !$(event.target).is("#modifier-reunion-panneau") &&
             !$(event.target).is("#btn-creer-tache")) {

            fermerFormulaires();
            enleverFocus();
            $("main, header, footer, #creer-reunion").removeClass("focus");

        }
    })

    /** Passage à la deuxième partie du formulaire lorsque l'utilisateur 
     *  appuie sur "Continuer"
     */
    $("#reunion-continuer").on("click", function(event) {

        // Vérifie que tous les champs sont remplis
        if ($("#nouvelle-reunion")[0].checkValidity()) {

            // Conserver les informations 
            titre = $("#titre-reunion").val();
            debutReunion = $("#debut-reunion").val();
            finReunion = $("#fin-reunion").val();
            dateReunion = $("#date-reunion").val();
            description = $("#description-reunion").val();

            // Vérifie que l'heure et la date sont valides
            if (heureDateValides()) {

                // Si la réunion est en cours de modification
                if (localStorage.getItem('reunionEstModifiee') == true) {
                    console.log("ok");
                    $(".formulaire-header").html("Modifier la réunion <br> ⋆༺𓆩𓆪༻༺𓆩⋆☾⋆☽⋆𓆪༻༺𓆩𓆪༻⋆");
                }


                // Passer à la page suivante selon l'option choisie (groupe ou participants)
                if ($("#btn-radio")[0].checked) {
                    $("#creer-reunion-groupe").addClass("reunion-visible");
                    afficherListeGroupes();

                }

                if ($("#groupes")[0].checked) {
                    $("#creer-reunion-participants").addClass("reunion-visible");
                }
            }

           
        }

        // Affiche un message d'erreur selon le champ qui n'a pas été rempli
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

     /**
      * Retour vers la première page du formulaire depuis la page des groupes
      */
     $("#btn-retour-groupes").on("click", function(event) {
       
        $("#creer-reunion-groupe").removeClass("reunion-visible");
     })

    /** Retour vers la première page du formulaire depuis 
     * la page des participants
     */
     $("#btn-retour-participants").on("click", function(event) {
       
        $("#creer-reunion-participants").removeClass("reunion-visible");
     })


     // TODO: SUBMITTING GROUP BY READING FIELD INSTEAD OF ARRAY
    /** 
     * Ajout d'un participant si celui-ci a un compte valide
     */
    $("#btn-creer-participant").on("click", function() {

        let erreur = false;

        console.log("ok");
        // Réinitialise le message d'erreur
        $("#messages-erreur-participants").text("");

        // Courriel entré par l'utilisateur
        let texte = $("#nouveau-participant").val();

        // Contenant pour le participant
        const nouveauParticipant = $("<div class='nom-participant'> <p></p> </div> ");
        const boutonSupprimer = $("<button class='supprimer-participant'>🗑</button>");


        // Le créateur ne peut pas s'ajouter lui-même car il en fait parti par défaut
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

            if (texte == reponse) {

                $("#messages-erreur-participants").text("Vous faites déjà parti de la réunion!");
            }

            // Le même participant ne doit pas être ajouté plus d'une fois
        else if (courrrielPresent(texte)) {
            $("#nouveau-participant").val("");
            $("#messages-erreur-participants").text(texte + " a déjà été ajouté!");
        }

        // Le courriel du participant doit être valide
        else if (texte != "" && texte.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {

            // Le participant doit avoir un compte dans la base de données
            const courriel = {"courriel": texte};
    
            // Cherche le participant dans la table des utilisateurs de la base de données
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

                aConflitHoraire(texte, debutReunion, finReunion, dateReunion);
                    
                // Le participant est ajouté à la liste
                $("#nouveau-participant").val("");

                // Bouton pour supprimer le participant 
                boutonSupprimer.on("click", function(event) {
                    event.stopPropagation();
                    nouveauParticipant.remove();
                });
 
                // Création du participant dans le formulaire 
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

        // Aucune adresse n'a été entrée 
        else if (texte == "") {
            $("#messages-erreur-participants").text("Vous devez entrer une adresse courriel");
        }
        
        // L'adresse n'est pas valide
        else {
            $("#messages-erreur-participants").text(texte + " n'est pas une adresse valide!");
        }
          

    
        })
        .catch(error => {
        console.log(error);
        });  

        
    }) 



    // Ajout d'une tâche
    $("#btn-creer-tache").on("click", function() {

         // Tâche entrée par l'utilisateur
         let texte = $("#nouvelle-tache").val();

         // La tâche est ajoutée à la liste
         $("#nouvelle-tache").val("");

         const nouvelleTache = $("<div class='nom-participant'> <p></p> </div> ");
         const boutonSupprimer = $("<button class='supprimer-tache'>🗑</button>");

         // Bouton pour supprimer le participant 
         boutonSupprimer.on("click", function(event) {

            // Évite de supprimer les parents également
            event.stopPropagation(); 
            $(this).parent().remove();
        });

         // Création du participant dans le formulaire 
          nouvelleTache.children("p").text(texte);
          nouvelleTache.append(boutonSupprimer);
          $("#liste-taches").append(nouvelleTache);

    })

    // Revenir en arrière à partir du formulaire de création des tâches
    $("#btn-retour-liste").on("click", function() {
        event.preventDefault();
        $("#creer-liste-taches").removeClass("reunion-visible");
    })

    // Accéder à la liste des tâches à partir du formulaire des groupes
    $("#btn-continuer-groupes").on("click", function() {

        let groupe = $("#choix-groupe").val();

        //TODO ??
        if (groupe === "null" || groupe === undefined) {
            console.log("ok");
            $("#espace-vide").text("Vous devez choisir un groupe");
        }
        else {
            $("#creer-liste-taches").addClass("reunion-visible");

            // Empêche de mettre plusieurs boutons
            $("#creer-liste-taches").children().find("#btn-confirmer-participants, #btn-confirmer-groupes").remove();

            $("#creer-liste-taches").children().find(".btn-reunion").append("<button id='btn-confirmer-groupes'>Confirmer</button>");
    
            $("#creer-liste-taches").children().find("#btn-confirmer-groupes").on("click", function(event) {
                event.preventDefault();
                envoyerFormulaireGroupe();
            });
        }
        

    })

    // Accéder à la liste des tâches à partir du formulaire des participants
    $("#btn-continuer-participants").on("click", function() {

        if ($("#liste-participants").children().length != 0) {

            $("#creer-liste-taches").addClass("reunion-visible");

            // Empêche de mettre plusieurs boutons
            $("#creer-liste-taches").children().find("#btn-confirmer-participants, #btn-confirmer-groupes").remove();
    
            $("#creer-liste-taches .btn-reunion").append("<button id='btn-confirmer-participants'>Confirmer</button>");
    
            $("#creer-liste-taches").children().find("#btn-confirmer-participants").on("click", function(event) {
                event.preventDefault();
                envoyerFormulaireParticipants();
            });
        }

        else {
            $("#messages-erreur-participants").text("Vous devez ajouter au moins un participant");

        }
      

    

    })

   

function envoyerFormulaireGroupe() {
    let groupe = $("#choix-groupe").val();
    
    if (groupe == null) {
        $("#espace-vide").text("Vous devez choisir un groupe");
    }

    else {

        for (let i = 0; i < $("#liste-taches").children().length; i++) {
            listeTaches.push($("#liste-taches").children().eq(i).find("p").text());
        }
    
        if (groupe != null) {

            const donnees = {"titre": titre,
            "debutReunion": debutReunion,
            "finReunion": finReunion,
            "dateReunion": dateReunion,
            "description": description,
            "groupe": groupe,
            "taches": listeTaches};

            if (!localStorage.getItem("reunionEstModifiee")) {
                // Les informations de la réunions sont ajoutées à la base de données
            
            fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/creer_reunion_groupes", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
            })
            .then(response => {
    
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
    
        }

        // La réunion est modifiée
        else {

            const donnees = {"titre": titre,
            "debutReunion": debutReunion,
            "finReunion": finReunion,
            "dateReunion": dateReunion,
            "description": description,
            "groupe": groupe,
            "taches": listeTaches,
            "id_reunions": localStorage.getItem("reunionIdentifiant")};

            fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/modifier_reunion_groupes", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(donnees)
                })
                .then(response => {
        
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
        
        }
    }
    
}
}    

function envoyerFormulaireParticipants() {

    for (let i = 0; i < $("#liste-taches").children().length; i++) {
        listeTaches.push($("#liste-taches").children().eq(i).find("p").text());
    }

    for (let i = 0; i < $("#liste-participants").children().length; i++) {
        participantsReunion.push($("#liste-participants").children().eq(i).find("p").text());
    }

    if (!localStorage.getItem("reunionEstModifiee")) {

        // Les informations de la réunions sont ajoutées à la base de données
        const donnees = {"titre": titre,
        "debutReunion": debutReunion,
        "finReunion": finReunion,
        "dateReunion": dateReunion,
        "description": description,
        "listeParticipants": participantsReunion,
        "taches": listeTaches};

        fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/creer_reunion_participants", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(donnees)
        })
        .then(response => {

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
    }
        // La réunion est modifiée
        else {

                // Les informations de la réunions sont ajoutées à la base de données
            const donnees = {"titre": titre,
            "debutReunion": debutReunion,
            "finReunion": finReunion,
            "dateReunion": dateReunion,
            "description": description,
            "listeParticipants": participantsReunion,
            "taches": listeTaches,
            "id_reunions": localStorage.getItem("reunionIdentifiant")};

            fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/modifier_reunion_participants", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(donnees)
            })
            .then(response => {

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
        }


  

}
             
    
});


      
