document.addEventListener('DOMContentLoaded', function() {

    //declaration des variables pour un path dynamic
    let protocol =  window.location.protocol + "//";
    let location = window.location.hostname;
    let port = ":" + window.location.port;
    let pathDynamic;

    if (location === 'localhost' || location === '127.0.0.1'){
        pathDynamic = protocol + location + port;
    }else {
        pathDynamic = protocol + location;
    }
    
    const gridContainer = document.getElementById('grid-container');
    const rows = 20;
    const cols = 7;


/**
 * Transforme un mois sous forme d'entier entre 0 à 11 en String 
 */
    function formatterMois(mois) {
        switch (mois) {
            case 0:
                return "Janvier";
            case 1:
                return "Février";
            case 2:
                return "Mars";
            case 3:
                return "Avril";
            case 4:
                return "Mai";
            case 5:
                return "Juin";
            case 6:
                return "Juillet";
            case 7:
                return "Août";
            case 8:
                return "Septembre";
            case 9:
                return "Octobre";
            case 10:
                return "Novembre";
            case 11:
                return "Décembre";
            default:
                return null;
        }
    }



    fetch( pathDynamic + "/profil_stats//api/profil.php/chercher_reunions_stats", {})
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("error");
        }
    })
    .then(data => {
        
        // 139 jours avant le jour courant 
        let jour = new Date();
        jour.setDate(jour.getDate() -139);

        // Compteur des réunions
        let compteur = 0;

        // Compteur des jours écoulés
        let joursEcoules =0;

        // Compteur des semaines
        let semaines = 0;

        //Mois courant 
        let moisCourant;

        // Créer le tableau des présences
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {

                // Case pour la grille
                const cell = document.createElement('div');
                cell.classList.add('grid-item');

                console.log();

                // Tant que les réunions sont pour la même journée
                while (compteur < data.length && data[compteur]['date'] === formatterDate(jour)) {


                    if (data[compteur]['presence'] == 1) {

                        if (cell.style.backgroundColor == "red") {
                            cell.style.backgroundColor = "yellow";
                        }
                        
                        else if (cell.style.backgroundColor != "yellow") {
                            cell.style.backgroundColor = "green";
                        }
                    }

                    else if (data[compteur]['presence'] == 0) {

                        if (cell.style.backgroundColor == "green") {
                            cell.style.backgroundColor = "yellow";
                        }
                        
                        else if (cell.style.backgroundColor != "yellow") {
                            cell.style.backgroundColor = "red";
                        }

                    }

                    compteur++;
                }

                if (joursEcoules == 0) {
                    $("#semaines-grille").children().eq(0).text(formatterMois(jour.getMonth()));
                    moisCourant = jour.getMonth();
                }

                // Afficher les semaines
                else if (joursEcoules % 7 == 0) {
                    
                    semaines++;

                    if (moisCourant != jour.getMonth()) {

                        $("#semaines-grille").children().eq(semaines).text(formatterMois(jour.getMonth()));
                        moisCourant = jour.getMonth();
                    }
                }

              

                joursEcoules++;
                jour.setDate(jour.getDate()+1);
                gridContainer.appendChild(cell);

            }
        }
    })
    .catch(error => {});


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

});
