function basculerGroupes() {
    var groupes = document.getElementById("conteneur-groupes");
    var btnBasculer = document.getElementById("conteneur-basculer");
    var reunions = document.getElementById("conteneur-reunions");

    if (groupes.style.marginLeft === "-12em") {
        // Fermer la barre latérale contenant les groupes
        groupes.style.marginLeft = "0";
        btnBasculer.style.marginLeft = "0em";
        reunions.style.marginLeft = "0em";
        document.getElementById("basculer").innerText = "⪓";
    } else {
        // Ouvrir la barre latérale contenant les groupes
        groupes.style.marginLeft = "-12em";
        btnBasculer.style.marginLeft = "-12em";
        reunions.style.marginLeft = "-12em";
        document.getElementById("basculer").innerText = "⪔";
    }
}
