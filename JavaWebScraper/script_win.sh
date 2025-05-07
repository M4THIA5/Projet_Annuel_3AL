#!/bin/bash
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    echo "last version is : "
    cat .lastver
    exit 1
fi
echo "Nettoyage des anciens builds..."
rm -rf build-jpackage
mkdir build-jpackage

echo "Compilation Maven..."
mvn clean install || { echo "Erreur Maven"; exit 1; }

echo "Fusion des targets..."

cp app/target/app-*.jar build-jpackage/

cp launcher/target/launcher-*.jar build-jpackage/

cp cli/target/cli-*.jar build-jpackage/

cp app/target/classes/chromedriver.exe build-jpackage/
cp app/target/classes/.version build-jpackage
cp app/target/classes/icon.jpg build-jpackage
cp app/target/classes/icon.ico build-jpackage
cp launchjava.sh build-jpackage

echo "Lancement de jpackage..."

"C:\Program Files\Java\jdk-24\bin\jpackage" \
  --type exe \
  --name MonApp \
  --input build-jpackage \
  --icon build-jpackage/icon.ico \
  --main-jar launcher-1.0.2.jar \
  --main-class launcher.Lanceur \
  --resource-dir app/src/main/resources \
  --win-dir-chooser \
  --verbose \
  --win-menu \
  --win-shortcut \
  --win-per-user-install \
  --app-version "$1" || { echo "Erreur jpackage"; exit 1; }


echo "$1" > .lastver

echo "Build terminé !"
