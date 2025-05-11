package launcher;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.swing.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;

/**
 * Cette classe permet de faire une mise à jour de votre application
 */
public class Updater {

    private static final String url = "http://devapi.freeboxos.fr/java/versions.json";

    //Variable contenant le nom du répértoire courant
    private static String currentFolder = System.getProperty("user.dir");

    public static String resolveLastVersion() {
        ArrayList<String> versions = getVersions();
        return versions.getLast();
    }

    /**
     * Cette méthode permet de mettre à jour votre programme, elle va chercher
     * sur internet la dernière version disponible et effectue la mise à jour
     * selon le consentement de l'utilisateur.
     */
    public void update() throws IOException, URISyntaxException {
        ArrayList<String> versions = getVersions();
        //Version actuelle
        String version = getUserVersion();
        System.out.println("version =" + version);
        //Si la version est nulle
        if (versions.isEmpty()) {
            JOptionPane.showMessageDialog(null, "Impossible de se connecter au service, vérifiez votre " +
                    "connection internet");
        } else {
            //Si la dernière version n'est pas la même que l'actuelle
            if (!versions.getLast().equals(version)) {
                //                String versionChoisie = (String) JOptionPane.showInputDialog(null, "Choississez la version à installer", "Versions disponibles", JOptionPane.QUESTION_MESSAGE,
                //                        null, versions.toArray(), versions.get(versions.size() - 1));
                //                //S'il veut la télécharger
                //                installChosenVersion(versionChoisie);
                installLastVersion(versions);
            } else {
                JOptionPane.showMessageDialog(null, "Pas de nouvelles version disponible pour le moment");
            }
        }
    }

    private void installLastVersion(ArrayList<String> versions) throws IOException, URISyntaxException {
        installChosenVersion(versions.getLast());
    }

    private void installChosenVersion(String versionChoisie) throws IOException, URISyntaxException {
        if (!versionChoisie.isEmpty()) {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(new URI(url).toURL());

            // On liste toutes les versions
            JsonNode versionsNode = rootNode.get("versions");

            // On parcourt toutes les versions
            for (JsonNode versionNode : versionsNode) {
                String nom = versionNode.get("nom").asText();

                // Si c'est la bonne version, on télécharge tous ses fichiers
                if (nom.equals(versionChoisie)) {
                    JsonNode filesNode = versionNode.get("files");
                    if (!currentFolder.endsWith("app")) {
                        currentFolder = currentFolder + File.separator + "app";
                    }
                    // On liste tous les fichiers d'une version
                    for (JsonNode fileNode : filesNode) {
                        // On télécharge le fichier
                        downloadFile(fileNode.get("url").asText(), currentFolder +
                                File.separator + fileNode.get("destination").asText());
                    }
                    if (!currentFolder.endsWith("app")) {
                        currentFolder = currentFolder + File.separator + "app";
                    }
                    File versionFile = new File(currentFolder + File.separator + ".version");
                        BufferedWriter reader = new BufferedWriter(new FileWriter(versionFile));
                        reader.write(versionChoisie);
                        reader.close();
                    break;
                }
            }
            JOptionPane.showMessageDialog(null, "La nouvelle version a été téléchargée, " +
                    "le programme va être relancé");

//            try {
//
//                lanceurPath = currentFolder + "app-0.0.15.jar";
//                //On lance le lanceur
//                new ProcessBuilder("java", "-jar", lanceurPath).start();
//
//                //On quitte le programme
//                System.exit(0);
//            } catch (IOException e) {
//                JOptionPane.showMessageDialog(null, "Impossible de relancer le programme");
//            }
        }
    }

    public static String getUserVersion() {
        try {
            if (!currentFolder.endsWith("app")) {
                currentFolder = currentFolder + File.separator + "app";
            }
            File versionFile = new File(currentFolder + File.separator + ".version");
            if (versionFile.exists()) {
                BufferedReader reader = new BufferedReader(new FileReader(versionFile));
                String version = reader.readLine();
                reader.close();
                return version;
            } else {
                // Si le fichier n'existe pas, on retourne une valeur par défaut
                return "Unknown";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Unknown";
        }
    }

    /**
     * Cette méthode va chercher sur internet les versions disponibles pour l'application
     *
     * @return les versions disponibles
     */
    private static ArrayList<String> getVersions() {
        ArrayList<String> versions = new ArrayList<>();

        try {
            JsonNode rootNode = getJsonNode();

            // On liste toutes les versions
            JsonNode versionsNode = rootNode.get("versions");

            // On parcourt toutes les versions
            for (JsonNode versionNode : versionsNode) {
                String nom = versionNode.get("nom").asText();
                versions.add(nom);
            }

            //On trie la liste
            Collections.sort(versions);

        } catch (IOException e) {
            JOptionPane.showMessageDialog(null, e.getMessage());
            e.printStackTrace();
            versions.add("Unknown");
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }

        return versions;
    }

    private static JsonNode getJsonNode() throws URISyntaxException, IOException {
        URL xmlUrl = new URI(url).toURL();
        //On ouvre une connexion sur la page
        URLConnection urlConnection = xmlUrl.openConnection();
        urlConnection.setUseCaches(false);

        //On se connecte sur cette page
        urlConnection.connect();

        //On récupère le fichier XML sous forme de flux
        BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String responseLine;
        while ((responseLine = br.readLine()) != null) {
            response.append(responseLine.trim());
        }

        String jsonResponse = response.toString();
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readTree(jsonResponse);
    }

    /**
     * Cette méthode télécharge un fichier sur internet et le stocke en local
     *
     * @param filePath,    chemin du fichier à télécharger
     * @param destination, chemin du fichier en local
     */
    private void downloadFile(String filePath, String destination) {
        URLConnection connection;
        InputStream is = null;
        FileOutputStream destinationFile = null;

        try {
            //On crée l'URL
            URL url = new URI(filePath).toURL();

            //On crée une connection vers cet URL
            connection = url.openConnection();

            //On récupère la taille du fichier
            int length = connection.getContentLength();

            //Si le fichier est inexistant, on lance une exception
            if (length == -1) {
                throw new IOException("Fichier vide");
            }

            //On récupère le stream du fichier
            is = new BufferedInputStream(connection.getInputStream());

            //On prépare le tableau de bits pour les données du fichier
            byte[] data = new byte[length];

            //On déclare les variables pour se retrouver dans la lecture du fichier
            int currentBit = 0;
            int deplacement = 0;

            //Tant que l'on n'est pas à la fin du fichier, on récupère des données
            while (deplacement < length) {
                currentBit = is.read(data, deplacement, data.length - deplacement);
                if (currentBit == -1) break;
                deplacement += currentBit;
            }

            //Si on est pas arrivé à la fin du fichier, on lance une exception
            if (deplacement != length) {
                throw new IOException("Le fichier n'a pas été lu en entier (seulement "
                        + deplacement + " sur " + length + ")");
            }

            //On crée un stream sortant vers la destination
            destinationFile = new FileOutputStream(destination);

            //On écrit les données du fichier dans ce stream
            destinationFile.write(data);

            //On vide le tampon et on ferme le stream
            destinationFile.flush();

        } catch (MalformedURLException e) {
            System.err.println("Problème avec l'URL : " + filePath);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (is != null) {
                    is.close();
                }
                if (destinationFile != null) {
                    destinationFile.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
