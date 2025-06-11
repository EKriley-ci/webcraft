# 🚀 GUIDE COMPLET D'INSTALLATION - WEBCRAFT BRIEF SYSTEM

## 📋 ÉTAPE 1: INSTALLER XAMPP (Serveur local)

### 1.1 Télécharger XAMPP
- Allez sur: https://www.apachefriends.org/
- Téléchargez XAMPP pour Windows
- Installez-le dans `C:\xampp`

### 1.2 Démarrer les services
- Ouvrez XAMPP Control Panel
- Démarrez **Apache** (serveur web)
- Démarrez **MySQL** (base de données)

## 📁 ÉTAPE 2: ORGANISER VOS FICHIERS

### 2.1 Structure des dossiers
Créez cette structure dans `C:\xampp\htdocs\webcraft\`:

\`\`\`
webcraft/
├── index.html
├── brief.html
├── css/
│   └── style.css
├── js/
│   └── brief.js
├── php/
│   └── send-brief.php
├── admin/
│   ├── login.php
│   ├── dashboard.php
│   ├── logout.php
│   └── index.php
├── assets/
│   ├── logo.png
│   └── icon.png
└── database.sql
\`\`\`

### 2.2 Copier vos fichiers
- Copiez TOUS vos fichiers dans `C:\xampp\htdocs\webcraft\`
- Respectez exactement la structure ci-dessus

## 🗄️ ÉTAPE 3: CONFIGURER LA BASE DE DONNÉES

### 3.1 Accéder à phpMyAdmin
- Ouvrez votre navigateur
- Allez sur: http://localhost/phpmyadmin
- Connectez-vous (pas de mot de passe par défaut)

### 3.2 Créer la base de données
- Cliquez sur "Nouvelle base de données"
- Nom: `webcraft_briefs`
- Cliquez "Créer"

### 3.3 Importer les tables
- Sélectionnez la base `webcraft_briefs`
- Cliquez sur "Importer"
- Sélectionnez votre fichier `database.sql`
- Cliquez "Exécuter"

## 🌐 ÉTAPE 4: TESTER VOTRE SITE

### 4.1 Accéder au site
- Ouvrez: http://localhost/webcraft/
- Vous devriez voir votre page d'accueil

### 4.2 Tester le formulaire
- Cliquez sur "Okay !" pour aller au brief
- Remplissez le questionnaire
- Testez l'envoi

### 4.3 Tester l'admin
- Allez sur: http://localhost/webcraft/admin/login.php
- Utilisateur: admin
- Mot de passe: admin123

## ⚙️ ÉTAPE 5: CONFIGURATION EMAIL (Optionnel)

Pour que les emails fonctionnent, modifiez dans `php/send-brief.php`:
- Ligne 7: Votre email de destination
- Ligne 8: Votre domaine

## 🔧 DÉPANNAGE

### Problème: "Page non trouvée"
- Vérifiez que XAMPP Apache est démarré
- Vérifiez que vos fichiers sont dans `C:\xampp\htdocs\webcraft\`

### Problème: "Erreur base de données"
- Vérifiez que XAMPP MySQL est démarré
- Vérifiez que la base `webcraft_briefs` existe

### Problème: "Questionnaire ne s'affiche pas"
- Vérifiez que le fichier `js/brief.js` existe
- Ouvrez la console du navigateur (F12) pour voir les erreurs
