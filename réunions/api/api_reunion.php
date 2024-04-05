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

    // Chercher les groupes avec un enseignant donné
    if (preg_match("~afficher_groupes_enseignant$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
        
        if (isset($donnees['courriel'])) {
            
            require("api/connexion.php");

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


    // Obtenir les messages pour une réunion donnée
    if (preg_match("~obtenir-messages-reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'])) {

            require("api/connexion.php");

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

        
    // Chercher les présences pour une réunion
    if (preg_match("~chercher_presences_reunion$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idReunion'])) {
            
            require("api/connexion.php");

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


    // Obtenir les messages pour une réunion donnée
    if (preg_match("~supprimer-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['id_message'])) {

            require("api/connexion.php");

            // Obtenir la liste des tâches de la réunion
            $query = $conn->prepare("DELETE FROM message 
                                    WHERE id_message = :id");
            $query->bindParam(":id", $donnees['id_message'],  PDO::PARAM_STR);
            $query->execute();            
        }
    }

         // Modifier un message donné 
    if (preg_match("~modifier-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['idMessage'], $donnees['contenu'])) {

            require("api/connexion.php");

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


      // Ajouter un nouveau message pour une réunion donnée
    if (preg_match("~ajouter-nouveau-message$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['contenu'], $donnees['idReunion'])) {

            require("api/connexion.php");
            
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


    
    // Ajouter une nouvelle tâche à une réunion
    if (preg_match("~ajouter-nouvelle-tache$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);

        if (isset($donnees['titre'], $donnees['idReunion'])) {
            require("api/connexion.php");

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


        // Chercher les autres participants pour une réunion donnée
    if (preg_match("~chercher_presences_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {
        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
        
        if (isset($donnees['idReunions'])) {
            require("api/connexion.php");
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
    
                $query = $conn->prepare("SELECT DISTINCT u.nom, u.courriel_utilisateurs, pre.presence, pre.id_presences_reunions 
                                        FROM utilisateurs AS u 
                                        INNER JOIN utilisateurs_reunions AS ur ON u.courriel_utilisateurs = ur.courriel_utilisateurs 
                                        INNER JOIN présences_reunions AS pr ON pr.id_reunions = ur.id_reunions
                                        INNER JOIN présences AS pre ON pre.id_presences_reunions = pr.id_presences_reunions
                                        WHERE ur.id_reunions = :id AND u.courriel_utilisateurs NOT LIKE :courriel AND pre.id_presences_reunions = :id_presence");
                $query->bindParam(":id", $idReunions,  PDO::PARAM_STR);
                $query->bindParam(":courriel", $_SESSION['courriel'],  PDO::PARAM_STR);
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


    // Marquer un membre d'une réunion comme présent ou absent
    if (preg_match("~modifier_presence$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['courriel'], 
                $donnees['etat'], 
                $donnees['idReunion'])) {
    
            require("api/connexion.php");

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


     // Chercher les tâches pour une réunion donnée
    if (preg_match("~chercher_liste_taches$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("api/connexion.php");
    
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


      // Modifier l'état d'une tâche
    if (preg_match("~modifier_tache$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['titre'], 
                $donnees['etat'], 
                $donnees['idReunion'])) {
    
            require("api/connexion.php");

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


     // Chercher l'heure de début et de fin pour une réunion donnée
    if (preg_match("~chercher_heures_reunions$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunions'])) {
    
            require("api/connexion.php");
    
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
    
            require("api/connexion.php");
    
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


    if (preg_match("~mettre_presences_a_jour$~", $_SERVER['REQUEST_URI'], $matches)) {

        $donnees_json = file_get_contents('php://input');
        $donnees = json_decode($donnees_json, true);
    
        if (isset($donnees['idReunion'])) {
    
            require("api/connexion.php");

            //Liste des participants à la rencontre
            $query = $conn->prepare("SELECT courriel_utilisateurs 
                                    FROM utilisateurs_reunions AS ur
                                    INNER JOIN reunions AS r ON ur.id_reunions = r.id_reunions
                                    WHERE r.id_reunions = :id");
            $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
            $query->execute();
            $resultat = $query->fetchAll();


            //Récupérer les présences pour chacun des participants 
            for ($i = 0; $i < count($resultat); $i++) {

                $query = $conn->prepare("SELECT p.presence 
                                    FROM présences AS p
                                    INNER JOIN présences_reunions AS pr ON p.id_presences_reunions = pr.id_presences_reunions 
                                    INNER JOIN reunions  AS r ON pr.id_reunions = r.id_reunions
                                    WHERE r.id_reunions = :id AND p.courriel = :courriel");
                $query->bindParam(":courriel", $resultat[$i]['courriel_utilisateurs'],  PDO::PARAM_STR);
                $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);

                $query->execute();
                $presences = $query->fetchAll();

                $somme_presences = 0;
                for ($j = 0; $j < count($presences); $j++) {

                    if ($presences[$j] != null && $presences[$j] != -1) {
                        $somme_presences += (int)$presences[$j]['presence'];
                    }
                }

                // L'utilisateur est considéré présent si la majorité des utilisateurs l'ont indiqué présent
                $present = round($somme_presences / count($presences));

                // Insérer la présence dans la table de jointure des utilisateurs et des réunions 
                $query = $conn->prepare("UPDATE utilisateurs_reunions 
                                SET presence = :present 
                                WHERE courriel_utilisateurs = :courriel AND id_reunions = :id");
                $query->bindParam(":courriel", $resultat[$i]['courriel_utilisateurs'],  PDO::PARAM_STR);
                $query->bindParam(":id", $donnees['idReunion'],  PDO::PARAM_STR);
                $query->bindParam(":present", $present,  PDO::PARAM_STR);
                $query->execute();
            }
            
            if ($resultat) {
                echo json_encode($presences);
            } else {
                echo json_encode(["error" => "erreur"]);
            }
        }
    }
};


//******************************************** */
//GET
//************************************************ */
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {



};

?>