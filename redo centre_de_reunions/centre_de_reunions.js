/*
 * Basculer la barre latérale (groupes)
 */

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
        reunions.style.marginLeft = "-6%";
        document.getElementById("basculer").innerText = "⪔";
    }
}


/**FORMATTER_DATE 
   * Transforme les dates fournies par les objets de type Date() 
   * en format donné par la base de données: aaaa-mm-jj
   * @param {Date} date
   * @returns String: heure au format hh:mm
   */
function formatterDate(date) {
    
    let dateFormatte = "";

    // Ajouter l'année
    dateFormatte += date.getFullYear() + "-";

    // Ajouter le mois (+1 car commence à 0)
    dateFormatte += String(date.getMonth()+1).padStart(2,'0') + "-";

    // Ajouter la date
    dateFormatte += String(date.getDate()).padStart(2,'0');

    return dateFormatte;
  }

/*
 * Affiche les réunions spécifiques à un groupe
 */

function afficherReunionsGroupe(groupe) {

    $("#conteneur-reunions-prochaines").html("");
    $("#conteneur-reunions-passees").html("");


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
        } else {
            console.log("error");
        }
    })
    .then(data => {
        for (let i = 0; i < data.length; i++) {
           

            let nouvelleReunion = $("<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +  data[i]['titre'] + "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" + data[i]['description'] + "</div></div></div>");
            if (data[i]['date'] >= formatterDate(new Date())) {
                $("#conteneur-reunions-prochaines").append(nouvelleReunion);
            }

            else {
                $("#conteneur-reunions-passees").append(nouvelleReunion);

            }
            // Ouvrir la réunion quand l'utilisateur clique dessus
            nouvelleReunion.on("click", function() {
                let idReunion = data[i]['id_reunions'];
                window.location.href = "../../réunions/réunions.html?info=" + encodeURIComponent(idReunion);
            });
        }
    })
    .catch(error => {});
}

document.addEventListener('DOMContentLoaded', function () {

    afficherReunion();



    function afficherReunion() {

        $("#conteneur-reunions-prochaines").html("");
        $("#conteneur-reunions-passees").html("");
        
        // Afficher les réunions 
        fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/obtenir_reunions_utilisateur", {})
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("error");
            }
        })
        .then(data => {

            
            for (let i = 0; i < data.length; i++) {
                let nouvelleReunion = $("<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +  data[i]['titre'] + "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" + data[i]['description'] + "</div></div></div>");

                if (data[i]['date'] >= formatterDate(new Date())) {
                    $("#conteneur-reunions-prochaines").append(nouvelleReunion);
                }

                else {
                    $("#conteneur-reunions-passees").append(nouvelleReunion);

                }

                // Ouvrir la réunion quand l'utilisateur clique dessus
                nouvelleReunion.on("click", function() {
                    let idReunion = data[i]['id_reunions'];
                    window.location.href = "../../réunions/réunions.html?info=" + encodeURIComponent(idReunion);
                });
            }
        })
        .catch(error => {});
    }

    // Afficher la liste des groupes
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/afficher_groupes", {})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    })
    .then(data => {
    
    
        const groupesTable = $("#table-groupes");

        for (let i = 0; i < data.length; i++) {
            const nouveauGroupe = $("<button class='groupe'>").text(data[i]['nom']);
            const nouvelleCellule = $("<td class='cellule-groupe'>").append(nouveauGroupe);

            // Ajouter le bouton de modification du groupe si l'utilisateur en est le créateur
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
                
             if (reponse == data[i]['courriel_enseignant']) {
      
            console.log("ok");
                let boutonModifier = $("<button class='modifier-groupe'>✎</button>");
                nouvelleCellule.append(boutonModifier);

                // Écouter d'évènement pour modifier le groupe
                boutonModifier.on("click", function() {

                    console.log("ok");
                    modifierGroupe(data[i]);
                })
             }  
             
            })
            .catch(error => {
            console.log(error);
            });  
           
            
            //Ajouter le groupe à la tabke
            groupesTable.find("tr").last().after($("<tr>").append(nouvelleCellule));

            nouveauGroupe.on("click", function(event) {
                event.preventDefault();

                // Si le groupe est déjà sélectionné, affiche toutes les réunions
                if ($(this).hasClass("groupe-choisi")) {
                    afficherReunion();
                    $("button").removeClass("groupe-choisi");
                } 
                
                // Afficher uniquement les réunions du groupe choisi
                else {
                    $("button").removeClass("groupe-choisi");
                    $(this).addClass("groupe-choisi");
                    afficherReunionsGroupe(data[i]['id_groupes']);
                }
            });
        }
    })
    .catch(error => {
        console.log("erreur");
    });
});

