package launcher;

import io.github.cdimascio.dotenv.Dotenv;

import javax.swing.*;
import java.awt.*;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
/**
 * Cette classe est un lanceur pour votre application, elle va rechercher si une
 * nouvelle version a été téléchargée et le cas échéant, va remplacer l'actuelle
 * par la nouvelle.
 */
public class Lanceur {
    //Variables contenant les noms des fichiers à charger
    private static final String pathappCurrent = File.separator + "app-" + Updater.getUserVersion() + ".jar";
    private static final String pathappNew = File.separator + "app-" + Updater.resolveLastVersion() + ".jar";
    private static final String pathappOld = File.separator + "app-old.jar";
    private static final String pathCurrent = File.separator + "cli-" + Updater.getUserVersion() + ".jar";
    private static final String pathNew = File.separator + "cli-" + Updater.resolveLastVersion() + ".jar";
    private static final String pathOld = File.separator + "old.jar";
    //Variable contenant le nom du répértoire courant
    private static String currentFolder = System.getProperty("user.dir");

    public static void main(String[] args) throws IOException {
        checkEnvVariables();
        Updater updater = new Updater();
        //On lance la mise à jour
        try {
            updater.update();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, "Erreur lors de la mise à jour : " + e.getMessage());
        }
        if (!currentFolder.endsWith("app")) {
            currentFolder = currentFolder + File.separator + "app";
        }
        File currentapp = new File(currentFolder + pathappCurrent);
        File newVersionapp = new File(currentFolder + pathappNew);
        File oldapp = new File(currentFolder + pathappOld);
        File current = new File(currentFolder + pathCurrent);
        File newVersion = new File(currentFolder + pathNew);
        File old = new File(currentFolder + pathOld);
        System.out.println(newVersion);
        System.out.println(pathappCurrent);
        System.out.println(pathappNew);
        Desktop desktop = Desktop.getDesktop();
        //Si une nouvelle version a été téléchargée
        if (newVersionapp.exists()) {
            //On renomme la version actuelle (donc la vielle)
            current.renameTo(old);
            currentapp.renameTo(oldapp);

            //On renomme la nouvelle avec le nom de l'ancienne
            newVersion.renameTo(current);
            newVersionapp.renameTo(currentapp);

            //On supprimme l'ancienne
            old.delete();
            oldapp.delete();

            try {
                //On lance le nouveau fichier .jar
                desktop.open(currentapp);
            } catch (IOException e) {
                JOptionPane.showMessageDialog(null, e.getMessage());
                e.printStackTrace();
            }
            //S'il n'y a qu'une version courante et pas de nouvelles
        } else if (currentapp.exists()) {
            try {
                desktop.open(currentapp);
            } catch (IOException e) {
                e.printStackTrace();
            }
            //Si aucun fichier n'existe
        } else {
            //On avertit d'un problème
            JOptionPane.showMessageDialog(null, "Aucun fichier jar à lancer...");
        }
    }

    private static void checkEnvVariables() throws IOException {
        Dotenv dotenv;
        dotenv = Dotenv.configure().ignoreIfMissing().load();
        String apiKey =dotenv.get("API_KEY");
        if (apiKey == null) {
            apiKey = JOptionPane.showInputDialog("Veuillez saisir une api key créée sur : https://console.groq.com/keys");
            if (apiKey == null || apiKey.trim().isEmpty()) {
                JOptionPane.showMessageDialog(null, "Aucune API Key fournie, l'application ne peut pas démarrer.");
                System.exit(1);
            }
            BufferedWriter writer = new BufferedWriter(new FileWriter(".env"));
            writer.write("API_KEY=\""+apiKey+ "\"");
            writer.close();
        }
    }
}
