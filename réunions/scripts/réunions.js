//************************************** */
// Fonction pour aside pliable gauche
//************************************** */

// identifiant de la réunion
var idReunion;
var totalCheckboxesChecked = 0; // Variable pour suivre le nombre total de cases cochées.
const pathDynamic = window.location.origin;

document.addEventListener("DOMContentLoaded", function () {
    //declaration des path dynamic

    // Chercher l'identifiant de la réunion lorsque l'utilisateur arrive sur cette page
    const pageAppelante = window.location.search;
    const parametre = new URLSearchParams(pageAppelante);
    idReunion = parametre.get("info");

    // Afficher la liste des messages
    let donnees = { idReunion: idReunion };

    // Afficher les réunions pour un groupe
    fetch(
        pathDynamic + "/calendrier/api/api_calendrier.php/obtenir-messages-reunion",
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
                let message = $(
                    "<div id='message-publique'><div id='utilisateur-photo'></div><div id='utilisateur-nom-contenu'><div id='nom-utilisateur'>" +
                        data[i]["nom"] +
                        "</div><div id='contenu-message'>" +
                        data[i]["contenu"] +
                        "</div></div><div id='heure-message'>" +
                        data[i]["heure"] +
                        "</div></div>"
                );

                donnees = { courriel: data[i]["auteur"] };

                // Mettre la photo de profil de l'utilisateur
                fetch(
                    pathDynamic +
                        "/calendrier/api/api_calendrier.php/obtenir-photo-profil",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(donnees),
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            return response.blob();
                        } else {
                            console.log("error");
                        }
                    })
                    .then((photo) => {
                        const img = document.createElement("img");

                        if (photo != undefined && photo != null) {
                            message.children("#utilisateur-photo").css({
                                "background-image": "url(" + URL.createObjectURL(photo) + ")",
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("Erreur");
                    });

                // Vérifier si le message a été écrit par l'utilisateur connecté
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
                        console.log(reponse);

                        if (reponse == data[i]["auteur"]) {
                            // Ajouter des boutons pour supprimer ou modifier un message
                            const boutonSupprimer = $(
                                "<button id='supprimer-message'>🗑</button>"
                            );
                            const boutonModifier = $(
                                "<button id='modifier-message'>⚙</button>"
                            );
                            message.children("#heure-message").append(boutonSupprimer);
                            message.children("#heure-message").append(boutonModifier);

                            boutonSupprimer.on("click", function () {
                                supprimerMessage(data[i]["id_message"]);
                            });

                            boutonModifier.on("click", function () {
                                modifierMessage(
                                    data[i]["id_message"],
                                    data[i]["contenu"],
                                    message
                                );
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                console.log(message);
                $("#notes-publiques").append(message);
                $("#notes-publiques").scrollTop($("#notes-publiques")[0].scrollHeight);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    /**
     * Supprime le message choisi par l'utilisateur. Ceci est uniquement
     * possible si le message a été écrit par l'utilisateur
     * @param {int} id_message
     */
    function supprimerMessage(id_message) {
        let donnees = { id_message: id_message };

        //Supprimer le message avec identifiant id_message
        fetch(
            pathDynamic + "/calendrier/api/api_calendrier.php/supprimer-message",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees),
            }
        ).then((response) => {
            if (response.ok) {
                console.log("ok");
                window.location.reload();
            } else {
                console.log("error");
            }
        });
    }

    /**
     * Permet à l'utilisateur de modifier ses messages
     */
    function modifierMessage(id_message, contenu, message) {
        console.log("test");
        let textarea = $(
            "<textarea maxlength='500' id='modifier-message-textarea'></textarea>"
        );
        textarea.val(contenu);
        message.find("#contenu-message").replaceWith(textarea);

        let boutonRetour = $("<button id='btn-retour-message'>Retour</button>");
        message.find("#supprimer-message").replaceWith(boutonRetour);

        let boutonConfirmer = $(
            "<button id='btn-confirmer-modification'>Ok</button>"
        );
        message.find("#modifier-message").replaceWith(boutonConfirmer);

        // Retour en arrière
        boutonRetour.on("click", function () {
            window.location.reload();
        });

        // Modifier le message
        boutonConfirmer.on("click", function () {
            let texte = textarea.val();

            if (texte != "") {
                let donnees = { contenu: texte, idMessage: id_message };

                fetch(
                    pathDynamic + "/calendrier/api/api_calendrier.php/modifier-message",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(donnees),
                    }
                ).then((response) => {
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        console.log("error");
                    }
                });
            }
        });
    }

    /**
     * Créer un nouveau message
     */
    $("#nouveau-message").on("keydown", function (event) {
        //event.preventDefault();

        console.log(event.key);
        // Si la touche 'Enter' est appuyée
        if (event.key === "Enter") {
            let texte = $("#nouveau-message").val();

            event.preventDefault();

            if (texte != "") {
                let donnees = { contenu: texte, idReunion: idReunion };

                fetch(
                    pathDynamic +
                        "/calendrier/api/api_calendrier.php/ajouter-nouveau-message",
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
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    });

    // Créer une nouvelle tâche
    $("#ajouter-tache").on("click", function () {
        let texte = $("#titre-nouvelle-tache").val();

        if (texte != null && texte != "") {
            let donnees = { titre: texte, idReunion: idReunion };

            fetch(
                pathDynamic +
                    "/calendrier/api/api_calendrier.php/ajouter-nouvelle-tache",
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
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    });

    // Sélectionner les éléments nécessaires pour la transition
    let btnPliableGauche = document.querySelector("#BtnPliableGauche");

    let asidePresence = document.querySelector("#presence");
    let content = document.querySelector("#main_aside");
    let classBtnPliableGauche = document.querySelector(".BtnPliableGauche");

    btnPliableGauche.addEventListener("click", function () {
        // État de la barre
        let isCollapsed = asidePresence.classList.toggle("collapsed");

        // Changer la barre par rapport à son état
        if (isCollapsed) {
            classBtnPliableGauche.classList.add("collapsed");
            content.classList.add("collapsed");
        } else {
            classBtnPliableGauche.classList.remove("collapsed");
            content.classList.remove("collapsed");
        }
    });

    // Au survol de la souris, changer la couleur du bouton
    btnPliableGauche.addEventListener("mouseenter", function () {
        btnPliableGauche.style.color = "#a5a5a5";
    });

    // Lorsque la souris quitte, restaurer la couleur par défaut du bouton
    btnPliableGauche.addEventListener("mouseleave", function () {
        btnPliableGauche.style.color = ""; // Revenir à la couleur par défaut
    });
});

//*********************************** */
// Fonction pour aside pliable droite
//*********************************** */
document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner les éléments nécessaires pour la transition
    let btnPliableDroite = document.querySelector("#BtnPliableDroite");

    let asideTodo = document.querySelector("#to_do");
    let content = document.querySelector("#main_aside");
    let classBtnPliableDroite = document.querySelector(".BtnPliableDroite");

    btnPliableDroite.addEventListener("click", function () {
        // État de la barre
        let isCollapsed = asideTodo.classList.toggle("collapsed");

        // Changer la barre par rapport à son état
        if (isCollapsed) {
            classBtnPliableDroite.classList.add("collapsed");
            content.classList.add("collapsed");
        } else {
            classBtnPliableDroite.classList.remove("collapsed");
            content.classList.remove("collapsed");
        }
    });

    // Au survol de la souris, changer la couleur du bouton
    btnPliableDroite.addEventListener("mouseenter", function () {
        btnPliableDroite.style.color = "#a5a5a5";
    });

    // Lorsque la souris quitte, restaurer la couleur par défaut du bouton
    btnPliableDroite.addEventListener("mouseleave", function () {
        btnPliableDroite.style.color = ""; // Revenir à la couleur par défaut
    });
});

//************************** */
//slider de satisfaction
//************************** */
function updateSliderValue() {
    let satisfaction = document.getElementById("satisfaction");
    let valeurSatisfaction = document.getElementById("valeurSatisfaction");
    valeurSatisfaction.innerText = satisfaction.value;
}

//************************* */
//ajouter noms dans la table des presence
//************************* */
document.addEventListener("DOMContentLoaded", function () {
    // Chercher la liste des participants
    donnees = { 'idReunions': idReunion };
    fetch(
        pathDynamic +
            "/calendrier/api/api_calendrier.php/chercher_presences_reunions",
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
            /* Vérifier que la réunion est en cours
                        if (data['date'] != new Date() || ) {
                                $("input").prop("disabled", true);

                        }*/

            let nbNomAAjouter = data.length;

            for (let i = 0; i < nbNomAAjouter; i++) {
                addRowsToContainer(data[i]["nom"], data[i]['presence'], data[i]['courriel_utilisateurs']);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    function addRowsToContainer(nom, present, courriel) {
        var container = document.getElementById("presence_conteneur");

        var rowDiv = document.createElement("div");
        rowDiv.classList.add("hide-text", "boite_nom_presence");

        // Name
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("nomPresence");
        nameDiv.textContent = nom;
        rowDiv.appendChild(nameDiv);

        // Form
        var form = document.createElement("form");
        form.classList.add("presence_form");

        // Checkbox
        var label = document.createElement("label");
        label.classList.add("switch_presence");
        var input = document.createElement("input");
        input.setAttribute("type", "checkbox");

        // L'identifiant incrémente avec le nombre de participants
        input.id = document
            .getElementById("presence_conteneur")
            .getElementsByTagName("input").length;

        input.classList.add("Present");
        input.setAttribute("name", "Presence");
        var span = document.createElement("span");
        span.classList.add("slider", "round");
        label.appendChild(input);
        label.appendChild(span);
        form.appendChild(label);

        rowDiv.appendChild(form);

        container.appendChild(rowDiv);

        if (present == 1) {
            input.checked = true;
            nameDiv.style.color = "green";
        } else if (present == 0) {
            input.checked = false;
            nameDiv.style.color = "red";
        }

        //************************* */
        //changer la couleur des nom quand un checkbox est cheked
        //************************* */
        input.addEventListener("change", function () {
            let etat;
            var nameElement = this.parentElement.parentElement.previousElementSibling;
            if (this.checked) {
                nameElement.style.color = "green";
                etat = 1;
            } else {
                nameElement.style.color = "red"; // Réinitialiser en rouge lorsque l'utilisateur désactive le basculement.
                etat = 0;
            }


            // Modifier l'état de la tâche
            donnees = { 'courriel': courriel, 'etat': etat, 'idReunion': idReunion };
            fetch(pathDynamic + "/calendrier/api/api_calendrier.php/modifier_presence", {
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
                    console.log("Succès");
                })
                .catch((error) => {
                    console.log(error);
                });

        });
    }

    // pas d'abscence toggle tous les checkbox
    const mainCheckbox = document.getElementById("switch_pas_dabscence");
    mainCheckbox.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(
            '.boite_nom_presence input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = mainCheckbox.checked;
            checkbox.dispatchEvent(new Event("change"));
        });
    });
});

//************************* */
//ajouter objectifs dans la tables d'objectif
//************************* */
document.addEventListener("DOMContentLoaded", function () {
    //**************************************** */
    // Update la bar de progression
    //**************************************** */
    function updateCompletion(checkedCount, totalCount) {
        var progressBar = document.getElementById("completion");
        var valueElement = document.getElementById("valeurCompletion");
        var completionPercentage = (checkedCount / totalCount) * 100;

        progressBar.value = completionPercentage;
        valueElement.textContent = completionPercentage.toFixed(2) + "%";
    }

    // Chercher la liste des tâches
    donnees = { idReunions: idReunion };
    fetch(
        pathDynamic + "/calendrier/api/api_calendrier.php/chercher_liste_taches",
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
            let nbObjectifAAjouter = data.length;

            for (let i = 0; i < nbObjectifAAjouter; i++) {
                addTasksToContainer(data[i]["titre"], data[i]["completee"]);
            }

            // Updater le compteur
            updateCompletion(
                totalCheckboxesChecked,
                document.getElementById("toDo_conteneur").getElementsByTagName("input")
                    .length
            );
        })
        .catch((error) => {
            console.log(error);
        });

    // slider completé change toute les slider
    const mainCheckbox = document.getElementById("switch_toDo_complete");
    mainCheckbox.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(
            '.boite_toDo input[type="checkbox"]'
        );
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = mainCheckbox.checked;
            checkbox.dispatchEvent(new Event("change"));
        });
    });

    function addTasksToContainer(titre, etat) {
        var container = document.getElementById("toDo_conteneur");

        // Créer un div pour chaque ligne.
        var rowDiv = document.createElement("div");
        rowDiv.classList.add("hide-text", "boite_toDo");

        // Form
        var form = document.createElement("form");
        form.classList.add("presence_toDo");

        // Checkbox
        var label = document.createElement("label");
        label.classList.add("switch_toDo");
        var input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.id = document
            .getElementById("toDo_conteneur")
            .getElementsByTagName("input").length;
        input.classList.add("Objectif");
        input.setAttribute("name", "Objectif");
        var span = document.createElement("span");
        span.classList.add("slider", "round");
        label.appendChild(input);
        label.appendChild(span);
        form.appendChild(label);

        rowDiv.appendChild(form);
        container.appendChild(rowDiv);

        // Objectif
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("nomObjectif");
        nameDiv.textContent = titre;
        rowDiv.appendChild(nameDiv);

        if (etat == 1) {
            input.checked = true;
            totalCheckboxesChecked++;
            nameDiv.style.color = "green";
        } else if (etat == 0) {
            input.checked = false;
            nameDiv.style.color = "red";
        }

        //************************* */
        //changer la couleur des nom et le compte des elements checked quand un checkbox est checked
        //************************* */

        input.addEventListener("change", function () {
            var nameElement = this.parentElement.parentElement.nextElementSibling;

            // Détermine si la tâche est complétée
            let etat;

            if (this.checked) {
                nameElement.style.color = "green";
                totalCheckboxesChecked++; // Incrémenter le nombre total de cases cochées.
                etat = 1; // true
            } else {
                nameElement.style.color = "red"; // Réinitialiser en rouge lorsque l'utilisateur désactive la bascule.
                totalCheckboxesChecked--; // Decrementer le nombre total de cases cochées.
                etat = 0; //false
            }

            // Modifier l'état de la tâche
            donnees = { 'titre': titre, 'etat': etat, 'idReunion': idReunion };
            fetch(pathDynamic + "/calendrier/api/api_calendrier.php/modifier_tache", {
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
                    console.log("Succès");
                })
                .catch((error) => {
                    console.log(error);
                });

            // Update completion bar
            updateCompletion(
                totalCheckboxesChecked,
                document.getElementById("toDo_conteneur").getElementsByTagName("input")
                    .length
            );
        });

        // Écouter les changements sur la case à cocher principale
        mainCheckbox.addEventListener("change", function () {
            if (this.checked) {
                totalCheckboxesChecked = document
                    .getElementById("toDo_conteneur")
                    .getElementsByTagName("input").length;
            } else {
                totalCheckboxesChecked = 0;
            }
            updateCompletion(
                totalCheckboxesChecked,
                document.getElementById("toDo_conteneur").getElementsByTagName("input")
                    .length
            );
        });
    }
});

