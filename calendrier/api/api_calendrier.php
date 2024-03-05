<?php

// WORK IN PROGRESS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);


    if (isset($donnees['titre'], $donnees['debutReunion'], $donnees['finReunion'], $donnees['dateReunion'], $donnees['description'])) {

    require("connexion.php");
 
    $titre = $donnees['titre'];
    $debut = $donnees['debutReunion'];
    $fin = $donnees['finReunion'];
    $date = $donnees['dateReunion'];
    $description = $donnees['description'];

    $query = $conn->prepare("INSERT INTO reunion (Titre, heure_debut, heure_fin, date, Description) VALUES ('$titre', '$debut', '$fin', '$date', '$description')");

    $query->execute();

    echo json_encode(["error" => "succes"]);



    }
    else {
        echo json_encode(["error" => "erreur"]);
    }

}


?>