#!/bin/bash

# Configuration IONOS
FTP_HOST="home175770572.1and1-data.host"
FTP_USER="acc104437769"
FTP_PASS="Eruditio2013@!"
REMOTE_DIR="/collabspace"

# Construction du projet
echo "🏗️  Construction du projet..."
npm run build

# Vérification de la construction
if [ $? -ne 0 ]; then
    echo "❌ Échec de la construction!"
    exit 1
fi

# Création d'un fichier temporaire pour les commandes FTP
TMPFILE=$(mktemp)

# Écriture des commandes FTP
cat << EOF > $TMPFILE
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_DIR

# Création des dossiers nécessaires
mkdir -p assets
mkdir -p css
mkdir -p js

# Nettoyage des anciens fichiers
cd assets
mdelete *
cd ..
mdelete index.html

# Upload des nouveaux fichiers
cd assets
mput dist/assets/*
cd ..
put dist/index.html
put public/.htaccess

bye
EOF

# Téléchargement des fichiers via FTP
echo "📤 Téléchargement des fichiers vers $FTP_HOST..."
ftp -n < $TMPFILE

# Nettoyage
rm $TMPFILE

echo "✅ Déploiement terminé!"