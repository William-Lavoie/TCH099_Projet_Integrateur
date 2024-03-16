<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();

// WORK IN PROGRESS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Mettre l'adresse de l'utilisateur dans la variable de session
    if (preg_match("~envoyer_identifiant$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {

    
        $_SESSION['courriel'] = $donnees['courriel'];
        echo json_encode(["error" => "succes"]);
        }
        else {
            echo json_encode(["error" => "erreur"]);
        }

    }

        // Création d'une réunion
    if (preg_match("~creer_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['debutReunion'], $donnees['finReunion'], $donnees['dateReunion'], $donnees['description'], $donnees['listeParticipants'])) {

        require("connexion.php");

        $participants = $donnees['listeParticipants'];
        $titre = $donnees['titre'];
        $debut = $donnees['debutReunion'];
        $fin = $donnees['finReunion'];
        $date = $donnees['dateReunion'];
        $description = $donnees['description'];

        // Création de la réunion
        $query = $conn->prepare("INSERT INTO reunions (courriel_createur, titre, heure_debut, heure_fin, date, description) VALUES (:courriel, '$titre', '$debut', '$fin', '$date', '$description')");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();

        //id de la réunion venant d'être créée
        $id_reunion = $conn->lastInsertId();

        // Création d'une entrée dans la table de jointure pour chaque utilisateur
        for ($i = 0; $i < count($participants); $i++) {

            $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) VALUES (:courriel, :id)");
            $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();
        }

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
           
            $query = $conn->prepare("SELECT * FROM utilisateurs WHERE courriel_utilisateurs = :courriel");
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
           
            $query = $conn->prepare("SELECT * FROM reunions AS r INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions WHERE r.courriel_createur = :courriel AND date BETWEEN :dateDebut AND :dateFin");
            $query->bindParam(":dateDebut", $dateDebut,  PDO::PARAM_STR);
            $query->bindParam(":dateFin", $dateFin,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);


    
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