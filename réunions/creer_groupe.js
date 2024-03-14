$(document).ready(function() {
    // Sélectionner les éléments nécessaires à l'ouverture du formulaire
    const btnCreerGroupe = $("#creer_groupe");
    const formulaireCreerGroupe = $("#conteneur-creer-groupe");
    const btnRetour = $("#retour-creer-groupe");
    const btnConfirmer = $("#confirmer-creer-groupe");
    const btnAjouterParticipant = $("#ajouter-participant");
    const listeParticipants = $("#liste-participants");
    const erreurs = $("#erreurs-creer-groupe");
    const groupesTable = $("#groupes");

    // Ouvrir le formulaire qui crée un groupe
    btnCreerGroupe.click(function() {
        formulaireCreerGroupe.css("visibility", "visible");
    });

    // Fermer le formulaire qui crée un groupe
    btnRetour.click(function() {
        formulaireCreerGroupe.css("visibility", "hidden");
    });

    // Ajouter un participant
    btnAjouterParticipant.click(function(event) {
        event.preventDefault();

        const participant = $("#ajouter-participants").val().trim();
        
        // Vérifier si le champ participant est valide
        if (participant === "") { // Si vide
            erreurs.text("Veuillez saisir une adresse e-mail.");
            return false;
        } else if (!validerAdresse(participant)) {
            erreurs.text("L'adresse e-mail est invalide.");
            return false;
        } else {
            // Vérifier s'il y a déjà des participants
            if (listeParticipants.text() === "") {
                listeParticipants.text(participant);
            } else {
                // Ajouter le participant à la liste en séparant par une virgule et un espace
                listeParticipants.text(listeParticipants.text() + ", " + participant);
            }
            
            erreurs.text(""); // Vider les erreurs
            $("#ajouter-participants").val(""); // Effacer le champ d'ajout de participant
        }
    });

    // Valider les champs avant de procéder avec le bouton "Confirmer"
    btnConfirmer.click(function(event) {
        event.preventDefault(); // Prévient le reload (Besoin API)

        // Conserver les informations des champs
        const nomGroupe = $("#nom-groupe").val().trim();
        const description = $("#description").val().trim();
        const participantsText = listeParticipants.text().trim(); // Obtenir le texte au complèt
        const nbParticipants = participantsText ? participantsText.split(", ").length : 0; // Nombre de participants
        // Vérifier si le champ nom du groupe est valide
        if (nomGroupe.length < 1) {
            erreurs.text("Le nom du groupe doit contenir au moins un caractère.");
            return false; // Ne plus continuer le code
        } else {
            erreurs.text(""); // Vider les erreurs
        }

        // Vérifier si le champ des participants est valide
        if (nbParticipants < 1) {
            erreurs.text("Il doit y avoir au moins un participant.");
            return false;
        } else {
            erreurs.text(""); // Vider les erreurs
        }

        // Vérifier si la description est valide
        if (description.length < 1) {
            erreurs.text("Il doit y avoir une description.");
            return false;
        } else if (description.length < 10) {
            erreurs.text("Votre description est trop courte.");
            return false;
        } else {
            erreurs.text(""); // Vider les erreurs
        }

        // Si tous les champs sont valides, procéder à la soumission du formulaire

        /* TODO

        const donnees = {"nom": nomGroupe,
                        "description": description,
                        "participants": participantsText};

        console.log(donnees);

        fetch("http://localhost:3333/réunions/reunions.php", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(donnees)
        })
        .then(response => {

        console.log(response);
        if (response.ok) {

        // Fermer les formulaires
        fermerFormulaires();
        window.location.reload();
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

        */

        // Ajouter le nouveau groupe à la liste des groupes dans la sidebar
        const nouveauGroupe = $("<button>").text(nomGroupe); // Changer le nom
        const nouvelleCellule = $("<td>").append(nouveauGroupe);
        groupesTable.find("tr").last().after($("<tr>").append(nouvelleCellule));

        // Cacher le formulaire (fin)
        formulaireCreerGroupe.css("visibility", "hidden");

        // Réinitialiser les champs du formulaire
        $("#nom-groupe").val('');
        $("#description").val('');
        listeParticipants.text('');
        erreurs.text('');
    });

    // Fonction pour valider le format d'une adresse e-mail
    function validerAdresse(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
