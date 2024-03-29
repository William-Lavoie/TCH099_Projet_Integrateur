$(document).ready(function () {
    //declaration des path dynamic
    const pathDynamic = window.location.origin;

    // Sélectionner les éléments nécessaires à l'ouverture du formulaire
    const btnCreerGroupe = $("#creer_groupe");
    const formulaireCreerGroupe = $("#conteneur-creer-groupe");
    const btnRetour = $("#retour-creer-groupe");
    const btnConfirmer = $("#confirmer-creer-groupe");
    const btnAjouterParticipant = $("#ajouter-participant");
    const listeParticipants = $("#liste-participants");
    const erreurs = $("#erreurs-creer-groupe");
    const groupesTable = $("#groupes");

    let tableauParticipants = [];

    /**
     * Affiche les groupes dans le "aside"
     */
    function afficherGroupes() {
        fetch(
            pathDynamic + "/calendrier/api/api_calendrier.php/afficher_groupes",
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
                // Ajouter les groupes à la liste des groupes dans la sidebar

                for (let i = 0; i < data.length; i++) {
                    const nouveauGroupe = $("<button class='groupe'>").text(
                        data[i]["nom"]
                    ); // Changer le nom
                    const nouvelleCellule = $("<td>").append(nouveauGroupe);
                    groupesTable
                        .find("tr")
                        .last()
                        .after($("<tr>").append(nouvelleCellule));

                    nouveauGroupe.on("click", function (event) {
                        event.preventDefault();
                        $("button").removeClass("groupe-choisi");
                        $(this).addClass("groupe-choisi");
                        afficherReunionsGroupe(data[i]["id_groupes"]);
                    });
                }
            })
            .catch((error) => {
                console.log("erreur");
            });
    }

    /**
     * Affiche les réunions spécifiques à un groupe
     */
    function afficherReunionsGroupe(groupe) {
        $("#conteneur_reunions").html("");

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
                    $("#conteneur_reunions").append(
                        "<div class='conteneur-reunion'><div class='reunion_header'><div id='titre_reunion'>" +
                            data[i]["titre"] +
                            "</div> <button id='reglage_reunion'>⚙</button></div><div id='description_reunion'>" +
                            data[i]["description"] +
                            "</div></div></div>"
                    );
                }
            })
            .catch((error) => {});
    }

    afficherGroupes();

    // Ouvrir le formulaire qui crée un groupe
    btnCreerGroupe.click(function () {
        formulaireCreerGroupe.css("visibility", "visible");
    });

    // Fermer le formulaire qui crée un groupe
    btnRetour.click(function () {
        formulaireCreerGroupe.css("visibility", "hidden");
    });

    // Ajouter un participant
    btnAjouterParticipant.click(function (event) {
        event.preventDefault();

        const participant = $("#ajouter-participants").val().trim();

        // Vérifier si le champ participant est valide
        if (participant === "") {
            // Si vide
            erreurs.text("Veuillez saisir une adresse e-mail.");
            return false;
        } else if (!validerAdresse(participant)) {
            erreurs.text("L'adresse e-mail est invalide.");
            return false;
        } else if (tableauParticipants.includes(participant)) {
            erreurs.text("Le participant est déjà dans la liste.");
            return false;
        } else {
            // Vérifier s'il y a déjà des participants
            if (listeParticipants.text() === "") {
                listeParticipants.text(participant);

                // Ajouter à la liste des participants
                tableauParticipants.push(participant);
            } else {
                // Ajouter le participant à la liste en séparant par une virgule et un espace
                listeParticipants.text(listeParticipants.text() + ", " + participant);

                // Ajouter à la liste des participants
                tableauParticipants.push(participant);
            }

            erreurs.text(""); // Vider les erreurs
            $("#ajouter-participants").val(""); // Effacer le champ d'ajout de participant
        }
    });

    // Valider les champs avant de procéder avec le bouton "Confirmer"
    btnConfirmer.click(function (event) {
        event.preventDefault(); // Prévient le reload (Besoin API)

        // Ajouter les participants dans un tableau
        for (
            let i = 0;
            i < $("#liste-participants-groupe").children().length;
            i++
        ) {
            tableauParticipants.push(
                $("#liste-participants-groupe").children().eq(i).find("p").text()
            );
        }

        // Conserver les informations des champs
        const nomGroupe = $("#nom-groupe").val().trim();

        // Vérifier si le champ nom du groupe est valide
        if (nomGroupe.length < 1) {
            erreurs.text("Le groupe doit avoir un nom.");
        }

        // Vérifier si le champ des participants est valide
        else if (tableauParticipants.length < 1) {
            erreurs.text("Il doit y avoir au moins un participant.");
        } else {
            erreurs.text(""); // Vider les erreurs

            // Si tous les champs sont valides, procéder à la soumission du formulaire
            const donnees = { nom: nomGroupe, participants: tableauParticipants };

            fetch(pathDynamic + "/calendrier/api/api_calendrier.php/ajouter_groupe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees),
            })
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

            // Cacher le formulaire (fin)
            formulaireCreerGroupe.css("visibility", "hidden");

            // Réinitialiser les champs du formulaire
            $("#nom-groupe").val("");
            $("#description").val("");
            listeParticipants.text("");
            erreurs.text("");
        }
    });

    // Fonction pour valider le format d'une adresse e-mail
    function validerAdresse(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
