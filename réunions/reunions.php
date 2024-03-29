<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    // Création d'un GROUPE
    if (preg_match("~ajouter-reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['nom'], $donnees['tableauParticipants'])) {

            require("calendrier\api\connexion.php");

            $nom = $donnees['nom'];
            $participants = $donnees['tableauParticipants'];
        
            // Création de la réunion
            $query = $conn->prepare("INSERT INTO groupes (courriel_enseignant, nom) VALUES (:courriel, :nom)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":courriel", $nom,  PDO::PARAM_STR);

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
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }
}