<?php

// pour modification du nom 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // récupére les données envoyées en JSON
    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);
    
    if (isset($donnees['nom'])) {
        $nouveauNom = $donnees['nom'];
          // validation du nouveau nom avec preg_match (il a le droit a  des lettres, chiffres, apostrophes, tirets, et espaces)
          if (preg_match('/^[a-zA-Z0-9\'\-\s]+$/', $nouveauNom)) {

            //  connexion à la base de données
            require("connexionP.php");

            $query = $conn->prepare("UPDATE profils SET nom = :nom WHERE courriel = 'william100@hotmail.ca'");
            $query->bindParam(":nom", $nouveauNom,  PDO::PARAM_STR);

        
            // executer la requête
            if ($query->execute()) {
                echo json_encode(['success' => true, 'message' => 'Nom mis à jour avec succès']);
            } else {
                // la gestionn des erreurs
                echo json_encode(['success' => false, 'error' => 'Erreur lors de la mise à jour dans la base de données']);
            }
        } else {
            //  format du nouveau nom est invalide
            echo json_encode(['success' => false, 'error' => 'Format du nom invalide']);
        }
    } else {
        //  nouveau nom n'est pas fourni
        echo json_encode(['success' => false, 'error' => 'Nom manquant! Veuillez en entrer un.']);
    }
} else {
    // laméthode de la requête n'est pas POST
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
}

?>


