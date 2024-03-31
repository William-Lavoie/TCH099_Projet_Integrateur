<?php

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {


    // Mettre l'adresse de l'utilisateur dans la variable de session
    if (preg_match("~afficher-nom$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {

            $courriel = $donnees['courriel'];

            $query = $conn->prepare("SELECT nom 
                                FROM utilisateurs 
                                WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchColumn();

            echo json_encode(['resultat' => $resultat['nom']]);
        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }

}
?>