$(document).ready(function() {

  // Jour courant 
  const jourCourant = new Date()

  // Écrire la date 
  $("#journee-mois").text(jourCourant.toLocaleDateString("fr-FR") );


  /***  Peupler le calendrier ***/

  //Premier jour du mois courant
  const premierDuMois = new Date(jourCourant.getFullYear(), jourCourant.getMonth(), 1);
  const premierJour = premierDuMois.getDay();
console.log(premierDuMois.getMonth());
  // Remplir les derniers jours du mois passé 
  // TODO: Case where month is january (change year)
  const moisDernier = new Date(jourCourant.getFullYear(), premierDuMois.getMonth(), 0-premierJour+1);
  let debutCalendrier = moisDernier.getDate();
  console.log(moisDernier.getMonth());

  let i = 0;
  for (i; i < premierJour; i++) {
    const journee = $("<div class='jour'></div>");
    journee.text(debutCalendrier);
    journee.css("background-color", "lightgray");
    
    if (i == 0) {
        journee.css("border-top-left-radius", "1em");
    }

    $("#calendrier").append(journee);
    debutCalendrier++;
  }

  let index = 1;

  const moisProchainPremierJour = new Date(jourCourant.getFullYear(), jourCourant.getMonth()+1, 1);
  const finDuMois = (new Date(moisProchainPremierJour -1).getDate());

  for (let i = premierJour; i < finDuMois+premierJour; i++) {
    const journee = $("<div class='jour'></div>");

    journee.text(index);

    switch(i) {
        
        case 0:
            journee.css("border-top-left-radius", "1em");
        case 6:
            journee.css("border-top-right-radius", "1em");
            break; 
        case 35:
            journee.css("border-bottom-left-radius", "1em");
            break; 
        case 40:
            journee.css("border-bottom-right-radius", "1em");
            break;      
    }
    $("#calendrier").append(journee);
    index++;
  }

  index = 1;
  for (let j = finDuMois+premierJour -1; j < 41; j++) {

    const journee = $("<div class='jour'></div>");
    journee.text(index);
    journee.css("background-color", "lightgray");

    if (j == 34) {
      journee.css("border-bottom-left-radius", "1em");
    }

    if (j == 40) {
      journee.css("border-bottom-right-radius", "1em");
    }
    $("#calendrier").append(journee);
    index++;
  }





})