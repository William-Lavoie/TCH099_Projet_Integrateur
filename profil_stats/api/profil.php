<?php

// pour modification du nom 

session_start();

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (preg_match("~modifier-nom$~", $_SERVER['REQUEST_URI'], $matches)) {

        // récupére les données envoyées en JSON
        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
        
        if (isset($donnees['nom'])) {
            
            $nouveauNom = $donnees['nom'];
            // validation du nouveau nom avec preg_match (il a le droit a  des lettres, chiffres, apostrophes, tirets, et espaces)
            if (preg_match('/^[a-zA-Z0-9\'\-\s]+$/', $nouveauNom)) {

                //  connexion à la base de données
                require("connexionP.php");

                $query = $conn->prepare("UPDATE utilisateurs SET nom = :nom WHERE courriel_utilisateurs = :courriel");
                $query->bindParam(":nom", $nouveauNom,  PDO::PARAM_STR);
                $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

                // executer la requête
                if ($query->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Nom mis à jour avec succès']);
                } else {
                    // la gestionn des erreurs
                    echo json_encode(['success' => false, 'error' => 'Erreur lors de la mise à jour dans la base de données']);
                }
            } 
        } else {
            //  nouveau nom n'est pas fourni
            echo json_encode(['success' => false, 'error' => 'Nom manquant! Veuillez en entrer un.']);
        }
    }

    // modifier photo de profiler 


    if (preg_match("~modifier-photo$~", $_SERVER['REQUEST_URI'], $matches)) {
        $response = array(); // Initialize response array

        var_dump($_POST); //dump for testing

        // Read the Blob data from the request body
        $blobData = file_get_contents('php://input');
    
        echo $blobData;

        if (!empty($blobData)) {
            require("connexionP.php"); // Check if this file includes the database connection correctly
    
            $query = $conn->prepare("UPDATE utilisateurs SET photo = :photo WHERE courriel = :courriel");
            $query->bindParam(":photo", $blobData, PDO::PARAM_LOB);
            $query->bindParam(":courriel", $_SESSION['courriel'], PDO::PARAM_STR);
    
            if ($query->execute()) {
                $response['success'] = true;
                $response['message'] = 'Photo mise à jour avec succès';
            } else {
                $response['success'] = false;
                $response['error'] = 'Erreur lors de la mise à jour dans la base de données: ' . $query->errorInfo()[2];
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'Donnees Blob manquantes';
        }
    
        echo json_encode($response);
    }

}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // Chercher les réunions de l'utilisateur connecté dans les 140 derniers jours
    if (preg_match("~chercher_reunions_stats$~", $_SERVER['REQUEST_URI'], $matches)) {

        //  connexion à la base de données
        require("connexionP.php");

        $query = $conn->prepare("SELECT * 
                                FROM utilisateurs_reunions AS ur 
                                INNER JOIN reunions AS r ON ur.id_reunions = r.id_reunions 
                                WHERE ur.courriel_utilisateurs = :courriel 
                                    AND (r.date BETWEEN DATE_SUB(NOW(), INTERVAL 139 DAY) 
                                    AND NOW()) 
                                    ORDER BY r.date");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        // executer la requête
        if ($resultat) {
            echo json_encode($resultat);
        } else {
            // la gestionn des erreurs
            echo json_encode(['success' => false, 'error' => 'Aucune réunion trouvée']);
        }     
    }
}

