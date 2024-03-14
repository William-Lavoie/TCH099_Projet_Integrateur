//************************************** */
// Fonction pour aside pliable gauche
//************************************** */
document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner les éléments nécessaires pour la transition
    var btnPliableGauche = document.querySelector('#BtnPliableGauche');

    var asidePresence = document.querySelector('#presence');
    var content = document.querySelector('#main_aside');
    var classBtnPliableGauche = document.querySelector('.BtnPliableGauche');
    
    btnPliableGauche.addEventListener('click', function () {
        // État de la barre
        var isCollapsed = asidePresence.classList.toggle('collapsed');

        // Changer la barre par rapport à son état
        if (isCollapsed) {
            classBtnPliableGauche.classList.add('collapsed');
            content.classList.add('collapsed');
        } else {
            classBtnPliableGauche.classList.remove('collapsed');
            content.classList.remove('collapsed');
        }
    });

    // Au survol de la souris, changer la couleur du bouton
    btnPliableGauche.addEventListener('mouseenter', function () {
        btnPliableGauche.style.color = '#a5a5a5';
    });

    // Lorsque la souris quitte, restaurer la couleur par défaut du bouton
    btnPliableGauche.addEventListener('mouseleave', function () {
        btnPliableGauche.style.color = ''; // Revenir à la couleur par défaut
    });
});


//*********************************** */
// Fonction pour aside pliable droite
//*********************************** */
document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner les éléments nécessaires pour la transition
    var btnPliableDroite = document.querySelector('#BtnPliableDroite');

    var asideTodo = document.querySelector('#to_do');
    var content = document.querySelector('#main_aside');
    var classBtnPliableDroite = document.querySelector('.BtnPliableDroite');
    
    btnPliableDroite.addEventListener('click', function () {
        // État de la barre
        var isCollapsed = asideTodo.classList.toggle('collapsed');

        // Changer la barre par rapport à son état
        if (isCollapsed) {
            classBtnPliableDroite.classList.add('collapsed');
            content.classList.add('collapsed');
        } else {
            classBtnPliableDroite.classList.remove('collapsed');
            content.classList.remove('collapsed');
        }
    });

    // Au survol de la souris, changer la couleur du bouton
    btnPliableDroite.addEventListener('mouseenter', function () {
        btnPliableDroite.style.color = '#a5a5a5';
    });

    // Lorsque la souris quitte, restaurer la couleur par défaut du bouton
    btnPliableDroite.addEventListener('mouseleave', function () {
        btnPliableDroite.style.color = ''; // Revenir à la couleur par défaut
    });
});

//************************** */
//slider de satisfaction
//************************** */
function updateSliderValue() {
    var satisfaction = document.getElementById("satisfaction");
    var valeurSatisfaction = document.getElementById("valeurSatisfaction");
    valeurSatisfaction.innerText = satisfaction.value;
}


//************************* */
//ajouter noms dans la table
//************************* */
document.addEventListener('DOMContentLoaded', function () {
    const testbtn = document.getElementById('testButton');
    testbtn.addEventListener('click', function() {
        addRowsToTable(5);
    });

function addRowsToTable(numRows) {
    var table = document.getElementById("presence_table");

    for (var i = 1; i <= numRows; i++) {
        var row = table.insertRow(-1);

        //will add the name per user from the data base
        var cell1 = row.insertCell(0);
        cell1.colSpan = 2; //can't add it through html
        cell1.innerHTML = '<td id="nom' + i + '" class="nomPresence">Name</td>';

        
        var cell3 = row.insertCell(1);
        cell3.innerHTML = '<form class="presence_form">' +
            '<label class="switch_presence">' +
            '<input type="checkbox" id="present' + i + '" class="Present" name="Presence">' +
            '<span class="slider round"></span>' +
            '</label>' +
            '</form>';

            
        var row2 = table.insertRow(-1);
        var spaceCell = row2.insertCell(0);
        spaceCell.innerHTML = '<td><br></td>';


          // Add event listener to toggle color when checkbox is changed
    var checkbox = document.getElementById('present' + i);
    checkbox.addEventListener('change', function() {
        var nameElement = document.getElementById('name' + i);
        if (this.checked) {
            nameElement.style.color = 'green';
        } else {
             nameElement.style.color = ''; // Reset to default color
        }
    });
    }
}
});

//************************************* */
//couleur de noms pour les presence
//************************************* */
document.addEventListener('DOMContentLoaded', function () {
    
    const forms = document.querySelectorAll('.presence_form');

    forms.forEach(function (form) {
        form.addEventListener('change', function (event) {
            const sliderSelectioné = event.target;
            updateNomDeCouleur(sliderSelectioné);
        });
    });

    function updateNomDeCouleur(sliderSelectioné) {
        const nomClass = sliderSelectioné.value.toLowerCase() + '_selecté';
        const nomElement = sliderSelectioné.closest('tr').querySelector('.nomPresence');

        // Enlever toutes les classes de couleur
        nomElement.classList.remove('present_selecté', 'absent_selecté');

        // Ajouter la class de couleur
        if (sliderSelectioné.checked) {
            nomElement.classList.add(nomClass);
        }
    }
});

//****************************** */
//timer
//******************************* */
(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    //I'm adding this section so I don't have to keep updating this pen every year :-)
    //remove this if you don't need it
    let today = new Date(),
        dd = String(today.getDate()).padStart(2, "0"),
        mm = String(today.getMonth() + 1).padStart(2, "0"),
        yyyy = today.getFullYear(),
        nextYear = yyyy + 1,
        dayMonth = "09/30/",
        birthday = dayMonth + yyyy;
    
    today = mm + "/" + dd + "/" + yyyy;
    if (today > birthday) {
      birthday = dayMonth + nextYear;
    }
    //end
    
    const countDown = new Date(birthday).getTime(),
        x = setInterval(function() {    
  
          const now = new Date().getTime(),
                distance = countDown - now;
  
          document.getElementById("days").innerText = Math.floor(distance / (day)),
            document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
  
          //do something later when date is reached
          if (distance < 0) {
            document.getElementById("headline").innerText = "It's my birthday!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
          }
          //seconds
        }, 0)
    }());