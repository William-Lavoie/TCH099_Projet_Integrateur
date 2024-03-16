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
        addRowsToContainer(5);
    });

    // pas d'abscence toggle tous les checkbox
    const mainCheckbox = document.getElementById('switch_pas_dabscence');
    mainCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.boite_nom_presence input[type="checkbox"]');
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = mainCheckbox.checked;
                checkbox.dispatchEvent(new Event('change')); 
            });
        });

    function addRowsToContainer(numRows) {
        var container = document.getElementById("presence_conteneur");

        for (var i = 1; i <= numRows; i++) {
            // Create div for each row
            var rowDiv = document.createElement("div");
            rowDiv.classList.add("hide-text", "boite_nom_presence");

            // Name
            var nameDiv = document.createElement("div");
            nameDiv.classList.add("nomPresence");
            nameDiv.textContent = "Name"; 
            rowDiv.appendChild(nameDiv);

            // Form
            var form = document.createElement("form");
            form.classList.add("presence_form");

            // Checkbox
            var label = document.createElement("label");
            label.classList.add("switch_presence");
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.id = "present" + i;
            input.classList.add("Present");
            input.setAttribute("name", "Presence");
            var span = document.createElement("span");
            span.classList.add("slider", "round");
            label.appendChild(input);
            label.appendChild(span);
            form.appendChild(label);

            rowDiv.appendChild(form);

            container.appendChild(rowDiv);

//************************* */
//changer la couleur des nom quand un checkbox est cheked
//************************* */
            input.addEventListener('change', function() {
                var nameElement = this.parentElement.parentElement.previousElementSibling;
                if (this.checked) {
                    nameElement.style.color = 'green';
                } else {
                    nameElement.style.color = 'red'; // Reset to red when user un toggles
                }
            });
        }
    }
});


//****************************** */
//timer
//******************************* */
document.addEventListener('DOMContentLoaded', function () {

    (function () {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        // Set the start and end dates and time
        const meetingStart = "03/14/2024 20:14"; 
        let meetingEnd = new Date("03/16/2024 20:25"); // Convert to Date object

        let btnHorloge = document.getElementById("btn_horloge");
        let minutesAAjouter = parseInt(document.getElementById("minutesAAjouter").value);

        document.getElementById("minutesAAjouter").addEventListener('change', function() {
            minutesAAjouter = parseInt(this.value);
        });

        btnHorloge.addEventListener('click', function() {
            meetingEnd.setTime(meetingEnd.getTime() + minutesAAjouter * 60000);

            // Update countdown display immediately after adding minutes
            updateCountdown();
        });

        const countDownStart = new Date(meetingStart).getTime(),
            x = setInterval(updateCountdown, 1000); // Set interval to 1000 milliseconds (1 second)

        function updateCountdown() {
            const now = new Date().getTime();

            // Countdown until meeting starts and then countdown until meeting ends
            let distance;
            if (now < countDownStart) {  // Countdown to meeting start
                distance = countDownStart - now;
            } else if (now > meetingEnd.getTime()) { // If done, show 0
                distance = 0;
            } else {
                distance = meetingEnd.getTime() - now; // Countdown to meeting end
            }

            document.getElementById("days").innerText = Math.floor(distance / day);
            document.getElementById("hours").innerText = Math.floor((distance % day) / hour);
            document.getElementById("minutes").innerText = Math.floor((distance % hour) / minute);
            document.getElementById("seconds").innerText = Math.floor((distance % minute) / second);

            let horloge = document.getElementById("horloge");
            // Do something when time is almost reached 
            if (distance <= 600000 && distance > 0) {
                horloge.style.color = "red";
            }

            // Do something when time is reached
            if (distance <= 0) {
                horloge.style.color = "red";
                clearInterval(x);
            }
        }
    })();
});
