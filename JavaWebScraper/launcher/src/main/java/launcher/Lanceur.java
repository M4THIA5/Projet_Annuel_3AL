package launcher;

import io.github.cdimascio.dotenv.Dotenv;

import javax.swing.*;
import java.awt.*;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Objects;

/**
 * Cette classe est un lanceur pour votre application, elle va rechercher si une
 * nouvelle version a été téléchargée et le cas échéant, va remplacer l'actuelle
 * par la nouvelle.
 */
public class Lanceur {
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
        String lastVersion = Updater.resolveLastVersion();
        File currentapp = new File(currentFolder + File.separator + "app-" + Updater.getUserVersion() + ".jar");
        File newVersion = new File(currentFolder + File.separator + "app-" + lastVersion + ".jar");

        JOptionPane.showMessageDialog(null, currentapp.getAbsolutePath());
        JOptionPane.showMessageDialog(null, newVersion.getAbsolutePath());
        JOptionPane.showMessageDialog(null, newVersion.exists() ? "La nouvelle version existe." : "La nouvelle version n'existe pas.");
        JOptionPane.showMessageDialog(null, "Version actuelle : " + Updater.getUserVersion());
        JOptionPane.showMessageDialog(null, !newVersion.equals(currentapp) ? "Une nouvelle version a été téléchargée." : "Aucune nouvelle version n'a été téléchargée.");


        //Si une nouvelle version a été téléchargée
        if (newVersion.exists() && !newVersion.equals(currentapp)) {
            for (File file : Objects.requireNonNull(new File(currentFolder).listFiles())) {
                if ((file.getName().startsWith("app-") && file.getName().endsWith(".jar") && !checkVersion(file.getName(), lastVersion)) ||
                        (file.getName().startsWith("cli-") && file.getName().endsWith(".jar") && !checkVersion(file.getName(), lastVersion)) ||
                        (file.getName().startsWith("common-") && file.getName().endsWith(".jar") && !checkVersion(file.getName(), lastVersion))
                ) {
                    if (!file.delete()) {
                        JOptionPane.showMessageDialog(null, "Impossible de supprimer le fichier " + file.getName());
                    }
                }
            }

            File version = new File(currentFolder + File.separator + ".version");

            if (version.exists()) {
                if (!version.delete()) {
                    JOptionPane.showMessageDialog(null, "Impossible de supprimer le fichier '.version'.");
                }
                File versionFile = new File(currentFolder + File.separator + ".version");
                BufferedWriter reader = new BufferedWriter(new FileWriter(versionFile));
                reader.write(lastVersion);
                reader.close();
            } else {
                JOptionPane.showMessageDialog(null, "Le fichier '.version' n'existe pas.");
            }

            try {
                //On lance le nouveau fichier .jar
                JOptionPane.showMessageDialog(null, "Lancement de : " + newVersion.getAbsolutePath());

                new ProcessBuilder("java", "-Dprism.order=sw", "-jar", newVersion.getAbsolutePath()).inheritIO().start();
            } catch (IOException e) {
                JOptionPane.showMessageDialog(null, e.getMessage());
                e.printStackTrace();
            }
            //S'il n'y a qu'une version courante et pas de nouvelles
        } else if (currentapp.exists()) {
            try {
                JOptionPane.showMessageDialog(null, "ALancement de : " + currentapp.getAbsolutePath());
                new ProcessBuilder("java", "-Dprism.order=sw", "-jar", currentapp.getAbsolutePath()).inheritIO().start();
            } catch (IOException e) {
                e.printStackTrace();
            }
            //Si aucun fichier n'existe
        } else {
            //On avertit d'un problème
            JOptionPane.showMessageDialog(null, "Aucun fichier jar à lancer...");
        }
    }

    private static boolean checkVersion(String name, String lastVersion) {
        String version = name
                .replace("app-", "")
                .replace("cli-", "")
                .replace("common-", "")
                .replace(".jar", "");
        return version.equals(lastVersion);
    }

    private static void checkEnvVariables() throws IOException {
        Dotenv dotenv;
        dotenv = Dotenv.configure().ignoreIfMissing().load();
        String apiKey = dotenv.get("API_KEY");
        if (apiKey == null) {
            apiKey = JOptionPane.showInputDialog("Veuillez saisir une api key créée sur : https://console.groq.com/keys");
            if (apiKey == null || apiKey.trim().isEmpty()) {
                JOptionPane.showMessageDialog(null, "Aucune API Key fournie, l'application ne peut pas démarrer.");
                System.exit(1);
            }
            BufferedWriter writer = new BufferedWriter(new FileWriter(".env"));
            writer.write("API_KEY=\"" + apiKey + "\"");
            writer.close();
        }
    }
}
