<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();

//************************************
//Post 
//************************************
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

     // Chercher si le participant existe
    if (preg_match("~chercher_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'],)) {
    
            require("./api/connexion.php");
    
            $courriel = $donnees['courriel'];
        
            $query = $conn->prepare("SELECT * 
                                    FROM utilisateurs 
                                    WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);
    
            $query->execute();
    
            $resultat = $query->fetch(PDO::FETCH_ASSOC);

            echo json_encode(["existe" => !empty($resultat)]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


};

//******************************************** */
//GET
//************************************************ */
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {

    // Chercher le courriel de l'utilisateur courant
    if (preg_match("~chercher-courriel$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("./api/connexion.php");

        if (isset($_SESSION['courriel'])) {
            echo json_encode($_SESSION['courriel']);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    
    // Afficher les groupes associés à un utilisateur
    if (preg_match("~afficher_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("./api/connexion.php");

            $query = $conn->prepare("SELECT g.nom, g.id_groupes, g.courriel_enseignant 
                                FROM groupes g 
                                INNER JOIN utilisateurs_groupes ug ON g.id_groupes = ug.id_groupes 
                                WHERE courriel_etudiants = :courriel 
                                UNION 
                                SELECT nom, id_groupes, courriel_enseignant 
                                FROM groupes 
                                WHERE courriel_enseignant = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        if ($resultat) {
            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


};


?>