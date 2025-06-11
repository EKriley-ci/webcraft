<?php
session_start();
session_destroy();
header('Location: login-simple.php');
exit;
?>
