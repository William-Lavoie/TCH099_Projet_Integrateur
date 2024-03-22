<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();
$courrielUtilisateur;

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

        // Création d'une réunion côté participants
        if (preg_match("~creer_reunion_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['debutReunion'], $donnees['finReunion'], $donnees['dateReunion'], $donnees['description'], $donnees['listeParticipants'], $donnees['taches'])) {

        require("connexion.php");

        $participants = $donnees['listeParticipants'];
        $titre = $donnees['titre'];
        $debut = $donnees['debutReunion'];
        $fin = $donnees['finReunion'];
        $date = $donnees['dateReunion'];
        $description = $donnees['description'];
        $taches = $donnees['taches'];

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

        // Création de la liste des tâches 
        $query = $conn->prepare("INSERT INTO liste_taches (id_reunions) VALUES (:id)");
        $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
        $query->execute();

        $id_liste= $conn->lastInsertId();


        // Ajout des tâches 
        for ($i = 0; $i < count($taches); $i++) {

            $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) VALUES (:titre, :id_liste)");
            $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
            $query->bindParam(":id_liste", $id_liste,  PDO::PARAM_STR);
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


    // Création d'une réunion côté groupe
    if (preg_match("~creer_reunion_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['debutReunion'], $donnees['finReunion'], $donnees['dateReunion'], $donnees['description'], $donnees['groupe'], $donnees['taches'])) {

            require("connexion.php");

            $groupe = $donnees['groupe'];
            $titre = $donnees['titre'];
            $debut = $donnees['debutReunion'];
            $fin = $donnees['finReunion'];
            $date = $donnees['dateReunion'];
            $description = $donnees['description'];
            $taches = $donnees['taches'];


            // Création de la réunion
            $query = $conn->prepare("INSERT INTO reunions (id_groupes, courriel_createur, titre, heure_debut, heure_fin, date, description) VALUES ('$groupe', :courriel, '$titre', '$debut', '$fin', '$date', '$description')");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->execute();

            //id de la réunion venant d'être créée
            $id_reunion = $conn->lastInsertId();

            // Ajout du créateur dans la table de jointure 
            $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) VALUES (:courriel, :id)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();


            // Recherche de tous les participants dans le groupe
            $query = $conn->prepare("SELECT courriel_etudiants FROM utilisateurs_groupes ug INNER JOIN groupes g ON ug.id_groupes = g.id_groupes  WHERE g.id_groupes = '$groupe'");
            $query->execute();

            $resultat = $query->fetchAll(PDO::FETCH_ASSOC);

            // Création d'une entrée dans la table de jointure pour chaque utilisateur
            for ($i = 0; $i < count($resultat); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $resultat[$i]['courriel_etudiants'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();
            }

             // Création de la liste des tâches 
            $query = $conn->prepare("INSERT INTO liste_taches (id_reunions) VALUES (:id)");
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

            $id_liste= $conn->lastInsertId();


            // Ajout des tâches 
            for ($i = 0; $i < count($taches); $i++) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) VALUES (:titre, :id_liste)");
                $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
                $query->bindParam(":id_liste", $id_liste,  PDO::PARAM_STR);
                $query->execute();
            }

            echo json_encode(["error" => "succes"]);

            }
            else {
                echo json_encode(["error" => "erreur"]);
            }

    }





     // Chercher les réunions entre deux jours données
     if (preg_match("~chercher_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['debut']) && isset($donnees['fin']) && isset($_SESSION['courriel'])) {
    
            require("connexion.php");
    
            $dateDebut = $donnees['debut'];
            $dateFin = $donnees['fin'];
           
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
           
            $query = $conn->prepare("SELECT nom, u.courriel_utilisateurs FROM utilisateurs AS u INNER JOIN utilisateurs_reunions AS ur ON u.courriel_utilisateurs = ur.courriel_utilisateurs WHERE id_reunions = :id");
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
        if (preg_match("~ajouter_groupe$~", $_SERVER['REQUEST_URI'], $matches)) {
    
            $donnees_json = file_get_contents('php://input');
            $donnees = json_decode($donnees_json, true);

            if (isset($donnees['nom'], $donnees['participants'])) {
    
            require("connexion.php");
    
            $nom = $donnees['nom'];
            $participants = $donnees['participants'];

            // Création du groupe
            $query = $conn->prepare("INSERT INTO groupes (courriel_enseignant, nom) VALUES (:courriel, :nom)");
            $query->bindParam(":courriel", $_SESSION['courriel'] ,  PDO::PARAM_STR);
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


    // Chercher les tâches pour une réunion donnée
    if (preg_match("~chercher_liste_taches$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
           
            $query = $conn->prepare("SELECT titre, completee FROM taches AS t INNER JOIN liste_taches AS lt ON t.id_liste_taches = lt.id_listes_taches WHERE lt.id_reunions = :id");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        }
    
        else {
            echo json_encode(["error" => "erreur"]);
        }
    
    }

    // Chercher la photo de profil des participants à une réunion
    if (preg_match("~chercher_photo$~", $_SERVER['REQUEST_URI'], $matches)) {


        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {
            require("connexion.php");


            $query = $conn->prepare("SELECT photo FROM utilisateurs WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

            echo $resultat[0];

            if ($resultat) {
                echo json_encode($resultat);
            }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }
    }
        }


        // Ajouter une nouvelle tâche à une réunion
    if (preg_match("~ajouter-nouvelle-tache$~", $_SERVER['REQUEST_URI'], $matches)) {


        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['idReunion'])) {
            require("connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("SELECT id_listes_taches FROM liste_taches WHERE id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

           
            $query->execute();
           
            if ($resultat) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) VALUES (:titre, :liste)");
                $query->bindParam(":titre", $donnees['titre'],  PDO::PARAM_STR);
                $query->bindParam(":liste", $resultat['id_listes_taches'],  PDO::PARAM_STR);

                $query->execute();

    
                echo json_encode($resultat);
            }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }
       }
    }


     // Chercher les réunions pour un groupe donné
     if (preg_match("~obtenir_reunions_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['idGroupe'])) {
    
            require("connexion.php");
    
            $idGroupe = $donnees['idGroupe'];
           
            $query = $conn->prepare("SELECT titre, description FROM reunions WHERE id_groupes = :id");
            $query->bindParam(":id", $idGroupe,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        }
    
        else {
            echo json_encode(["error" => "erreur"]);
        }
    
    }

        


}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {

    // Chercher la photo de profil de l'utilisateur
    if (preg_match("~afficher_photo$~", $_SERVER['REQUEST_URI'], $matches)) {

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
    }


    // Afficher les groupes associés à un utilisateur
    if (preg_match("~afficher_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        $query = $conn->prepare("SELECT nom, g.id_groupes FROM groupes g INNER JOIN utilisateurs_groupes ug ON g.id_groupes = ug.id_groupes WHERE courriel_etudiants = :courriel UNION SELECT nom, id_groupes FROM groupes WHERE courriel_enseignant = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        if ($resultat) {
            echo json_encode($resultat);
        }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }
    }


     // Chercher le nom de l'utilisateur
     if (preg_match("~afficher_nom$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        $query = $conn->prepare("SELECT nom FROM utilisateurs WHERE courriel_utilisateurs = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetch();

        if ($resultat) {
            echo json_encode($resultat);
        }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Obtenir toutes les réunions de l'utilisateur courant
    if (preg_match("~obtenir_reunions_utilisateur$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        $query = $conn->prepare("SELECT r.titre, r.description FROM reunions AS r INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions WHERE courriel_utilisateurs = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        if ($resultat) {
            echo json_encode($resultat);
        }
        
        else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    
        

    };


?>