$(document).ready(function() {


  function afficherCalendrier(mois) {
   
    $("#calendrier").html("");
  
    // Jour courant 
    const nouveauMois = new Date(jourCourant.getFullYear(), mois);
    console.log(nouveauMois);
  
    const options = {month: 'long'};
    // Écrire la date 
    let anneeActuel = jourCourant.getFullYear();
    let moisActuel = nouveauMois.toLocaleDateString('fr-FR',options);

    let moisFormatte = "";
    for (let i = 0; i < moisActuel.length; i++) {
      if (i ==0) {
        moisFormatte += moisActuel[0].toUpperCase();
      }

      
      else {
        moisFormatte += moisActuel[i];
      }

    }
    console.log(anneeActuel);
    console.log(moisActuel);
    $("#journee-mois p").text(moisFormatte + " " + anneeActuel);
    
    /***  Peupler le calendrier ***/
  
    //Premier jour du mois courant
    const premierDuMois = new Date(nouveauMois.getFullYear(), nouveauMois.getMonth(), 1);
    const premierJour = premierDuMois.getDay();
    console.log(premierJour);
  
    // Remplir les derniers jours du mois passé 
    // TODO: Case where month is january (change year)
    const moisDernier = new Date(nouveauMois.getFullYear(), premierDuMois.getMonth(), 0-premierJour+1);
    let debutCalendrier = moisDernier.getDate();
  console.log("debut" +premierJour);

    let i = 0;
    for (i; i < premierJour; i++) {
      console.log("test");
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
  
    const moisProchainPremierJour = new Date(nouveauMois.getFullYear(), nouveauMois.getMonth()+1, 1);
    const finDuMois = (new Date(moisProchainPremierJour -1).getDate());
  
    for (let i = premierJour; i < finDuMois+premierJour; i++) {
      const journee = $("<div class='jour'></div>");
  
      journee.text(index);
  
      switch(i) {
          
          case 0:
              journee.css("border-top-left-radius", "1em");
              break;
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

      if (nouveauMois.getFullYear() == new Date().getFullYear() && nouveauMois.getMonth() == new Date().getMonth() && i == new Date().getDate()+premierJour-1) {
          journee.css("border", "3px solid #7eccff");
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
    }

    
  // Jour courant 
  let jourCourant = new Date()

  // Remplir le calendrier au mois courant
  afficherCalendrier(jourCourant.getMonth());
 
  $("#btn-dernier-mois").on("click", function() {

    afficherCalendrier(jourCourant.getMonth()-1);
    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()-1);
  })

  $("#btn-prochain-mois").on("click", function() {

    afficherCalendrier(jourCourant.getMonth()+1);
    jourCourant = new Date(jourCourant.getFullYear(), jourCourant.getMonth()+1);
  })



})