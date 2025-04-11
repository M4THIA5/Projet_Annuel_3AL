#!/bin/bash

echo "Nettoyage des anciens builds..."
rm -rf build-jpackage
mkdir build-jpackage

echo "Compilation Maven..."
mvn clean install || { echo "Erreur Maven"; exit 1; }

echo "Fusion des targets..."

cp app/target/app-*.jar build-jpackage/

cp launcher/target/launcher-*.jar build-jpackage/

cp app/target/classes/chromedriver.exe build-jpackage/
cp app/target/classes/.version build-jpackage


echo "Lancement de jpackage..."

"C:\Program Files\Java\jdk-24\bin\jpackage" \
  --type exe \
  --name MonApp \
  --input build-jpackage \
  --main-jar launcher-1.0.2.jar \
  --main-class launcher.Lanceur \
  --resource-dir app/src/main/resources \
  --win-dir-chooser \
  --win-menu \
  --win-shortcut \
  --win-per-user-install \
  --app-version 0.2.4 || { echo "Erreur jpackage"; exit 1; }

echo "Build terminé !"
