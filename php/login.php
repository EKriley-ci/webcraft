<?php
session_start();

// Identifiants en dur (simple et sécurisé pour commencer)
$valid_users = [
    'admin' => 'admin123',
    'webcraft' => 'webcraft2024'
];

if ($_POST) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (isset($valid_users[$username]) && $valid_users[$username] === $password) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;
        header('Location: dashboard.php');
        exit;
    } else {
        $error = "Identifiants incorrects";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Admin - Webcraft</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #01013F;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .login-form {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
            color: #01013F;
            font-size: 1.5em;
            font-weight: bold;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
        }
        input[type="text"]:focus, input[type="password"]:focus {
            outline: none;
            border-color: #0ACFD4;
        }
        .btn {
            width: 100%;
            padding: 12px;
            background: #0ACFD4;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #01013F;
        }
        .error {
            color: white;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px;
            background: #F71B75;
            border-radius: 4px;
        }
        .info {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="login-form">
        <div class="logo">🎯 Webcraft Admin</div>
        
        <?php if (isset($error)): ?>
        <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn">Se connecter</button>
        </form>

        <div class="info">
            <strong>Identifiants disponibles:</strong><br>
            👤 admin / admin123<br>
            👤 webcraft / webcraft2024
        </div>
    </div>
</body>
</html>
