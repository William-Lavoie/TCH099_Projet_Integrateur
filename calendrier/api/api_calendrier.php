<?php


// Just started 
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    require("connexion.php");

    $query = "INSERT INTO reunion (titre, heure_debut, heure_fin, date, description) VALUES ($_POST[titre], 'Tom B. Erichsen', 'Skagen 21', 'Stavanger', '4006', 'Norway');"
}