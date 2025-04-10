package fr.laporteacote.javawebscraper.utils;

import fr.laporteacote.javawebscraper.Main;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;

import java.io.IOException;

public class Loader {

    public static Node load(String fileName) {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(Main.class.getResource(fileName));
            return fxmlLoader.load();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


}
