<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

session_start();


if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    /*** FOR MOBILE (WILL BE MOVED) ***/
    
    // Chercher les présences pour chaque utilisateur
    if (preg_match("~afficher_presences_utilisateur$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'], $donnees['courriel'])) {
            
            require("connexion.php");

            $query = $conn->prepare("SELECT p.presence, pr.courriel_utilisateur 
                                FROM présences AS p
                                INNER JOIN présences_reunions AS pr ON pr.id_presences_reunions = p.id_presences_reunions
                                WHERE p.courriel = :courriel AND pr.id_reunions = :id ");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchAll();

            if ($resultat) {
                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        } 
    }
    
     // Chercher les groupes avec un enseignant donné
      if (preg_match("~afficher_groupes_enseignant$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
        
        if (isset($donnees['courriel'])) {
            
             require("connexion.php");

            $query = $conn->prepare("SELECT g.nom, g.id_groupes 
                                FROM groupes g 
                                WHERE courriel_enseignant = :courriel");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchAll();

            if ($resultat) {
                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        } 
        
        else {
             echo json_encode(["error" => "erreur"]);
        }
    }
    
    
    // Chercher les présences pour une réunion
     if (preg_match("~chercher_presences_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'])) {
            
             require("connexion.php");

            $query = $conn->prepare("SELECT u.nom, u.courriel_utilisateurs, COALESCE(ur.presence, 'VIDE') AS presence 
                                    FROM utilisateurs_reunions AS ur
                                    INNER JOIN utilisateurs AS u ON ur.courriel_utilisateurs = u.courriel_utilisateurs
                                    WHERE ur.id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchAll();

             echo json_encode($resultat);
        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Chercher le nom d'un utilisateur
    if (preg_match("~chercher_nom$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {
        
             require("connexion.php");


            $courriel = $donnees['courriel'];

            $query = $conn->prepare("SELECT nom 
                                FROM utilisateurs 
                                WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

             echo json_encode($resultat);
        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }

     // Chercher si une journée a au moins une réunion
     if (preg_match("~journee_a_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'], $donnees['date'])) {
            
             require("connexion.php");


            $courriel = $donnees['courriel'];
            $date = $donnees['date'];

            $query = $conn->prepare("SELECT * 
            FROM utilisateurs_reunions AS ur
            INNER JOIN reunions AS r ON ur.id_reunions = r.id_reunions
            WHERE ur.courriel_utilisateurs = :courriel AND r.date = :date");
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);
            $query->bindParam(":date", $date,  PDO::PARAM_STR);

            $query->execute();
            $resultat = $query->fetch();

            if (!empty($resultat)) {
                echo json_encode(["resultat" => true]);
            }

            else {
                echo json_encode(["resultat" => false]);
            }

        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }


      // Chercher toutes les informations sur une réunion
      if (preg_match("~chercher_infos_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'])) {
            
             require("connexion.php");

            $query = $conn->prepare("SELECT r.titre, r.heure_debut, r.heure_fin, COALESCE(g.nom, 'VIDE') AS nom 
                                     FROM reunions AS r
                                     LEFT JOIN groupes AS g ON g.id_groupes = r.id_groupes
                                     WHERE id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

             echo json_encode($resultat);
        }else {
            echo json_encode(["error" => "erreur"]);
        }
    }
    
    if (preg_match("~chercher_reunions_mobile$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['debut']) && 
            isset($donnees['fin']) && 
            isset($donnees['courriel'])) {
    
            require("connexion.php");
    
            $dateDebut = $donnees['debut'];
            $dateFin = $donnees['fin'];
            $courriel = $donnees['courriel'];
        
        
            $query = $conn->prepare("SELECT DISTINCT date 
                                    FROM reunions AS r 
                                    INNER JOIN groupes AS g ON r.id_groupes = g.id_groupes 
                                    WHERE g.courriel_enseignant = :courriel 
                                        AND date BETWEEN :dateDebut 
                                        AND :dateFin
                                    ORDER BY date");
            $query->bindParam(":dateDebut", $dateDebut,  PDO::PARAM_STR);
            $query->bindParam(":dateFin", $dateFin,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }
    
    
    if (preg_match("~chercher_reunions_journee$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'], $donnees['date'])) {
    
            require("connexion.php");
    
            $courriel = $donnees['courriel'];
            $date = $donnees['date'];
            
            $query = $conn->prepare("(SELECT r.*, ur.courriel_utilisateurs AS courriel 
                                    FROM reunions AS r 
                                    INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions 
                                    WHERE ur.courriel_utilisateurs = :courriel AND r.date = :date)

                                    UNION 
                
                                    (SELECT r.*, g.courriel_enseignant AS courriel 
                                    FROM reunions AS r 
                                    INNER JOIN groupes AS g ON r.id_groupes = g.id_groupes 
                                    WHERE g.courriel_enseignant = :courriel AND r.date = :date)
                                    
                                    ORDER BY heure_debut");
            $query->bindParam(":date", $date,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $courriel,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }











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


    // Création d'une réunion côté participants
    if (preg_match("~creer_reunion_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], 
                $donnees['debutReunion'], 
                $donnees['finReunion'], 
                $donnees['dateReunion'], 
                $donnees['description'], 
                $donnees['listeParticipants'], 
                $donnees['taches'])) {

            require("connexion.php");

            $participants = $donnees['listeParticipants'];
            $titre = $donnees['titre'];
            $debut = $donnees['debutReunion'];
            $fin = $donnees['finReunion'];
            $date = $donnees['dateReunion'];
            $description = $donnees['description'];
            $taches = $donnees['taches'];

            // Création de la réunion
            $query = $conn->prepare("INSERT INTO reunions (courriel_createur, titre, heure_debut, heure_fin, date, description) 
                                    VALUES (:courriel, '$titre', '$debut', '$fin', '$date', '$description')");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->execute();

            //id de la réunion venant d'être créée
            $id_reunion = $conn->lastInsertId();

            // Ajout du créateur dans la table de jointure 
            $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                    VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();

            // Création d'une liste des présences pour le créateur 
            $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
            VALUES (:id, :courriel)");
                $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();

            $id_presence= $conn->lastInsertId();

            // Création d'une entrée pour chaque autre utilisateur dans la table présence du créateur
            for ($i = 0; $i < count($participants); $i++) {

                $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                        VALUES (:courriel, -1, :id)");
                    $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                    $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                    $query->execute();
            }

            // Création d'une entrée dans la table de jointure pour chaque utilisateur
            for ($i = 0; $i < count($participants); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();


                // Création d'une liste des présences pour chaque utilisateur 
                $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
                                        VALUES (:id, :courriel)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();

                $id_presence= $conn->lastInsertId();

                // Création d'une entrée pour chaque autre utilisateurs dans la table présence
                for ($j = 0; $j < count($participants); $j++) {

                    // Le participant ne s'ajoute pas lui-même
                    if ($j != $i) {

                        $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                            VALUES (:courriel, -1, :id)");
                        $query->bindParam(":courriel", $participants[$j],  PDO::PARAM_STR);
                        $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                        $query->execute();
                    }
                }
                    

                // Ajout du créateur
                $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                        VALUES (:courriel, -1, :id)");
                    $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
                    $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                    $query->execute();
                    
                }
            

            // Création de la liste des tâches 
            $query = $conn->prepare("INSERT INTO liste_taches (id_reunions) 
                                    VALUES (:id)");
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

            $id_liste= $conn->lastInsertId();


            // Ajout des tâches 
            for ($i = 0; $i < count($taches); $i++) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) 
                                        VALUES (:titre, :id_liste)");
                $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
                $query->bindParam(":id_liste", $id_liste,  PDO::PARAM_STR);
                $query->execute();
            }

            // Création du forum
            $query = $conn->prepare("INSERT INTO forum (id_reunions) 
                                    VALUES (:id)");
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

            echo json_encode(["error" => "succes"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Chercher si le participant existe
    if (preg_match("~chercher_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'],)) {
    
            require("connexion.php");
    
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
    
            require("connexion.php");

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


    // Création d'une réunion côté groupe
    if (preg_match("~creer_reunion_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], 
                $donnees['debutReunion'], 
                $donnees['finReunion'], 
                $donnees['dateReunion'], 
                $donnees['description'], 
                $donnees['groupe'], 
                $donnees['taches'])) {

            require("connexion.php");

            $groupe = $donnees['groupe'];
            $titre = $donnees['titre'];
            $debut = $donnees['debutReunion'];
            $fin = $donnees['finReunion'];
            $date = $donnees['dateReunion'];
            $description = $donnees['description'];
            $taches = $donnees['taches'];

            // Création de la réunion
            $query = $conn->prepare("INSERT INTO reunions (id_groupes, courriel_createur, titre, heure_debut, heure_fin, date, description) 
                                    VALUES ('$groupe', :courriel, '$titre', '$debut', '$fin', '$date', '$description')");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->execute();

            //id de la réunion venant d'être créée
            $id_reunion = $conn->lastInsertId();

            // Recherche de tous les participants dans le groupe
            $query = $conn->prepare("SELECT courriel_etudiants 
                                    FROM utilisateurs_groupes ug 
                                    INNER JOIN groupes g ON ug.id_groupes = g.id_groupes  
                                    WHERE g.id_groupes = '$groupe'");
            $query->execute();

            $resultat = $query->fetchAll(PDO::FETCH_ASSOC);

            // Création d'une entrée dans la table de jointure pour chaque utilisateur
            for ($i = 0; $i < count($resultat); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $resultat[$i]['courriel_etudiants'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();


                 // Création d'une liste des présences pour chaque utilisateur 
                 $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
                 VALUES (:id, :courriel)");
                $query->bindParam(":courriel", $resultat[$i]['courriel_etudiants'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
                $query->execute();

                $id_presence= $conn->lastInsertId();

                // Création d'une entrée pour chaque autre utilisateurs dans la table présence
                for ($j = 0; $j < count($resultat); $j++) {

                    // Le participant ne s'ajoute pas lui-même
                    if ($j != $i) {

                        $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                            VALUES (:courriel, -1, :id)");
                        $query->bindParam(":courriel", $resultat[$j]['courriel_etudiants'],  PDO::PARAM_STR);
                        $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                        $query->execute();
                    }
                }
            }

             // Création de la liste des tâches 
            $query = $conn->prepare("INSERT INTO liste_taches (id_reunions) 
                                    VALUES (:id)");
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

            $id_liste= $conn->lastInsertId();

            // Ajout des tâches 
            for ($i = 0; $i < count($taches); $i++) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) 
                                        VALUES (:titre, :id_liste)");
                $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
                $query->bindParam(":id_liste", $id_liste,  PDO::PARAM_STR);
                $query->execute();
            }

            // Création du forum
            $query = $conn->prepare("INSERT INTO forum (id_reunions) 
                                    VALUES (:id)");
            $query->bindParam(":id", $id_reunion,  PDO::PARAM_STR);
            $query->execute();

            echo json_encode(["error" => "succes"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Modification d'une réunion côté groupe
    if (preg_match("~modifier_reunion_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], 
                $donnees['debutReunion'], 
                $donnees['finReunion'], 
                $donnees['dateReunion'], 
                $donnees['description'], 
                $donnees['groupe'], 
                $donnees['taches'], 
                $donnees['id_reunions'])) {

            require("connexion.php");

            $groupe = $donnees['groupe'];
            $titre = $donnees['titre'];
            $debut = $donnees['debutReunion'];
            $fin = $donnees['finReunion'];
            $date = $donnees['dateReunion'];
            $description = $donnees['description'];
            $taches = $donnees['taches'];
            $idReunion = $donnees['id_reunions'];


            // Modification de la réunion
            $query = $conn->prepare(" UPDATE reunions 
            SET 
                courriel_createur = :courriel,
                titre = :titre,
                heure_debut = :debut,
                heure_fin = :fin,
                date = :date,
                description = :description,
                id_groupes = :id_groupes
            WHERE 
                id_reunions = :reunion");

            $query->bindParam(':courriel', $_SESSION['courriel']);
            $query->bindParam(':titre', $titre);
            $query->bindParam(':debut', $debut);
            $query->bindParam(':fin', $fin);
            $query->bindParam(':date', $date);
            $query->bindParam(':description', $description);
            $query->bindParam(':id_groupes', $groupe);
            $query->bindParam(':reunion', $idReunion);

            $query->execute();

            // Recherche de tous les participants dans le groupe
            $query = $conn->prepare("SELECT courriel_etudiants 
                                    FROM utilisateurs_groupes ug 
                                    INNER JOIN groupes g ON ug.id_groupes = g.id_groupes  
                                    WHERE g.id_groupes = '$groupe'");
            $query->execute();

            $resultat = $query->fetchAll(PDO::FETCH_ASSOC);

            // Vider la table de jointure pour enlever les participants n'étant plus inclus
            $queryDelete = $conn->prepare("DELETE FROM utilisateurs_reunions 
                                        WHERE id_reunions = :id");
            $queryDelete->bindParam(":id", $idReunion, PDO::PARAM_STR);
            $queryDelete->execute();

            // Supprimer les présences
            $query = $conn->prepare("DELETE p FROM présences AS p INNER JOIN présences_reunions AS pr  
                                    WHERE pr.id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            // Supprimer la liste des présences
            $query = $conn->prepare("DELETE FROM présences_reunions 
            WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();
            

            // Création d'une entrée dans la table de jointure pour chaque utilisateur
            for ($i = 0; $i < count($resultat); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $resultat[$i]['courriel_etudiants'],  PDO::PARAM_STR);
                $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
                $query->execute();


                 // Création d'une liste des présences pour chaque utilisateur 
                 $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
                 VALUES (:id, :courriel)");
                $query->bindParam(":courriel", $resultat[$i]['courriel_etudiants'],  PDO::PARAM_STR);
                $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
                $query->execute();

                $id_presence= $conn->lastInsertId();

                // Création d'une entrée pour chaque autre utilisateurs dans la table présence
                for ($j = 0; $j < count($resultat); $j++) {

                    // Le participant ne s'ajoute pas lui-même
                    if ($j != $i) {

                        $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                            VALUES (:courriel, -1, :id)");
                        $query->bindParam(":courriel", $resultat[$j]['courriel_etudiants'],  PDO::PARAM_STR);
                        $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                        $query->execute();
                    }
            }        
        }

            // Chercher l'id de la liste des tâches
            $query = $conn->prepare("SELECT id_listes_taches 
                                    FROM liste_taches 
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            $idListe = $query->fetch();

            // Vider la liste des tâches
            $query = $conn->prepare("DELETE FROM taches 
                                    WHERE id_liste_taches = :id");
            $query->bindParam(":id", $idListe['id_listes_taches'],  PDO::PARAM_STR);
            $query->execute();

            // Ajout des tâches 
            for ($i = 0; $i < count($taches); $i++) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) 
                                        VALUES (:titre, :id_liste)");
                $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
                $query->bindParam(":id_liste", $idListe['id_listes_taches'],  PDO::PARAM_STR);
                $query->execute();
            }

            echo json_encode(["error" => "succes"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


     // Modification d'une réunion côté participants
    if (preg_match("~modifier_reunion_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], 
                $donnees['debutReunion'], 
                $donnees['finReunion'], 
                $donnees['dateReunion'], 
                $donnees['description'], 
                $donnees['taches'], 
                $donnees['id_reunions'], 
                $donnees['listeParticipants'])) {

            require("connexion.php");

            $titre = $donnees['titre'];
            $debut = $donnees['debutReunion'];
            $fin = $donnees['finReunion'];
            $date = $donnees['dateReunion'];
            $description = $donnees['description'];
            $taches = $donnees['taches'];
            $idReunion = $donnees['id_reunions'];
            $participants = $donnees['listeParticipants'];

            // Modification de la réunion
            $query = $conn->prepare(" UPDATE reunions 
            SET 
                courriel_createur = :courriel,
                titre = :titre,
                heure_debut = :debut,
                heure_fin = :fin,
                date = :date,
                description = :description
            WHERE 
                id_reunions = :reunion");

            $query->bindParam(':courriel', $_SESSION['courriel']);
            $query->bindParam(':titre', $titre);
            $query->bindParam(':debut', $debut);
            $query->bindParam(':fin', $fin);
            $query->bindParam(':date', $date);
            $query->bindParam(':description', $description);
            $query->bindParam(':reunion', $idReunion);

            $query->execute();

            // Vider la table de jointure pour enlever les participants n'étant plus inclus
            $queryDelete = $conn->prepare("DELETE FROM utilisateurs_reunions 
                                            WHERE id_reunions = :id");
            $queryDelete->bindParam(":id", $idReunion, PDO::PARAM_STR);
            $queryDelete->execute();

            
            // Supprimer les présences
            $query = $conn->prepare("DELETE p FROM présences AS p INNER JOIN présences_reunions AS pr  
                                    WHERE pr.id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            // Supprimer la liste des présences
            $query = $conn->prepare("DELETE FROM présences_reunions 
            WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();
            

            // Ajout du créateur dans la table de jointure 
            $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                    VALUES (:courriel, :id)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            // Création d'une liste des présences pour le créateur
            $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
            VALUES (:id, :courriel)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            $id_presence= $conn->lastInsertId();

            // Création d'une entrée pour chaque autre utilisateurs dans la table présence
            for ($j = 0; $j < count($participants); $j++) {

                    $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                        VALUES (:courriel, -1, :id)");
                    $query->bindParam(":courriel", $participants[$j],  PDO::PARAM_STR);
                    $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                    $query->execute();
            }        


              // Création d'une entrée dans la table de jointure pour chaque utilisateur
            for ($i = 0; $i < count($participants); $i++) {

                $query = $conn->prepare("INSERT INTO utilisateurs_reunions (courriel_utilisateurs, id_reunions) 
                                        VALUES (:courriel, :id)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
                $query->execute();

                // Création d'une liste des présences pour chaque utilisateur 
                $query = $conn->prepare("INSERT INTO présences_reunions (id_reunions, courriel_utilisateur) 
                VALUES (:id, :courriel)");
                $query->bindParam(":courriel", $participants[$i],  PDO::PARAM_STR);
                $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
                $query->execute();

                $id_presence= $conn->lastInsertId();

                // Création d'une entrée pour chaque autre utilisateurs dans la table présence
                for ($j = 0; $j < count($participants); $j++) {

                    // Le participant ne s'ajoute pas lui-même
                    if ($j != $i) {

                        $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                                            VALUES (:courriel, -1, :id)");
                        $query->bindParam(":courriel", $participants[$j],  PDO::PARAM_STR);
                        $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                        $query->execute();
                    }
                }        

                $query = $conn->prepare("INSERT INTO présences (courriel, presence, id_presences_reunions) 
                VALUES (:courriel, -1, :id)");
                $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                $query->execute();
            }

            // Chercher l'id de la liste des tâches
            $query = $conn->prepare("SELECT id_listes_taches 
                                    FROM liste_taches 
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunion,  PDO::PARAM_STR);
            $query->execute();

            $idListe = $query->fetch();

            // Vider la liste des tâches
            $query = $conn->prepare("DELETE FROM taches 
                                    WHERE id_liste_taches = :id");
            $query->bindParam(":id", $idListe['id_listes_taches'],  PDO::PARAM_STR);
            $query->execute();

            // Ajout des tâches 
            for ($i = 0; $i < count($taches); $i++) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) 
                                        VALUES (:titre, :id_liste)");
                $query->bindParam(":titre", $taches[$i],  PDO::PARAM_STR);
                $query->bindParam(":id_liste", $idListe['id_listes_taches'],  PDO::PARAM_STR);
                $query->execute();
            }

            echo json_encode(["error" => "succes"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


     // Chercher les réunions entre deux jours données
    if (preg_match("~chercher_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['debut']) && 
            isset($donnees['fin']) && 
            isset($_SESSION['courriel'])) {
    
            require("connexion.php");
    
            $dateDebut = $donnees['debut'];
            $dateFin = $donnees['fin'];
        
            $query = $conn->prepare("SELECT r.*, ur.courriel_utilisateurs AS courriel
                                    FROM reunions AS r 
                                    INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions 
                                    WHERE ur.courriel_utilisateurs = :courriel 
                                    AND r.date BETWEEN :dateDebut AND :dateFin
                                    
                                    UNION 
                                    
                                    SELECT r.*, g.courriel_enseignant AS courriel
                                    FROM reunions AS r 
                                    INNER JOIN groupes AS g ON r.id_groupes = g.id_groupes 
                                    WHERE g.courriel_enseignant = :courriel AND r.date BETWEEN :dateDebut AND :dateFin;");
            $query->bindParam(":dateDebut", $dateDebut,  PDO::PARAM_STR);
            $query->bindParam(":dateFin", $dateFin,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    if (preg_match("~supprimer_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
        
            // Supprimer la réunion
            $query = $conn->prepare("DELETE FROM reunions 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            // Supprimer les entrées dans la table de jointure 
            $query = $conn->prepare("DELETE FROM utilisateurs_reunions 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            // Récupérer l'identifiant du forum  
            $query = $conn->prepare("SELECT id_forum 
                                    FROM forum 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            $resultat = $query->fetch(PDO::FETCH_ASSOC);
            $id_forum = $resultat['id_forum'];

            // Supprimer le forum
            $query = $conn->prepare("DELETE FROM forum 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            // Supprimer les messages associés au forum
            $query = $conn->prepare("DELETE FROM message 
                                    WHERE id_forum = :id_forum");
            $query->bindParam(":id_forum", $id_forum,  PDO::PARAM_STR);
            $query->execute();

            // Récupérer l'identifiant de la liste des tâches 
            $query = $conn->prepare("SELECT id_listes_taches 
                                    FROM liste_taches 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            $resultat = $query->fetch(PDO::FETCH_ASSOC);
            $id_liste = $resultat['id_listes_taches'];

            // Supprimer la liste des tâches 
            $query = $conn->prepare("DELETE FROM liste_taches 
                                    WHERE id_reunions = :id_reunions");
            $query->bindParam(":id_reunions", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            // Supprimer les tâches associées à la liste
            $query = $conn->prepare("DELETE FROM taches 
                                    WHERE id_liste_taches = :id_liste");
            $query->bindParam(":id_liste", $id_liste,  PDO::PARAM_STR);
            $query->execute();

            // Supprimer les présences
            $query = $conn->prepare("DELETE p FROM présences AS p INNER JOIN présences_reunions AS pr  
                                    WHERE pr.id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();

            // Supprimer la liste des présences
            $query = $conn->prepare("DELETE FROM présences_reunions 
            WHERE id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->execute();



            echo json_encode("Succès");
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
    
            require("connexion.php");
        
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


    // Chercher les participants pour une réunion donnée
    if (preg_match("~chercher_liste_participants$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
        
            $query = $conn->prepare("SELECT nom, u.courriel_utilisateurs 
                                    FROM utilisateurs AS u 
                                    INNER JOIN utilisateurs_reunions AS ur ON u.courriel_utilisateurs = ur.courriel_utilisateurs 
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


     // Chercher l'heure de début et de fin pour une réunion donnée
    if (preg_match("~chercher_heures_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
        
            $query = $conn->prepare("SELECT date, heure_debut, heure_fin 
                                    FROM reunions  
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Modifier l'heure de fin d'une réunion
    if (preg_match("~ajouter_temps$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'], $donnees['minutes'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
            $minutes = $donnees['minutes'];

            $query = $conn->prepare("UPDATE reunions 
                                    SET heure_fin = ADDDATE(heure_fin, INTERVAL :minutes MINUTE)  
                                    WHERE id_reunions = :id");
            $query->bindParam(":minutes", $minutes,  PDO::PARAM_INT);
            $query->bindParam(":id", $idReunions,  PDO::PARAM_INT);

            if ($query->execute()) {
                echo json_encode(['message' => 'succès']);
            }
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Création d'un groupe
    if (preg_match("~ajouter_groupe$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['nom'], $donnees['participants'])) {

            require("connexion.php");

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

            require("connexion.php");

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


    // Chercher les tâches pour une réunion donnée
    if (preg_match("~chercher_liste_taches$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");
    
            $idReunions = $donnees['idReunions'];
        
            $query = $conn->prepare("SELECT titre, completee 
                                    FROM taches AS t 
                                    INNER JOIN liste_taches AS lt ON t.id_liste_taches = lt.id_listes_taches 
                                    WHERE lt.id_reunions = :id");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Chercher la photo de profil des participants à une réunion
    if (preg_match("~chercher_photo$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['courriel'])) {
            require("connexion.php");

            $query = $conn->prepare("SELECT photo 
                                    FROM utilisateurs 
                                    WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

            echo $resultat[0];

            if ($resultat) {
                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        }
    }


    // Ajouter une nouvelle tâche à une réunion
    if (preg_match("~ajouter-nouvelle-tache$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['idReunion'])) {
            require("connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("SELECT id_listes_taches 
                                    FROM liste_taches 
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

            $query->execute();
        
            if ($resultat) {

                $query = $conn->prepare("INSERT INTO taches (titre, id_liste_taches) 
                                        VALUES (:titre, :liste)");
                $query->bindParam(":titre", $donnees['titre'],  PDO::PARAM_STR);
                $query->bindParam(":liste", $resultat['id_listes_taches'],  PDO::PARAM_STR);

                $query->execute();

                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        }
    }


    // Ajouter un nouveau message pour une réunion donnée
    if (preg_match("~ajouter-nouveau-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['contenu'], $donnees['idReunion'])) {

            require("connexion.php");
            
            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("SELECT id_forum 
                                    FROM forum 
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();
        
            if ($resultat) {

                $query = $conn->prepare("INSERT INTO message (contenu, auteur, heure, id_forum) 
                                        VALUES (:contenu, :auteur, DATE_SUB(NOW(), INTERVAL 4 HOUR), :id)");
                $query->bindParam(":contenu", $donnees['contenu'],  PDO::PARAM_STR);
                $query->bindParam(":auteur", $_SESSION['courriel'],  PDO::PARAM_STR);
                $query->bindParam(":id", $resultat['id_forum'],  PDO::PARAM_STR);

                $query->execute();

                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        }
    }


    // Modifier un message donné 
    if (preg_match("~modifier-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idMessage'], $donnees['contenu'])) {

            require("connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("UPDATE message SET contenu = :contenu 
                                    WHERE id_message = :id");
            $query->bindParam(":contenu", $donnees['contenu'],  PDO::PARAM_STR);
            $query->bindParam(":id", $donnees['idMessage'],  PDO::PARAM_STR);
            $query->execute();
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }
    

    // Obtenir les messages pour une réunion donnée
    if (preg_match("~obtenir-messages-reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'])) {

            require("connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("SELECT DISTINCT m.id_message, m.auteur, m.contenu, m.heure, u.nom 
                                    FROM message AS m 
                                    INNER JOIN forum AS f ON m.id_forum = f.id_forum 
                                    INNER JOIN reunions AS r ON f.id_reunions= r.id_reunions 
                                    INNER JOIN utilisateurs_reunions AS ur ON r.id_reunions = ur.id_reunions 
                                    INNER JOIN utilisateurs AS u on m.auteur = u.courriel_utilisateurs 
                                    WHERE f.id_reunions = :id 
                                    ORDER BY m.heure");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchAll();

            if ($resultat) {
    
                echo json_encode($resultat);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        }
    }

    // Obtenir les messages pour une réunion donnée
    if (preg_match("~supprimer-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['id_message'])) {

            require("connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("DELETE FROM message 
                                    WHERE id_message = :id");
            $query->bindParam(":id", $donnees['id_message'],  PDO::PARAM_STR);
            $query->execute();            
        }
    }


     // Chercher les réunions pour un groupe donné
    if (preg_match("~obtenir_reunions_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
    
        if (isset($donnees['idGroupe'])) {
    
            require("connexion.php");
    
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


     // Chercher la photo de profil d'un utilisateur
    if (preg_match("~obtenir-photo-profil$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'])) {
    
            require("connexion.php");
            
            $query = $conn->prepare("SELECT photo 
                                    FROM utilisateurs 
                                    WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();
    
            echo $resultat[0];

            if ($resultat) {
                echo json_encode($resultat);
            }
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Chercher si un utilisateur a une réunion entre deux heures données 
    if (preg_match("~chercher_conflit$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'], $donnees['debut'], $donnees['fin'], $donnees['date'])) {
    
            require("connexion.php");
            
            $query = $conn->prepare("SELECT * 
                                    FROM utilisateurs_reunions AS ur 
                                    INNER JOIN reunions AS r ON ur.id_reunions = r.id_reunions 
                                    WHERE ur.courriel_utilisateurs = :courriel 
                                        AND r.date = :date 
                                        AND r.heure_debut < :fin 
                                        AND :debut < r.heure_fin");
            $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":date", $donnees['date'],  PDO::PARAM_STR);
            $query->bindParam(":debut", $donnees['debut'],  PDO::PARAM_STR);
            $query->bindParam(":fin", $donnees['fin'],  PDO::PARAM_STR);

            $query->execute();
            $resultat = $query->fetchAll();
    
            if ($resultat) {
                echo json_encode($resultat);
            }
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

     // Créer un compte lorsque l'utilisateur se connecte pour la première fois
    if (preg_match("~creer-compte$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['nom'], $donnees['type'])) {
    
            require("connexion.php");
            
            $query = $conn->prepare("INSERT INTO utilisateurs (nom, type, courriel_utilisateurs) VALUES (:nom, :type, :courriel)");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->bindParam(":nom", $donnees['nom'],  PDO::PARAM_STR);
            $query->bindParam(":type", $donnees['type'],  PDO::PARAM_STR);
            
            $query->execute();
    
                echo json_encode(["message" => "succès"]);

        }
    
        else {
            echo json_encode(["error" => "erreur"]);
        }
    
    }


    // Modifier l'état d'une tâche
    if (preg_match("~modifier_tache$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['titre'], 
                $donnees['etat'], 
                $donnees['idReunion'])) {
    
            require("connexion.php");

            // Chercher l'identifiant de la liste des tâches
            $query = $conn->prepare("SELECT id_listes_taches 
                                    FROM liste_taches AS lt 
                                    INNER JOIN reunions AS r ON lt.id_reunions = r.id_reunions 
                                    WHERE r.id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();

            $id_liste = $query->fetchColumn();

            // La tâche n'est pas complétée
            if ($donnees['etat'] == 0) {

                $query = $conn->prepare("UPDATE taches 
                                        SET completee = 0 
                                        WHERE titre = :titre 
                                            AND id_liste_taches = :id");
                $query->bindParam(":titre", $donnees['titre'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_liste,  PDO::PARAM_STR);
                $query->execute();
            } else { // La tâche est complétée

                $query = $conn->prepare("UPDATE taches 
                                        SET completee = 1 
                                        WHERE titre = :titre 
                                            AND id_liste_taches = :id");
                $query->bindParam(":titre", $donnees['titre'],  PDO::PARAM_STR);
                $query->bindParam(":id", $id_liste,  PDO::PARAM_STR);
                $query->execute();
            }
    
            echo json_encode(["message" => "succès"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


     // Chercher les autres participants pour une réunion donnée
    if (preg_match("~chercher_presences_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {
    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);
    
    if (isset($donnees['idReunions'])) {
        require("connexion.php");
        $idReunions = $donnees['idReunions'];
        
        // Courriel de l'enseignant si la réunion est pour un groupe
        $query = $conn->prepare("SELECT g.courriel_enseignant 
                                FROM groupes AS g 
                                INNER JOIN reunions AS r ON r.id_groupes = g.id_groupes
                                WHERE r.id_reunions = :id");
        $query->bindParam(":id", $idReunions, PDO::PARAM_STR);
        $query->execute();
        $enseignant = $query->fetchColumn();
        
        if (!empty($enseignant) && $enseignant == $_SESSION['courriel']) {
            
            $query = $conn->prepare("SELECT nom, presence
                                    FROM utilisateurs_reunions 
                                    INNER JOIN utilisateurs On utilisateurs_reunions.courriel_utilisateurs = utilisateurs.courriel_utilisateurs
                                    WHERE id_reunions = :id");
            $query->bindParam(":id", $idReunions, PDO::PARAM_STR);
            $query->execute();
            $resultatEnseignant = $query->fetchAll();
            
            echo json_encode($resultatEnseignant);
        } else {
            
           $query = $conn->prepare("SELECT id_presences_reunions FROM présences_reunions WHERE id_reunions = :id AND courriel_utilisateur = :courriel");
            $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

            $query->execute();
            $id_presence = $query->fetchColumn();

            $query = $conn->prepare("SELECT DISTINCT u.courriel_utilisateurs, u.nom, pre.presence
                                    FROM utilisateurs AS u                                    
                                    INNER JOIN présences AS pre ON pre.courriel = u.courriel_utilisateurs
                                    INNER JOIN présences_reunions AS pr ON pr.id_presences_reunions = pre.id_presences_reunions
                                    WHERE pre.id_presences_reunions = :id_presence");
            $query->bindParam(":id_presence", $id_presence,  PDO::PARAM_STR);

            $query->execute();
    
            $resultat = $query->fetchAll();

            echo json_encode($resultat);
        }
    } else {
        // idReunions is not set
        echo json_encode(["error" => "ID de réunions non défini"]);
    }
} 

    // Chercher la satisfaction d'une réunion pour l'utilisateur courant
    if (preg_match("~afficher_appreciation$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("connexion.php");

            // Chercher l'identifiant de la liste des tâches
            $query = $conn->prepare("SELECT appreciation
                                     FROM utilisateurs_reunions
                                     WHERE courriel_utilisateurs = :courriel AND id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

            $query->execute();

            $resultat = $query -> fetch();
    
            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

// Changer l'apprécation d'une réunion
    if (preg_match("~modifier_appreciation$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['appreciation'], 
                  $donnees['idReunions'])) {
    
            require("connexion.php");

            // Chercher l'identifiant de la liste des tâches
            $query = $conn->prepare("UPDATE utilisateurs_reunions SET appreciation = :appreciation WHERE id_reunions = :id AND courriel_utilisateurs = :courriel");
            $query->bindParam(":appreciation", $donnees['appreciation'],  PDO::PARAM_STR);
            $query->bindParam(":id", $donnees['idReunions'],  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

            $query->execute();

    
            echo json_encode(["message" => "succès"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    // Marquer un membre d'une réunion comme présent ou absent
    if (preg_match("~modifier_presence$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'], 
                $donnees['etat'], 
                $donnees['idReunion'])) {
    
            require("connexion.php");

            // Chercher l'identifiant de la liste des tâches
            $query = $conn->prepare("SELECT id_presences_reunions
                                    FROM présences_reunions 
                                    WHERE id_reunions = :id AND courriel_utilisateur = :courriel");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);

            $query->execute();

            $id_presence = $query->fetchColumn();

            // La tâche n'est pas complétée
            if ($donnees['etat'] == 0) {

                $query = $conn->prepare("UPDATE présences 
                                        SET presence = 0 
                                        WHERE id_presences_reunions = :id 
                                        AND courriel = :courriel");
                $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
                $query->execute();
            } else { // La tâche est complétée

                $query = $conn->prepare("UPDATE présences 
                                        SET presence = 1
                                        WHERE id_presences_reunions = :id 
                                        AND courriel = :courriel");
                $query->bindParam(":id", $id_presence,  PDO::PARAM_STR);
                $query->bindParam(":courriel", $donnees['courriel'],  PDO::PARAM_STR);
                $query->execute();
            }
    
            echo json_encode(["message" => "succès"]);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }

    if (preg_match("~mettre_presences_a_jour$~", $_SERVER['REQUEST_URI'], $matches)) {

    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);

    if (isset($donnees['idReunion'])) {

        require("connexion.php");

        // Liste des participants à la rencontre
        $query = $conn->prepare("SELECT courriel_utilisateurs 
                                FROM utilisateurs_reunions
                                WHERE id_reunions = :id");
        $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetchAll();

        if ($resultat) {
            // Récupérer les présences pour chacun des participants 
            foreach ($resultat as $participant) {

                $query = $conn->prepare("SELECT p.presence 
                                    FROM présences AS p
                                    INNER JOIN présences_reunions AS pr ON p.id_presences_reunions = pr.id_presences_reunions 
                                    INNER JOIN reunions  AS r ON pr.id_reunions = r.id_reunions
                                    WHERE r.id_reunions = :id AND p.courriel = :courriel");
                $query->bindParam(":courriel", $participant['courriel_utilisateurs'],  PDO::PARAM_STR);
                $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);

                $query->execute();
                $presences = $query->fetchAll();

                $somme_presences = 0;
                $nb_votes = 0;
                foreach ($presences as $presence) {
                    if ($presence['presence'] !== null && $presence['presence'] !== -1) {
                        $somme_presences += (int)$presence['presence'];
                        $nb_votes++;
                    }
                }

                // L'utilisateur est considéré présent si la majorité des utilisateurs l'ont indiqué présent
                $present = $nb_votes > 0 ? round($somme_presences / $nb_votes) : -1;

                // Insérer la présence dans la table de jointure des utilisateurs et des réunions 
                $query = $conn->prepare("UPDATE utilisateurs_reunions 
                                SET presence = :present 
                                WHERE courriel_utilisateurs = :courriel AND id_reunions = :id");
                $query->bindParam(":courriel", $participant['courriel_utilisateurs'],  PDO::PARAM_STR);
                $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
                $query->bindParam(":present", $present,  PDO::PARAM_INT);
                $query->execute();
            }

            echo json_encode(["success" => "Présences mises à jour avec succès"]);
        } else {
            echo json_encode(["error" => "Erreur: Aucun participant trouvé"]);
        }
    }
}




}




if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {


    // Chercher la photo de profil de l'utilisateur
    if (preg_match("~afficher_photo$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        $query = $conn->prepare("SELECT photo 
                                FROM utilisateurs 
                                WHERE courriel_utilisateurs = :courriel");
        $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
        $query->execute();
        $resultat = $query->fetch();

        echo $resultat[0];
        if ($resultat) {
            echo json_encode($resultat);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Afficher les groupes associés à un utilisateur
    if (preg_match("~afficher_groupes$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

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


     // Chercher le nom de l'utilisateur
    if (preg_match("~afficher_nom$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        $query = $conn->prepare("SELECT nom 
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


    // Obtenir toutes les réunions de l'utilisateur courant
    if (preg_match("~obtenir_reunions_utilisateur$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

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

        require("connexion.php");

        if (isset($_SESSION['courriel'])) {
            echo json_encode($_SESSION['courriel']);
        } else {
            echo json_encode(["error" => "erreur"]);
        }
    }


    // Chercher le type de l'utilisateur (étudiant ou enseignant)
    if (preg_match("~afficher_type$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

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

    // Chercher si le courriel de l'utilisateur est associé à un compte 
    if (preg_match("~compte_existe$~", $_SERVER['REQUEST_URI'], $matches)) {

        require("connexion.php");

        if (isset($_SESSION['courriel'])) {

            $query = $conn->prepare("SELECT * 
            FROM utilisateurs 
            WHERE courriel_utilisateurs = :courriel");
            $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetch();

            if ($resultat) {
            echo json_encode(["existe" => true]);
            } else {
            echo json_encode(["existe" => false]);
            }
        }
       
    }

    


};


?>