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

    let tableauParticipants = [];

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
        console.log(tableauParticipants);
        // Vérifier si le champ participant est valide
        if (participant === "") { // Si vide
            erreurs.text("Veuillez saisir une adresse e-mail.");
            return false;
        } else if (!validerAdresse(participant)) {
            erreurs.text("L'adresse e-mail est invalide.");
            return false;
        } 
          else if (tableauParticipants.includes(participant)) {
            erreurs.text("Le participant est déjà dans la liste.");
            return false;
        }  
        else {
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
    btnConfirmer.click(function(event) {
        event.preventDefault(); // Prévient le reload (Besoin API)

        // Conserver les informations des champs
        const nomGroupe = $("#nom-groupe").val().trim();
        const description = $("#description").val().trim();
        const participantsText = listeParticipants.text().trim(); // Obtenir le texte au complèt
        const nbParticipants = participantsText ? participantsText.split(", ").length : 0; // Nombre de participants

        console.log(nomGroupe.length);
        // Vérifier si le champ nom du groupe est valide
        if (nomGroupe.length < 1) {
            console.log("test");
            erreurs.text("Le nom du groupe doit contenir au moins un caractère.");
        } 

        // Vérifier si le champ des participants est valide
        else if (nbParticipants < 1) {
            erreurs.text("Il doit y avoir au moins un participant.");
        } 
        
        else {
            erreurs.text(""); // Vider les erreurs
        

        // Si tous les champs sont valides, procéder à la soumission du formulaire
        const donnees = {"nom": nomGroupe,
                        "participants": tableauParticipants};

        console.log(donnees);

        fetch("http://127.0.0.1:3000/calendrier/api/api_calendrier.php/ajouter_reunion", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(donnees)
        })
        .then(response => {

            console.log(response);
            if (response.ok) {

                //window.location.reload();
                console.log(response.json());
                return response.json();
            }

            else {
                console.log("error");
            }
        })
        .catch(error => {
            console.log(error);
        });


    

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
    }
    });

    // Fonction pour valider le format d'une adresse e-mail
    function validerAdresse(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
