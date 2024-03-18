<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();
$courrielUtilisateur;

// WORK IN PROGRESS
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Mettre l'adresse de l'utilisateur dans la variable de session
    if (preg_match("~envoyer_identifiant$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {

    
        $_SESSION['courriel'] = $donnees['courriel'];
        $courrielUtilisateur = $donnees['courriel'];
        echo json_encode($_SESSION['courriel']);
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

        // Ajout du créateur dans la table de jointure 
        $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) VALUES (:courriel, :id)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

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
           
            $query = $conn->prepare("SELECT * FROM reunions AS r INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions WHERE ur.courriel_utilisateurs = :courriel AND date BETWEEN :dateDebut AND :dateFin");
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


    // Chercher les participants pour une réunion donnée
    if (preg_match("~chercher_liste_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
           
            $query = $conn->prepare("SELECT nom FROM utilisateurs AS u INNER JOIN utilisateurs_reunions AS ur ON u.courriel_utilisateurs = ur.courriel_utilisateurs WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        }
    
        else {
            echo json_encode(["error" => "erreur"]);
        }
    
    }


        // Création d'un GROUPE
        if (preg_match("~ajouter-reunion$~", $_SERVER['REQUEST_URI'], $matches)) {
    
            $donnees_json = file_get_contents('php://input');
            $donnees = json_decode($donnees_json, true);
    
            if (isset($donnees['nom'], $donnees['participants'])) {
    
            require("connexion.php");
    
            $nom = $donnees['nom'];
            $participants = $donnees['participants'];
         
            // Création du groupe
            $query = $conn->prepare("INSERT INTO groupes (courriel_enseignant, nom) VALUES (:courriel, :nom)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":nom", $nom,  PDO::PARAM_STR);
    
            $query->execute();
    
            //id du groupe venant d'être créée
            $id_groupe = $conn->lastInsertId();
    
            // Création d'une entrée dans la table de jointure pour chaque étudiant
            for ($i = 0; $i < count($participants); $i++) {
    
                $query = $conn->prepare("INSERT INTO utilisateurs_groupes (courriel_etudiants, id_groupes) VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
                $query->execute();
            }
    
            echo json_encode(["error" => "success"]);
    
            }
            else {
                echo json_encode(["error" => "erreur"]);
            }
    
        }

}

// WORK IN PROGRESS
// Chercher la photo de profil de l'utilisateur
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {

        require("connexion.php");

        $query = $conn->prepare("SELECT photo FROM utilisateurs WHERE courriel_utilisateurs = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetch();

        echo $resultat[0];
        if ($resultat) {
            echo json_encode($resultat);
        }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }

    };


?>