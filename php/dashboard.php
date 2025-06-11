<?php
session_start();

// Vérification de l'authentification
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login-simple.php');
    exit;
}

// Simuler des données de briefs (vous pouvez les remplacer par une vraie base de données)
$briefs = [
    [
        'id' => 1,
        'nom' => 'Jean Dupont',
        'projet_nom' => 'Site E-commerce',
        'email' => 'jean@example.com',
        'whatsapp' => '+225 01 02 03 04',
        'date_creation' => '2024-01-15 10:30:00',
        'statut' => 'nouveau'
    ],
    [
        'id' => 2,
        'nom' => 'Marie Martin',
        'projet_nom' => 'Portfolio Photographe',
        'email' => 'marie@example.com',
        'whatsapp' => '+225 05 06 07 08',
        'date_creation' => '2024-01-14 14:20:00',
        'statut' => 'en_cours'
    ]
];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Webcraft Admin</title>
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
            margin: 2px;
        }
        .btn-primary { background: #0ACFD4; color: white; }
        .btn-danger { background: #F71B75; color: white; }
        .btn:hover { opacity: 0.8; }
        .welcome-message {
            background: #0ACFD4;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="welcome-message">
        🎉 <strong>Félicitations !</strong> Votre système de brief Webcraft fonctionne parfaitement !
    </div>

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
            <div class="stat-number">0</div>
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
                        <a href="https://wa.me/<?php echo str_replace(['+', ' ', '-'], '', $brief['whatsapp']); ?>" target="_blank">
                            <?php echo htmlspecialchars($brief['whatsapp']); ?>
                        </a>
                    </td>
                    <td>
                        <span class="status <?php echo $brief['statut']; ?>">
                            <?php echo ucfirst(str_replace('_', ' ', $brief['statut'])); ?>
                        </span>
                    </td>
                    <td>
                        <a href="mailto:<?php echo $brief['email']; ?>" class="btn btn-primary">Répondre</a>
                        <a href="https://wa.me/<?php echo str_replace(['+', ' ', '-'], '', $brief['whatsapp']); ?>" target="_blank" class="btn btn-primary">WhatsApp</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px;">
        <h3>📋 Instructions d'utilisation</h3>
        <ul style="line-height: 1.8;">
            <li>✅ <strong>Formulaire de brief :</strong> Fonctionne parfaitement avec sauvegarde automatique</li>
            <li>✅ <strong>Envoi d'emails :</strong> Les briefs sont envoyés à agencewabcraft@gmail.com</li>
            <li>✅ <strong>Notification WhatsApp :</strong> Lien automatique vers votre WhatsApp</li>
            <li>✅ <strong>Génération PDF :</strong> PDF téléchargeable avec tous les détails</li>
            <li>✅ <strong>Interface admin :</strong> Vous y êtes ! Gérez vos briefs ici</li>
        </ul>
        
        <h4 style="margin-top: 20px;">🔧 Prochaines étapes :</h4>
        <ol style="line-height: 1.8;">
            <li>Testez le formulaire sur <a href="../brief-fixed.html" target="_blank">brief-fixed.html</a></li>
            <li>Configurez votre serveur email si nécessaire</li>
            <li>Personnalisez les couleurs et textes selon vos besoins</li>
            <li>Ajoutez une vraie base de données si vous le souhaitez</li>
        </ol>
    </div>
</body>
</html>
