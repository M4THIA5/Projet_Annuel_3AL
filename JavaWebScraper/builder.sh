#!/bin/bash
echo "Nettoyage des anciens builds..."
rm -rf build-jpackage
mkdir build-jpackage

echo "Compilation Maven..."
mvn clean package -P windows || { echo "Erreur Maven"; exit 1; }

echo "Fusion des targets..."

cp app/target/app-*.jar build-jpackage/

cp launcher/target/launcher-*.jar build-jpackage/

cp cli/target/cli-*.jar build-jpackage/

cp common/target/common-*.jar build-jpackage/


curl -L -o chrome-win64.zip "https://storage.googleapis.com/chrome-for-testing-public/136.0.7103.92/win64/chrome-win64.zip"
unzip -o chrome-win64.zip
cp chrome-win64/chrome.exe build-jpackage/chromedriver.exe
cp app/target/classes/.version build-jpackage
cp app/target/classes/icon.jpg build-jpackage
cp app/target/classes/icon.ico build-jpackage
cp launchjava.sh build-jpackage
