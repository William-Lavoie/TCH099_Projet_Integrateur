document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    const rows = 20;
    const cols = 7;

   




    fetch("http://127.0.0.1:3000/profil_stats//api/profil.php/chercher_reunions_stats", {})
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

console.log(data[compteur]['date']);
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
                        cell.style.backgroundColor = "green";
                    }

                    else if (data[compteur]['presence'] == 0) {
                        cell.style.backgroundColor = "red";
                    }

                    compteur++;
                }

                // Afficher les semaines
                if (joursEcoules % 7 == 0) {
                    $("#semaines-grille").append("<div class='semaine'><p>" + formatterDate(jour) + "<p/></div>");
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
