package launcher;

import java.io.*;
import javax.swing.JOptionPane;
import java.awt.Desktop;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Cette classe est un lanceur pour votre application, elle va rechercher si une
 * nouvelle version a été téléchargée et le cas échéant, va remplacer l'actuelle
 * par la nouvelle.
 */
public class Lanceur {
    //Variables contenant les noms des fichiers à charger
    private static final String pathCurrent = File.separator + "app-"+Updater.getUserVersion()+".jar";
    private static final String pathNew = File.separator + "app-"+ Updater.resolveLastVersion()+".jar";
    private static final String pathOld = File.separator + "old.jar";

    //Variable contenant le nom du répértoire courant
    private static String currentFolder = System.getProperty("user.dir");

    public static void main(String[] args) throws URISyntaxException {
        Updater updater = new Updater();
        //On lance la mise à jour
        try {
            updater.update();
        } catch (Exception e) {
            e.printStackTrace();
        }
        Path currentPath = Paths.get(Lanceur.class.getProtectionDomain().getCodeSource().getLocation().toURI()).getParent();
        Path jarPath = currentPath.resolve(Updater.getUserVersion());
        if (!currentFolder.endsWith("app")) {
            currentFolder = currentFolder + File.separator + "app";
        }
        File current = new File(currentFolder + pathCurrent);
        File newVersion = new File(currentFolder + pathNew);
        File old = new File(currentFolder + pathOld);
        String variables = """
                "currentFolder = %s
                pathCurrent = %s
                pathNew = %s
                pathOld = %s
                currentPath = %s
                jarPath = %s
                current = %s
                new =%s
                old =%s""".formatted(currentFolder, pathCurrent, pathNew, pathOld, currentPath, jarPath, current, newVersion, old);
        JOptionPane.showMessageDialog(null, variables);
        Desktop desktop = Desktop.getDesktop();
        //Si une nouvelle version a été téléchargée
        if (newVersion.exists()) {
            //On renomme la version actuelle (donc la vielle)
            current.renameTo(old);

            //On renomme la nouvelle avec le nom de l'ancienne
            newVersion.renameTo(current);

            //On supprimme l'ancienne
            old.delete();

            try {
                //On lance le nouveau fichier .jar
                new ProcessBuilder("java", "-jar", pathCurrent).start();
                desktop.open(newVersion);


            } catch (IOException e) {
                JOptionPane.showMessageDialog(null, e.getMessage());
                e.printStackTrace();
            }
            //S'il n'y a qu'une version courante et pas de nouvelles
        } else if (current.exists()) {
            try {
                desktop.open(current);
            } catch (IOException e) {
                e.printStackTrace();
            }
            //Si aucun fichier n'existe
        } else {
            //On avertit d'un problème
            JOptionPane.showMessageDialog(null, "Aucun fichier jar à lancer...");
        }
    }
}
