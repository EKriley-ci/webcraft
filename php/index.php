<?php
session_start();

// Vérification de l'authentification
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit;
}

// Configuration base de données
$host = 'localhost';
$dbname = 'webcraft_briefs';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupérer les briefs
    $stmt = $pdo->query("SELECT * FROM briefs ORDER BY date_creation DESC");
    $briefs = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Erreur base de données: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Webcraft Briefs</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: #01013F;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #0ACFD4;
        }
        .briefs-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #01013F;
            color: white;
        }
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status.nouveau { background: #F71B75; color: white; }
        .status.en_cours { background: #FEC133; color: black; }
        .status.termine { background: #0ACFD4; color: white; }
        .btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            font-size: 0.9em;
        }
        .btn-primary { background: #0ACFD4; color: white; }
        .btn-danger { background: #F71B75; color: white; }
        .btn:hover { opacity: 0.8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 Administration Webcraft Briefs</h1>
        <div>
            <span>Bienvenue, <?php echo $_SESSION['admin_username']; ?></span>
            <a href="logout.php" class="btn btn-danger" style="margin-left: 10px;">Déconnexion</a>
        </div>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number"><?php echo count($briefs); ?></div>
            <div>Total Briefs</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo count(array_filter($briefs, fn($b) => $b['statut'] === 'nouveau')); ?></div>
            <div>Nouveaux</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo count(array_filter($briefs, fn($b) => $b['statut'] === 'en_cours')); ?></div>
            <div>En cours</div>
        </div>
        <div class="stat-card">
            <div class="stat-number"><?php echo count(array_filter($briefs, fn($b) => $b['statut'] === 'termine')); ?></div>
            <div>Terminés</div>
        </div>
    </div>

    <div class="briefs-table">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Projet</th>
                    <th>Email</th>
                    <th>WhatsApp</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($briefs as $brief): ?>
                <tr>
                    <td><?php echo date('d/m/Y H:i', strtotime($brief['date_creation'])); ?></td>
                    <td><?php echo htmlspecialchars($brief['nom']); ?></td>
                    <td><?php echo htmlspecialchars($brief['projet_nom']); ?></td>
                    <td>
                        <a href="mailto:<?php echo htmlspecialchars($brief['email']); ?>">
                            <?php echo htmlspecialchars($brief['email']); ?>
                        </a>
                    </td>
                    <td>
                        <?php if ($brief['whatsapp']): ?>
                        <a href="https://wa.me/<?php echo str_replace(['+', ' ', '-'], '', $brief['whatsapp']); ?>" target="_blank">
                            <?php echo htmlspecialchars($brief['whatsapp']); ?>
                        </a>
                        <?php endif; ?>
                    </td>
                    <td>
                        <span class="status <?php echo $brief['statut']; ?>">
                            <?php echo ucfirst(str_replace('_', ' ', $brief['statut'])); ?>
                        </span>
                    </td>
                    <td>
                        <a href="view-brief.php?id=<?php echo $brief['id']; ?>" class="btn btn-primary">Voir</a>
                        <a href="edit-brief.php?id=<?php echo $brief['id']; ?>" class="btn btn-primary">Modifier</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
