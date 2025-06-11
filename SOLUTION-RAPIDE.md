# 🚨 SOLUTION RAPIDE - Erreur Base de Données

## ❌ PROBLÈME IDENTIFIÉ
Le mot `precision` est un mot-clé réservé en MySQL et doit être entouré de backticks (`).

## ✅ SOLUTION EN 3 ÉTAPES

### ÉTAPE 1: Supprimer l'ancienne base (si elle existe)
1. Allez sur http://localhost/phpmyadmin
2. Cliquez sur la base `webcraft_briefs` (si elle existe)
3. Cliquez sur "Supprimer" pour la supprimer complètement

### ÉTAPE 2: Importer le nouveau script
1. Cliquez sur "Nouvelle base de données"
2. Nom: `webcraft_briefs`
3. Cliquez "Créer"
4. Sélectionnez la base `webcraft_briefs`
5. Cliquez sur "Importer"
6. Sélectionnez le fichier `database-CORRIGE.sql`
7. Cliquez "Exécuter"

### ÉTAPE 3: Remplacer le fichier PHP
1. Remplacez `php/send-brief.php` par `php/send-brief-CORRIGE.php`
2. Ou copiez le contenu du fichier corrigé

## 🎯 VÉRIFICATION
- ✅ Base de données créée sans erreur
- ✅ Tables `briefs` et `admins` créées
- ✅ Admin par défaut ajouté (admin/admin123)

## 🚀 TESTER MAINTENANT
1. Site: http://localhost/webcraft/
2. Admin: http://localhost/webcraft/admin/login.php
3. Formulaire: http://localhost/webcraft/brief-CORRIGE.html
