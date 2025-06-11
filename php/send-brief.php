<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration email
$to_email = "agencewabcraft@gmail.com";
$from_email = "noreply@webcraft.com";

try {
    // Vérifier si les données sont présentes
    if (!isset($_POST['briefData'])) {
        throw new Exception("Données manquantes");
    }

    // Décoder les données du brief
    $briefData = json_decode($_POST['briefData'], true);
    if (!$briefData) {
        throw new Exception("Données brief invalides");
    }

    // Préparer le contenu de l'email
    $subject = "Nouveau Brief - " . ($briefData['projet_nom'] ?? 'Projet');
    
    $message = "
=== NOUVEAU BRIEF CLIENT ===

Client: " . ($briefData['nom'] ?? '') . "
Projet: " . ($briefData['projet_nom'] ?? '') . "
Email: " . ($briefData['email'] ?? '') . "
WhatsApp: " . ($briefData['whatsapp'] ?? '') . "

=== DÉTAILS DU PROJET ===

Activité: " . ($briefData['activite'] ?? '') . "

Objectif: " . ($briefData['objectif'] ?? '') . "

Pages souhaitées: " . (is_array($briefData['pages']) ? implode(', ', $briefData['pages']) : 'Non précisé') . "

Fonctionnalités: " . (is_array($briefData['fonctionnalites']) ? implode(', ', $briefData['fonctionnalites']) : 'Non précisé') . "

Délai souhaité: " . ($briefData['delai'] ?? '') . "

Précisions: " . ($briefData['precision'] ?? 'Aucune') . "

Fichiers joints: " . (is_array($briefData['fichiers']) ? implode(', ', $briefData['fichiers']) : 'Aucun') . "

=== INFORMATIONS SYSTÈME ===

Date de réception: " . date('d/m/Y H:i:s') . "
IP du client: " . $_SERVER['REMOTE_ADDR'] . "

---
Envoyé depuis le système de brief Webcraft
    ";

    // En-têtes email
    $headers = "From: " . $from_email . "\r\n";
    $headers .= "Reply-To: " . ($briefData['email'] ?? $from_email) . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Envoyer l'email
    if (mail($to_email, $subject, $message, $headers)) {
        // Sauvegarder en base de données
        $brief_id = saveBriefToDatabase($briefData);
        
        echo json_encode([
            'success' => true,
            'message' => 'Brief envoyé avec succès',
            'brief_id' => $brief_id
        ]);
    } else {
        throw new Exception("Erreur lors de l'envoi de l'email");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Fonction pour sauvegarder en base de données
function saveBriefToDatabase($briefData) {
    try {
        // Configuration base de données
        $host = 'localhost';
        $dbname = 'webcraft_briefs';
        $username = 'root';
        $password = '';

        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Créer la table si elle n'existe pas (avec backticks pour precision)
        $createTable = "
        CREATE TABLE IF NOT EXISTS briefs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            projet_nom VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            whatsapp VARCHAR(50),
            activite TEXT,
            objectif TEXT,
            pages TEXT,
            fonctionnalites TEXT,
            delai VARCHAR(50),
            `precision` TEXT,
            fichiers TEXT,
            date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_json JSON,
            statut ENUM('nouveau', 'en_cours', 'termine') DEFAULT 'nouveau',
            notes_admin TEXT
        )";
        $pdo->exec($createTable);

        // Insérer le brief (avec backticks pour precision)
        $sql = "INSERT INTO briefs (
            nom, projet_nom, email, whatsapp, activite, objectif, 
            pages, fonctionnalites, delai, `precision`, fichiers, 
            date_creation, data_json
        ) VALUES (
            :nom, :projet_nom, :email, :whatsapp, :activite, :objectif,
            :pages, :fonctionnalites, :delai, :precision, :fichiers,
            NOW(), :data_json
        )";

        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':nom' => $briefData['nom'] ?? '',
            ':projet_nom' => $briefData['projet_nom'] ?? '',
            ':email' => $briefData['email'] ?? '',
            ':whatsapp' => $briefData['whatsapp'] ?? '',
            ':activite' => $briefData['activite'] ?? '',
            ':objectif' => $briefData['objectif'] ?? '',
            ':pages' => is_array($briefData['pages']) ? implode(', ', $briefData['pages']) : '',
            ':fonctionnalites' => is_array($briefData['fonctionnalites']) ? implode(', ', $briefData['fonctionnalites']) : '',
            ':delai' => $briefData['delai'] ?? '',
            ':precision' => $briefData['precision'] ?? '',
            ':fichiers' => is_array($briefData['fichiers']) ? implode(', ', $briefData['fichiers']) : '',
            ':data_json' => json_encode($briefData)
        ]);

        return $pdo->lastInsertId();
    } catch (PDOException $e) {
        // Si la base de données n'est pas disponible, continuer quand même
        error_log("Erreur BDD: " . $e->getMessage());
        return null;
    }
}
?>
