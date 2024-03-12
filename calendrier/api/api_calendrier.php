<?php

// WORK IN PROGRESS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

        if (preg_match("~creer_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);


        if (isset($donnees['titre'], $donnees['debutReunion'], $donnees['finReunion'], $donnees['dateReunion'], $donnees['description'])) {

        require("connexion.php");
    
        $titre = $donnees['titre'];
        $debut = $donnees['debutReunion'];
        $fin = $donnees['finReunion'];
        $date = $donnees['dateReunion'];
        $description = $donnees['description'];

        $query = $conn->prepare("INSERT INTO reunion (id_réunions, courriel_createur, Titre, heure_debut, heure_fin, date, Description) VALUES ('1', 'william100@hotmail.com', '$titre', '$debut', '$fin', '$date', '$description')");

        $query->execute();

        $query = $conn->prepare("INSERT INTO étudiants_réunions VALUES ('william100@hotmail.com','2')");
        $query->execute();

        echo json_encode(["error" => "succes"]);



        }
        else {
            echo json_encode(["error" => "erreur"]);
        }

    }



    // Chercher si le participant existe
    if (preg_match("~chercher_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['courriel'],)) {
    
            require("connexion.php");
    
            $courriel = $donnees['courriel'];
           
            $query = $conn->prepare("SELECT * FROM étudiants WHERE courriel = :courriel");
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);
    
            $query->execute();
    
            $resultat = $query->fetch(PDO::FETCH_ASSOC);

            echo json_encode(["existe" => !empty($resultat)]);
            }
    
            else {
                echo json_encode(["error" => "erreur"]);
            }
    
    }





     // Chercher les réunions entre deux jours données
     if (preg_match("~chercher_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['dateDebut']) && isset($donnees['dateFin'])) {
    
            require("connexion.php");
    
            $dateDebut = $donnees['dateDebut'];
            $dateFin = $donnees['dateFin'];
           
            $query = $conn->prepare("SELECT * FROM reunion WHERE date BETWEEN :dateDebut AND :dateFin");
            $query->bindParam(":dateDebut", $dateDebut,  PDO::PARAM_STR);
            $query->bindParam(":dateFin", $dateFin,  PDO::PARAM_STR);

    
            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
            }
    
            else {
                echo json_encode(["error" => "erreur"]);
            }
    
    }
}

?>