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

    // Chercher les réunions pour un groupe donné
    if (preg_match("~obtenir_reunions_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['idGroupe'])) {
    
            require("/calendrier/api/connexion.php");
    
            $idGroupe = $donnees['idGroupe'];
        
            $query = $conn->prepare("SELECT id_reunions, titre, date, description 
                                    FROM reunions WHERE id_groupes = :id 
                                    ORDER BY date");
            $query->bindParam(":id", $idGroupe,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Création d'un groupe
    if (preg_match("~ajouter_groupe$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['nom'], $donnees['participants'])) {

            require("calendrier/api/connexion.php");

            $nom = $donnees['nom'];
            $participants = $donnees['participants'];

            // Création du groupe
            $query = $conn->prepare("INSERT INTO groupes (courriel_enseignant, nom) 
                                    VALUES (:courriel, :nom)");
            $query->bindParam(":courriel", $_SESSION['courriel'] ,  PDO::PARAM_STR);
            $query->bindParam(":nom", $nom,  PDO::PARAM_STR);

            $query->execute();

            //id du groupe venant d'être créée
            $id_groupe = $conn->lastInsertId();

            // Création d'une entrée dans la table de jointure pour chaque étudiant
            for ($i = 0; $i < count($participants); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_groupes (courriel_etudiants, id_groupes) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
                $query->execute();
            }

            echo json_encode(["error" => "success"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Modification d'un grouoe
    if (preg_match("~modifier_groupe$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['nom'], 
                $donnees['participants'], 
                $donnees['idGroupe'])) {

            require("calendrier/api/connexion.php");

            $nom = $donnees['nom'];
            $participants = $donnees['participants'];
            $id_groupe = $donnees['idGroupe'];

            // Modification du nom
            $query = $conn->prepare("UPDATE groupes 
                                    SET nom = :nom 
                                    WHERE id_groupes = :id");
            $query->bindParam(":nom", $nom,  PDO::PARAM_STR);
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->execute();

            // Vider la table de jointure 
            $query = $conn->prepare("DELETE FROM utilisateurs_groupes 
                                    WHERE id_groupes = :id");
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->execute();

            // Création d'une entrée dans la table de jointure pour chaque étudiant
            for ($i = 0; $i < count($participants); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_groupes (courriel_etudiants, id_groupes) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
                $query->execute();
            }

            echo json_encode(["error" => "success"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    
    // Chercher si le participant existe
    if (preg_match("~chercher_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'],)) {
    
            require("calendrier/api/connexion.php");
    
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


    // Chercher les membres d'un groupe
    if (preg_match("~chercher-membres-groupe$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idGroupes'])) {
    
            require("calendrier/api/connexion.php");

            $id_groupe = $donnees['idGroupes'];
        
            // Tous les membres sauf l'enseignant qui a créé le groupe
            $query = $conn->prepare("SELECT courriel_etudiants 
                                    FROM utilisateurs_groupes 
                                    WHERE id_groupes = :id 
                                        AND courriel_etudiants 
                                        NOT LIKE :courriel");
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->execute();
    
            $resultat = $query->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Supprimer un groupe
    if (preg_match("~supprimer_groupe$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idGroupe'])) {

            $id_groupe = $donnees['idGroupe'];
    
            require("calendrier/api/connexion.php");
        
            // Supprimer le groupe
            $query = $conn->prepare("DELETE FROM groupes 
                                    WHERE id_groupes = :id");
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->execute();

            // Supprimer les entrées dans la table de jointure 
            $query = $conn->prepare("DELETE FROM utilisateurs_groupes 
                                    WHERE id_groupes = :id");
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->execute();

            // Modifier les réunions associés à ce groupe
            $query = $conn->prepare("UPDATE reunions 
                                    SET id_groupes = null 
                                    WHERE id_groupes = :id");
            $query->bindParam(":id", $id_groupe,  PDO::PARAM_STR);
            $query->execute();
    
            echo json_encode("Succès");
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

};


//******************************************** */
//GET
//************************************************ */
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {


    // Obtenir toutes les réunions de l'utilisateur courant
    if (preg_match("~obtenir_reunions_utilisateur$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("calendrier/api/connexion.php");

        $query = $conn->prepare("(SELECT r.id_reunions, r.titre, r.description, r.date, r.heure_debut, r.heure_fin 
                                    FROM reunions AS r 
                                    INNER JOIN groupes AS g ON r.id_groupes = g.id_groupes 
                                    WHERE courriel_enseignant = :courriel)
                                    
                                    UNION ALL
                                    
                                    (SELECT r.id_reunions, r.titre, r.description, r.date, r.heure_debut, r.heure_fin 
                                    FROM reunions AS r
                                    INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions 
                                    WHERE courriel_utilisateurs = :courriel)
                                    
                                    ORDER BY date, heure_debut;
                                ");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        if ($resultat) {
            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }



    // Chercher le courriel de l'utilisateur courant
    if (preg_match("~chercher-courriel$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("calendrier/api/connexion.php");

        if (isset($_SESSION['courriel'])) {
            echo json_encode($_SESSION['courriel']);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Afficher les groupes associés à un utilisateur
    if (preg_match("~afficher_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("calendrier/api/connexion.php");

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


        
    // Chercher le type de l'utilisateur (étudiant ou enseignant)
    if (preg_match("~afficher_type$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("calendrier/api/connexion.php");

        $query = $conn->prepare("SELECT type 
                                FROM utilisateurs 
                                WHERE courriel_utilisateurs = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetch();

        if ($resultat) {
            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


};

?>