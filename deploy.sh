#!/bin/bash

# Configuration
FTP_HOST="$1"
FTP_USER="$2"
FTP_PASS="$3"
REMOTE_DIR="$4"

# Build the project
echo "Building project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Create a temporary file for FTP commands
TMPFILE=$(mktemp)

# Write FTP commands
cat << EOF > $TMPFILE
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_DIR
mput dist/*
bye
EOF

# Upload files using FTP
echo "Uploading files to $FTP_HOST..."
ftp -n < $TMPFILE

# Clean up
rm $TMPFILE

echo "Deployment complete!"