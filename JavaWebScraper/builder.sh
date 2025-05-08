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
