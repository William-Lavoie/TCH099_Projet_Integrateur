<?php

// Temporary values for testing on localhost
$hostname = "localhost";
    $username = "admin10";
    $password = "admin10";
    $database = "tch099";


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