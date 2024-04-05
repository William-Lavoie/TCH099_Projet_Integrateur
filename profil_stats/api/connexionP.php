<?php

$host = parse_url($_SERVER["HTTP_HOST"], PHP_URL_HOST);

$hostname;
$username;
$password;
$database;

if ($host=="127.0.0.1") {
    //Code d'accès à la base de données locale
    $hostname = "localhost";
    $username = "admin10";
    $password = "admin10";
    $database = "tch099";
} else {
    //Codes d'accès à la base de données de production
    $hostname = "localhost";
    $username = "u558642428_admin";
    $password = "Thisistheadminpassword123!";
    $database = "u558642428_TCH_099";
}

    try {

        // Établir la connexion avec PDO
        $conn = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
        
        // Activer le mode d'erreur
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Afficher un message si la connexion est réussie
        // echo "Connexion réussie avec PDO!";

    } catch(PDOException $e) {

        // Arrêter le script si la connexion échoue
        die("Connexion échouée: " . $e->getMessage());

    }?>