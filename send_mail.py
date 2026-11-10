import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ==============================================================================
# CONFIGURATION DU SERVEUR DE MESSAGERIE (EXEMPLE AVEC GMAIL)
# ==============================================================================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
# ATTENTION : Utilisez une adresse de test créée spécifiquement pour le projet
SENDER_EMAIL = "votre_adresse@gmail.com"
# Pour Gmail, générez un "Mot de passe d'application" dans la sécurité de votre compte
SENDER_PASSWORD = "mot_de_passe_d_application" 

# Adresse de destination (votre professeur ou votre propre adresse de test)
RECIPIENT_EMAIL = "destination@gmail.com"

# ==============================================================================
# CONFIGURATION DU MESSAGE DE PHISHING
# ==============================================================================
# Votre lien généré par Ngrok
LIEN_PIEGE = "https://thousand-turtle-surcharge.ngrok-free.dev/cie-epo/index.html"

subject = "[IMPORTANT] Mise à jour requise - Club Informatique EPO"

# Le corps du message au format HTML pour masquer le lien réel derrière un texte cliquable
html_content = f"""
<html>
  <body>
    <p>Bonjour,</p>
    <p>Une mise à jour importante de la plateforme du <strong>Club Informatique de l'EPO (CIE)</strong> est actuellement en cours.</p>
    <p>Veuillez vous reconnecter dès que possible sur votre espace membre afin de valider votre adhésion pour l'année en cours et conserver vos accès aux ateliers :</p>
    <p>
      <a href="{LIEN_PIEGE}" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">
        Me connecter à l'Espace Membre
      </a>
    </p>
    <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur : {LIEN_PIEGE}</p>
    <br>
    <p>Cordialement,<br><strong>L'équipe technique du CIE</strong></p>
  </body>
</html>
"""

# ==============================================================================
# ENVOI DU MAIL
# ==============================================================================
try:
    # Création de la structure du mail Multipart (permet le format HTML)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECIPIENT_EMAIL
    
    # Attachement du contenu HTML
    msg.attach(MIMEText(html_content, "html"))

    print("[*] Connexion au serveur SMTP...")
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls() # Sécurisation de la connexion via TLS
    
    print("[*] Authentification...")
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    
    print(f"[*] Envoi du mail à {RECIPIENT_EMAIL}...")
    server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    
    print("[+] Mail envoyé avec succès !")
    server.quit()

except Exception as e:
    print(f"[-] Une erreur est survenue lors de l'envoi : {e}")