$(document).ready(function() {
    
    /*
     * SÉLECTIONNER LES ÉLÉMENTS
     */

    // Éléments pour créer un nouveau groupe
    const btnCreerGroupe = $("#table-creer-groupe");
    const formulaireGroupe = $("#conteneur-creer-groupe");
    const btnRetour = $("#retour-creer-groupe");
    const btnConfirmer = $("#confirmer-creer-groupe");
    const btnAjouterParticipant = $("#btn-ajouter-participant");
    const listeParticipants = $("#liste-participants");
    const erreurs = $("#messages-erreur-participants-groupe");
    const groupesTable = $("#groupes");

    let tableauParticipants = [];


    /**  Vérifie si le courriel passé en paramètre a été ajouté à la liste
    *    des participants dans le formulaire de création d'un groupe
    */
      function courrrielPresent(courriel) {

        //Liste des participants entrés par l'utilisateur
        const listeParticipants = $("#liste-participants-groupe p");

        // Compare chaque courriel dans la liste au nouveau courriel ajouté
        for (let i=0; i < listeParticipants.length; i++) {

            if (listeParticipants[i].innerText === courriel) {
                return true;
            }
        }

        return false;
    }



    // Affiche le bouton de création d'un nouveau groupe uniquement si l'utilisateur est
    // un enseignant
    fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/afficher_type", {
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
    
        if (data['type'] === 'enseignant') {

            $("#table-creer-groupe").css({"display": "block"});
        }   

    })
    .catch(error => {

    });

      // Afficher le formulaire pour créer un groupe
      btnCreerGroupe.click(function() {
        formulaireGroupe.css("visibility", "visible");
    });


    // Valider les champs avant de procéder avec le bouton "Confirmer"
    btnConfirmer.click(function(event) {
        event.preventDefault(); // Prévient le reload (Besoin API)

        // Conserver les informations des champs
        const nomGroupe = $("#nom-groupe").val().trim();

        // Ajouter les noms des participants au tableau
        for (let i = 0; i < $("#liste-participants-groupe").children().length; i++) {
            tableauParticipants.push($("#liste-participants-groupe").children().eq(i).find("p").text());
        }

        // Vérifier si le champ nom du groupe est valide
        if (nomGroupe == "") {
            erreurs.text("Vous devez choisir un nom.");
        } else if (tableauParticipants.length < 1) {
            erreurs.text("Il doit y avoir au moins un participant.");
        } else {
            erreurs.text(""); // Vider les erreurs

            // Si tous les champs sont valides, procéder à la soumission du formulaire
            const donnees = {"nom": nomGroupe, "participants": tableauParticipants};

            fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/ajouter_groupe", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(donnees)
            })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    throw new Error("La création de la réunion n'a pas fonctionnée");
                }
            })
            .catch(error => {
                console.log(error);
            });

            // Cacher le formulaire (fin)
            formulaireGroupe.css("visibility", "hidden");

            // Réinitialiser les champs du formulaire
            $("#nom-groupe").val('');
            listeParticipants.text('');
            erreurs.text('');
        }
    });

   

    // Fermer le formulaire de création de groupe
    // Par le bouton retour
    btnRetour.click(function() {
        formulaireGroupe.css("visibility", "hidden");
    });

    // Par l'arrière plan
    formulaireGroupe.click(function(event) {
        if (event.target === this) {
            formulaireGroupe.css("visibility", "hidden");
        }
    });

    // Ajouter un participant
    btnAjouterParticipant.click(function(event) {
        event.preventDefault();

        const participant = $("#nouveau-participant-groupe").val().trim();
        

        const nouveauParticipant = $("<div class='nom-participant-groupe'> <p></p> </div> ");
        const boutonSupprimer = $("<button class='supprimer-participant-groupe'>🗑</button>");


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


            if (participant === "") { 
                erreurs.text("Veuillez saisir une adresse courriel.");
            } 
            else if (tableauParticipants.includes(participant)) {
                erreurs.text("Le participant est déjà dans la liste.");
            } 

            else if (participant == reponse) {

                $("#messages-erreur-participants-groupe").text("Vous n'avez pas besoin de vous ajouter au groupe.");
            }                


            // Le courriel du participant doit être valide
            else if (validerAdresse(participant)) {

                // Le participant doit avoir un compte dans la base de données
                const courriel = {"courriel": participant};
        
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

                    if (courrrielPresent(participant)) {
                        $("#messages-erreur-participants-groupe").text(participant + " est déjà présent");
                    }
                        
                    else {
                        
                        // Le participant est ajouté à la liste
                        $("#nouveau-participant-groupe").val("");

                        // Bouton pour supprimer le participant 
                        boutonSupprimer.on("click", function(event) {
                            event.stopPropagation();
                            nouveauParticipant.remove();
                        });
        
                        // Création du participant dans le formulaire 
                        nouveauParticipant.children("p").text(participant);
                        nouveauParticipant.append(boutonSupprimer);
                         $("#liste-participants-groupe").append(nouveauParticipant);
    
                    }
             
                }

               else {

                $("#messages-erreur-participants-groupe").text(participant + " ne correspond pas à un compte HuddleHarbor");

               }
                
            })
            .catch(error => {
            console.log(error);
            });;


            erreurs.text(""); // Vider les erreurs
            $("#ajouter-participants").val(""); // Effacer le champ d'ajout de participant
        }

        else {
            $("#messages-erreur-participants-groupe").text(participant + " ne correspond pas à une adresse valide");

        }
                    
    });
  });


    // Fonction pour valider le format d'une adresse e-mail
    function validerAdresse(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});