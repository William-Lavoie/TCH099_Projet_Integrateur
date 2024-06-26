//declaration des path dynamic
const pathDynamic = window.location.origin;
/*
 * Basculer la barre latérale (groupes)
 */

    let btnPliable = document.getElementById("basculer")

    btnPliable.addEventListener("click", function () {

    let groupes = document.getElementById("conteneur-groupes");
    let btnBasculer = document.getElementById("conteneur-basculer");
    let reunions = document.getElementById("conteneur-reunions");

    let estBascule = groupes.classList.toggle("bascule");

    if (!estBascule) {
        // Fermer la barre latérale contenant les groupes
        btnBasculer.classList.remove("bascule");
        groupes.classList.remove("bascule");
        reunions.classList.remove("bascule");
        document.getElementById("basculer").innerText = "⪓";
    } else {
        // Ouvrir la barre latérale contenant les groupes
        btnBasculer.classList.add("bascule");
        groupes.classList.add("bascule");
        reunions.classList.add("bascule");
        document.getElementById("basculer").innerText = "⪔";
    }
});

document.addEventListener("DOMContentLoaded", function () {
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
        dateFormatte += String(date.getMonth() + 1).padStart(2, "0") + "-";

        // Ajouter la date
        dateFormatte += String(date.getDate()).padStart(2, "0");

        return dateFormatte;
    }

    /*
     * Affiche les réunions spécifiques à un groupe
     */

    function afficherReunionsGroupe(groupe) {
        $("#conteneur-reunions-prochaines").html("");
        $("#conteneur-reunions-passees").html("");

        let donnees = { idGroupe: groupe };
        // Afficher les réunions pour un groupe
        fetch(
            pathDynamic +
                "/calendrier/api/api_calendrier.php/obtenir_reunions_groupes",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("error");
                }
            })
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    let nouvelleReunion = $(
                        "<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +
                            data[i]["titre"] +
                            "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" +
                            data[i]["description"] +
                            "</div></div></div>"
                    );
                    if (data[i]["date"] >= formatterDate(new Date())) {
                        $("#conteneur-reunions-prochaines").append(nouvelleReunion);
                    } else {
                        $("#conteneur-reunions-passees").append(nouvelleReunion);
                    }
                    // Ouvrir la réunion quand l'utilisateur clique dessus
                    nouvelleReunion.on("click", function () {
                        let idReunion = data[i]["id_reunions"];
                        window.location.href =
                            "../../réunions/réunions.html?info=" +
                            encodeURIComponent(idReunion);
                    });
                }
            })
            .catch((error) => {});
    }

    //Courriel de l'utilisateur
    let courrielCourant;

    afficherReunion();

    function afficherReunion() {
        $("#conteneur-reunions-prochaines").html("");
        $("#conteneur-reunions-passees").html("");

        // Afficher les réunions
        fetch(
            pathDynamic +
                "/calendrier/api/api_calendrier.php/obtenir_reunions_utilisateur",
            {}
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("error");
                }
            })
            .then((data) => {
                for (let i = 0; i < data.length; i++) {
                    let nouvelleReunion = $(
                        "<div class='conteneur-reunion'><div class='reunion-entete'><p class='reunion-titre'>" +
                            data[i]["titre"] +
                            "</p> <p class='reunion-reglage'>⚙</p></div><div class='reunion-description'>" +
                            data[i]["description"] +
                            "</div></div></div>"
                    );

                    const currentDate = new Date();
                    const currentTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
                
                    const reunionDate = new Date(data[i]["date"] + "T" + data[i]["heure_fin"]);
                
                    if (reunionDate > currentDate || (reunionDate.toDateString() === currentDate.toDateString() && data[i]["heure_fin"] > currentTime)) {
                        $("#conteneur-reunions-prochaines").append(nouvelleReunion);
                    } else {
                        $("#conteneur-reunions-passees").append(nouvelleReunion);
                    }


                    // Ouvrir la réunion quand l'utilisateur clique dessus
                    nouvelleReunion.on("click", function () {
                        let idReunion = data[i]["id_reunions"];
                        window.location.href =
                            "../../réunions/réunions.html?info=" +
                            encodeURIComponent(idReunion);
                    });
                }
            })
            .catch((error) => {});
    }

    // Récupérer le courriel de l'utilisateur courant
    fetch(
        pathDynamic + "/calendrier/api/api_calendrier.php/chercher-courriel",
        {}
    )
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((reponse) => {
            courrielCourant = reponse;
        })
        .catch((error) => {
            console.log(error);
        });

    // Afficher la liste des groupes
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_groupes", {})
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("error");
            }
        })
        .then((data) => {
            const groupesTable = $("#table-groupes");

            for (let i = 0; i < data.length; i++) {
                const nouveauGroupe = $("<button class='groupe'>").text(data[i]["nom"]);
                const nouvelleCellule = $("<td class='cellule-groupe'>").append(
                    nouveauGroupe
                );

                // Ajouter le bouton de modification et de supression du groupe si l'utilisateur en est le créateur
                if (courrielCourant == data[i]["courriel_enseignant"]) {
                    // Bouton pour modifier
                    let boutonModifier = $("<button class='modifier-groupe'>✎</button>");
                    nouvelleCellule.append(boutonModifier);

                    // Écouter d'évènement pour modifier le groupe
                    boutonModifier.on("click", function () {
                        console.log("ok");
                        modifierGroupe(data[i]);
                    });

                    // Bouton pour supprimer
                    let boutonSupprimer = $("<button class='modifier-groupe'>🗑</button>");
                    nouvelleCellule.append(boutonSupprimer);

                    // Écouter d'évènement pour modifier le groupe
                    boutonSupprimer.on("click", function () {
                        console.log(data[i]["id_groupes"]);
                        if (
                            confirm(
                                "La supression d'un groupe est permanente, êtes-vous sûr de vouloir procéder?"
                            )
                        ) {
                            supprimerGroupe(data[i]["id_groupes"]);
                        }
                    });
                }

                //Ajouter le groupe à la tabke
                groupesTable.find("tr").last().after($("<tr>").append(nouvelleCellule));

                nouveauGroupe.on("click", function (event) {
                    event.preventDefault();

                     // Si le groupe est déjà sélectionné, affiche toutes les réunions
                    if ($(this).hasClass("groupe-choisi")) {
                        afficherReunion();
                        $("button, td").removeClass("groupe-choisi");
                    }

                    // Afficher uniquement les réunions du groupe choisi
                    else {
                        // Sélectionner les éléments de la cellule sélectionnée
                        var elementsCellule = $(this).closest(".cellule-groupe");

                        $("td, button").removeClass("groupe-choisi");
                        $(this).parent().addClass("groupe-choisi");
                        $(this).addClass("groupe-choisi");
                        elementsCellule.find(".modifier-groupe").addClass("groupe-choisi");
                        afficherReunionsGroupe(data[i]["id_groupes"]);
                    }
                });
            }
        })
        .catch((error) => {
            console.log("erreur");
        });

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
    let groupeEstModifie = false;
    let id_groupe;

    /**    Vérifie si le courriel passé en paramètre a été ajouté à la liste
     *        des participants dans le formulaire de création d'un groupe
     */
    function courrrielPresent(courriel) {
        //Liste des participants entrés par l'utilisateur
        const listeParticipants = $("#liste-participants-groupe p");

        // Compare chaque courriel dans la liste au nouveau courriel ajouté
        for (let i = 0; i < listeParticipants.length; i++) {
            if (listeParticipants[i].innerText === courriel) {
                return true;
            }
        }

        return false;
    }

    // Affiche le bouton de création d'un nouveau groupe uniquement si l'utilisateur est
    // un enseignant
    fetch(pathDynamic + "/calendrier/api/api_calendrier.php/afficher_type", {})
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("error");
            }
        })
        .then((data) => {
            if (data["type"] === "enseignant") {
                $("#table-creer-groupe").css({ display: "block" });
            }
        })
        .catch((error) => {
            console.log("erreur");
        });

    // Afficher le formulaire pour créer un groupe
    btnCreerGroupe.click(function () {
        formulaireGroupe.css("visibility", "visible");
        $("#creer-groupe-header").text("Créer groupe");

        groupeEstModifie = false;
    });

    // Valider les champs avant de procéder avec le bouton "Confirmer"
    btnConfirmer.click(function (event) {
        event.preventDefault(); // Prévient le reload (Besoin API)

        // Conserver les informations des champs
        const nomGroupe = $("#nom-groupe").val().trim();

        // Ajouter les noms des participants au tableau
        for (
            let i = 0;
            i < $("#liste-participants-groupe").children().length;
            i++
        ) {
            tableauParticipants.push(
                $("#liste-participants-groupe").children().eq(i).find("p").text()
            );
        }

        // Vérifier si le champ nom du groupe est valide
        if (nomGroupe == "") {
            erreurs.text("Vous devez choisir un nom.");
        } else if (tableauParticipants.length < 1) {
            erreurs.text("Il doit y avoir au moins un participant.");
        } else {
            erreurs.text(""); // Vider les erreurs

            if (groupeEstModifie == false) {
                // Si tous les champs sont valides, procéder à la soumission du formulaire
                const donnees = { nom: nomGroupe, participants: tableauParticipants };

                fetch(
                    pathDynamic + "/calendrier/api/api_calendrier.php/ajouter_groupe",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(donnees),
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            throw new Error("La création de la réunion n'a pas fonctionnée");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (groupeEstModifie == true) {
                // Si tous les champs sont valides, procéder à la soumission du formulaire
                const donnees = {
                    nom: nomGroupe,
                    participants: tableauParticipants,
                    idGroupe: id_groupe,
                };

                fetch(
                    pathDynamic + "/calendrier/api/api_calendrier.php/modifier_groupe",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(donnees),
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            throw new Error("La création de la réunion n'a pas fonctionnée");
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            // Cacher le formulaire (fin)
            formulaireGroupe.css("visibility", "hidden");

            // Réinitialiser les champs du formulaire
            $("#nom-groupe").val("");
            listeParticipants.text("");
            erreurs.text("");
        }
    });

    // Fermer le formulaire de création de groupe
    // Par le bouton retour
    btnRetour.click(function () {
        $("#nom-groupe").val("");
        $("#liste-participants-groupe").html("");
        formulaireGroupe.css("visibility", "hidden");
    });

    // Par l'arrière plan
    formulaireGroupe.click(function (event) {
        if (event.target === this) {
            formulaireGroupe.css("visibility", "hidden");
            $("#nom-groupe").val("");
            $("#liste-participants-groupe").html("");
        }
    });

    // Ajouter un participant
    btnAjouterParticipant.click(function (event) {
        event.preventDefault();

        const participant = $("#nouveau-participant-groupe").val().trim();

        const nouveauParticipant = $(
            "<div class='nom-participant-groupe'> <p></p> </div> "
        );
        const boutonSupprimer = $(
            "<button class='supprimer-participant-groupe'>🗑</button>"
        );

        // Le créateur ne peut pas s'ajouter lui-même car il en fait parti par défaut
        fetch(
            pathDynamic + "/calendrier/api/api_calendrier.php/chercher-courriel",
            {}
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                }
            })
            .then((reponse) => {
                if (participant === "") {
                    erreurs.text("Veuillez saisir une adresse courriel.");
                } else if (tableauParticipants.includes(participant)) {
                    erreurs.text("Le participant est déjà dans la liste.");
                } else if (participant == reponse) {
                    $("#messages-erreur-participants-groupe").text(
                        "Vous n'avez pas besoin de vous ajouter au groupe."
                    );
                }

                // Le courriel du participant doit être valide
                else if (validerAdresse(participant)) {
                    // Le participant doit avoir un compte dans la base de données
                    const courriel = { courriel: participant };

                    // Cherche le participant dans la table des utilisateurs de la base de données
                    fetch(
                        pathDynamic +
                            "/calendrier/api/api_calendrier.php/chercher_participants",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(courriel),
                        }
                    )
                        .then((response) => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                console.log("La requête n'a pas fonctionnée");
                            }
                        })
                        .then((data) => {
                            // Un utilisateur a été trouvé
                            if (data["existe"]) {
                                if (courrrielPresent(participant)) {
                                    $("#messages-erreur-participants-groupe").text(
                                        participant + " est déjà présent"
                                    );
                                } else {
                                    // Le participant est ajouté à la liste
                                    $("#nouveau-participant-groupe").val("");

                                    // Bouton pour supprimer le participant
                                    boutonSupprimer.on("click", function (event) {
                                        event.stopPropagation();
                                        nouveauParticipant.remove();
                                    });

                                    // Création du participant dans le formulaire
                                    nouveauParticipant.children("p").text(participant);
                                    nouveauParticipant.append(boutonSupprimer);
                                    $("#liste-participants-groupe").append(nouveauParticipant);
                                }
                            } else {
                                $("#messages-erreur-participants-groupe").text(
                                    participant + " ne correspond pas à un compte HuddleHarbor"
                                );
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    erreurs.text(""); // Vider les erreurs
                    $("#ajouter-participants").val(""); // Effacer le champ d'ajout de participant
                } else {
                    $("#messages-erreur-participants-groupe").text(
                        participant + " ne correspond pas à une adresse valide"
                    );
                }
            });
    });

    // Fonction pour valider le format d'une adresse e-mail
    function validerAdresse(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * MODIFIER_GROUPE
     * Permet à un enseignant de modifier le nom et/ou les participants d'un de ses groupes
     * @param {array} groupe
     */
    function modifierGroupe(groupe) {
        formulaireGroupe.css("visibility", "visible");

        $("#creer-groupe-header").text("Modifier groupe");
        // Remplir les champs
        $("#nom-groupe").val(groupe["nom"]);

        $("#liste-participants-groupe").html("");

        groupeEstModifie = true;
        id_groupe = groupe["id_groupes"];

        // Remplir la liste des participants
        let donnees = { idGroupes: groupe["id_groupes"] };

        // Chercher les membres du groupe
        fetch(
            pathDynamic +
                "/calendrier/api/api_calendrier.php/chercher-membres-groupe",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("La requête n'a pas fonctionnée");
                }
            })
            .then((data) => {
                console.log(data[0]);
                // Ajouter les participants
                for (let i = 0; i < data.length; i++) {
                    const nouveauParticipant = $(
                        "<div class='nom-participant-groupe'> <p></p> </div> "
                    );
                    const boutonSupprimer = $(
                        "<button class='supprimer-participant-groupe'>🗑</button>"
                    );

                    // Le participant est ajouté à la liste
                    $("#nouveau-participant-groupe").val("");

                    // Bouton pour supprimer le participant
                    boutonSupprimer.on("click", function (event) {
                        event.stopPropagation();
                        nouveauParticipant.remove();
                    });

                    // Création du participant dans le formulaire
                    nouveauParticipant.children("p").text(data[i]["courriel_etudiants"]);
                    nouveauParticipant.append(boutonSupprimer);
                    $("#liste-participants-groupe").append(nouveauParticipant);
                }

                // Modifier le groupe
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * SUPPRIMER_GROUPE
     * Permet au créateur d'un groupe de la supprimer. Les réunions passées restent et celles
     * à venir sont également supprimées.
     * @param {int} groupe: id du groupe à supprimer
     */
    function supprimerGroupe(groupe) {
        donnees = { idGroupe: groupe };
        fetch(pathDynamic + "/calendrier/api/api_calendrier.php/supprimer_groupe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donnees),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("error");
                }
            })
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }
});
