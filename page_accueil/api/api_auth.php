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
    // Mettre l'adresse de l'utilisateur dans la variable de session
    if (preg_match("~envoyer_identifiant$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {

            $_SESSION['courriel'] = $donnees['courriel'];
            $courrielUtilisateur = $donnees['courriel'];
            echo json_encode($_SESSION['courriel']);
        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    
}
?>