//****************************** */
//timer
//******************************* */
document.addEventListener("DOMContentLoaded", function () {
    // Définir les dates et heures de début et de fin.
    let meetingStart;
    let meetingEnd; // Convertir en objet Date

    async function obtenirHeures() {
        // Chercher la liste des tâches
        donnees = { idReunions: idReunion };
        await fetch(
            pathDynamic +
                "/calendrier/api/api_calendrier.php/chercher_heures_reunions",
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
                // Séparer l'année, le mois et le jour
                let jourPartis = data[0]["date"].split("-");

                // Séparer les heures, les minutes et les secondes
                let heurePartis = data[0]["heure_debut"].split(":");

                // Début de la réunion
                meetingStart = new Date(
                    parseInt(jourPartis[0]),
                    parseInt(jourPartis[1]) - 1,
                    parseInt(jourPartis[2]),
                    parseInt(heurePartis[0]),
                    parseInt(heurePartis[1]),
                    parseInt(heurePartis[2])
                );

                // Séparer l'année, le mois et le jour
                let jourPartisFin = data[0]["date"].split("-");

                // Séparer les heures, les minutes et les secondes
                let heurePartisFin = data[0]["heure_fin"].split(":");

                // Si l'heure de fin précède l'heure de début c'est qu'en réalité
                // la réunion dépasse minuit
                if (heurePartisFin[0] < heurePartis[0]) {
                    console.log("oh");

                    meetingEnd = new Date(
                        parseInt(jourPartisFin[0]),
                        parseInt(jourPartisFin[1]) - 1,
                        parseInt(parseInt(jourPartisFin[2]) + 1),
                        parseInt(heurePartisFin[0]),
                        parseInt(heurePartisFin[1]),
                        parseInt(heurePartisFin[2])
                    );
                } else {
                    meetingEnd = new Date(
                        parseInt(jourPartisFin[0]),
                        parseInt(jourPartisFin[1]) - 1,
                        parseInt(jourPartisFin[2]),
                        parseInt(heurePartisFin[0]),
                        parseInt(heurePartisFin[1]),
                        parseInt(heurePartisFin[2])
                    );
                }
                console.log(meetingStart);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function ajouterTemps(minutes) {
        // Chercher la liste des tâches
        donnees = { idReunions: idReunion, minutes: minutes };

        fetch(pathDynamic + "/calendrier/api/api_calendrier.php/ajouter_temps", {
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
            .catch((error) => {
                console.log(error);
            });
    }

    (function () {
        obtenirHeures();

        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        let btnHorloge = document.getElementById("btn_horloge");
        let minutesAAjouter = parseInt(
            document.getElementById("minutesAAjouter").value
        );

        document
            .getElementById("minutesAAjouter")
            .addEventListener("change", function () {
                minutesAAjouter = parseInt(this.value);
            });

        btnHorloge.addEventListener("click", function () {
            meetingEnd.setTime(meetingEnd.getTime() + minutesAAjouter * 60000);

            // Mettre à jour l'affichage du compte à rebours immédiatement après l'ajout de minutes
            updateCountdown();

            // Modifier l'heure de fin dans la base de données
            ajouterTemps(minutesAAjouter);
        });

        const x = setInterval(updateCountdown, 1000); // Définir l'intervalle à 1000 millisecondes (1 seconde)

        function updateCountdown() {
            const now = new Date().getTime();

            // Compte à rebours jusqu'au début de la réunion, puis compte à rebours jusqu'à la fin de la réunion
            let distance;
            console.log(meetingStart.getTime());
            if (now < meetingStart.getTime()) {
                // Compte à rebours jusqu'au début de la réunion
                distance = meetingStart.getTime() - now;
            } else if (now > meetingEnd.getTime()) {
                // Si terminé, afficher 0
                distance = 0;

                donnees = { idReunion: idReunion};
                // Déterminer si les participants étaient présents ou non 
                fetch(pathDynamic + "/calendrier/api/api_calendrier.php/mettre_presences_a_jour", {
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
                    .catch((error) => {
                        console.log(error);
                    });


            } else {
                distance = meetingEnd.getTime() - now; // Compte à rebours jusqu'à la fin de la réunion
            }

            document.getElementById("days").innerText = Math.floor(distance / day);
            document.getElementById("hours").innerText = Math.floor(
                (distance % day) / hour
            );
            document.getElementById("minutes").innerText = Math.floor(
                (distance % hour) / minute
            );
            document.getElementById("seconds").innerText = Math.floor(
                (distance % minute) / second
            );

            let horloge = document.getElementById("horloge");
            // Fais quelque chose lorsque le temps est presque atteint.
            if (distance <= 600000 && distance > 0) {
                horloge.style.color = "red";
            }

            // Fais quelque chose lorsque le temps est atteint.
            if (distance <= 0) {
                horloge.style.color = "red";
                clearInterval(x);
            }
        }
    })();
});
