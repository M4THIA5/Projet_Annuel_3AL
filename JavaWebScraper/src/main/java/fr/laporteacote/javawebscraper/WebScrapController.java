package fr.laporteacote.javawebscraper;

import fr.laporteacote.javawebscraper.utils.Loader;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.MenuItem;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCodeCombination;
import javafx.scene.input.KeyCombination;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.io.File;
import java.io.IOException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;


public class WebScrapController extends Thread {

    public static String scrappedValues;
    @FXML
    public TextField keyword;

    @FXML
    public Text errors;

    @FXML
    public TabPane tabPane;

    public static int count = 0;
    @FXML
    public MenuItem Save;
    @FXML
    public MenuItem Exit;
    @FXML
    public MenuItem Cut;
    @FXML
    public MenuItem Copy;
    @FXML
    public MenuItem Paste;
    @FXML
    public MenuItem Show;
    @FXML
    public MenuItem About;
    @FXML
    public Button btn;
    @FXML
    public Button saveBtn;
    @FXML
    public Button copyBtn;

    @FXML
    void initialize() {
    }

    public void setup() {
        // Save.setAccelerator(KeyCombination.keyCombination("Ctrl+S"));
//        Cut.setAccelerator(javafx.scene.input.KeyCombination.keyCombination("Ctrl+X"));
//        Copy.setAccelerator(javafx.scene.input.KeyCombination.keyCombination("Ctrl+C"));
//        Paste.setAccelerator(javafx.scene.input.KeyCombination.keyCombination("Ctrl+V"));

        Exit.setAccelerator(KeyCombination.keyCombination("Ctrl+Q"));
        Show.setAccelerator(KeyCombination.keyCombination("Ctrl+H"));
        About.setAccelerator(KeyCombination.keyCombination("Ctrl+A"));
        if (btn == null) {
            System.out.println("Button is null! "); // check that the btn was injected properly through your fxml
        }
        assert btn != null;
        btn.sceneProperty().addListener((observable, oldValue, newScene) -> {
            if (newScene != null) {
                newScene.getAccelerators().put(
                        KeyCodeCombination.keyCombination("Ctrl+Enter"),
                        new Runnable() {
                            @FXML
                            public void run() {
                                System.out.println("Enter KeyCodeCombination Ctrl+Enter");
                                btn.fire();
                            }
                        }
                );
            }
        });
    }

    public void click(ActionEvent mouseEvent) throws IOException, InterruptedException {
        if (keyword.getText().isEmpty()) {
            errors.setText("Au moins une valeur néessaire n'est pas remplie.");
            return;
        } else {
            errors.setText("");
        }
        WebScrapController thread = new WebScrapController();
        thread.start();
        while (thread.isAlive()) {
            //bla bla bla
            System.out.println("Waiting...");
        }
        thread.join();

        try {
            Tab tab = new Tab("Request " + count++);
            Node node = Loader.load("result.fxml");
            assert node != null;
            Text textarea = (Text) node.lookup("#text");
            textarea.setText(scrappedValues);
            tab.setContent(node);
            tabPane.getTabs().add(tab);
        } catch (Exception e) {
            errors.setText(e.getMessage());
            showError(e);
        }
    }

    @Override
    public void run() {
        System.setProperty("webdriver.chrome.driver", "src/main/java/fr/laporteacote/javawebscraper/chromedriver.exe");
        // Remplace par ton chemin ou mets dans le PATH
        // https://googlechromelabs.github.io/chrome-for-testing/#stable
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");  // Mode invisible
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        WebDriver driver = new ChromeDriver(options);
        WebScrapper webScrapper = new WebScrapper();
        try {
            String url = "https://www.google.com/search?q=" + URLEncoder.encode("test", StandardCharsets.UTF_8);
            scrappedValues = webScrapper.scrap( driver,  url, keyword.getText());
        } catch (Exception e) {
            errors.setText(e.getMessage());
            showError(e);
        }
    }

    private void showError(Exception e) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle("Error alert");
        alert.setHeaderText(e.getMessage());

        VBox dialogPaneContent = new VBox();

        Label label = new Label("Stack Trace:");

        StringBuilder stackTrace = new StringBuilder();
        for (StackTraceElement trace : e.getStackTrace()) {
            stackTrace.append(trace.toString()).append("\n");
        }

        TextArea textArea = new TextArea();
        textArea.setText(stackTrace.toString());

        dialogPaneContent.getChildren().addAll(label, textArea);

        // Set content for Dialog Pane
        alert.getDialogPane().setContent(dialogPaneContent);

        alert.showAndWait();
    }

    public void notImplemented() {
        Alert alert = new Alert(Alert.AlertType.WARNING);
        alert.setTitle("Not Implemented");
        alert.setHeaderText("Sorry ! This has not been implemented yet !");
        alert.setContentText("But it will be, shortly ! (or not...)");

        alert.showAndWait();
    }

    public void exit() {
        System.exit(0);
    }

    public void showShortcuts() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Shortcuts");

        // Header Text: null
        alert.setHeaderText(null);
        alert.setContentText("""
                Launch request : Ctrl + Enter
                Show shortcuts : Ctrl + H
                Show about : Ctrl + A
                Exit : Ctrl + Q""");

        alert.showAndWait();
    }

    public void showAbout() {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("About");
        // Header Text: null
        alert.setHeaderText(null);
        alert.setContentText(" JAVA Application created by the team of Laporte à Côté\n Version 0.1");

        alert.showAndWait();
    }

    public void saveValueClipBoard(MouseEvent mouseEvent) {
        System.out.println("Save value");
        Clipboard board = Toolkit.getDefaultToolkit().getSystemClipboard();


    }

    public void saveInFile(MouseEvent mouseEvent) {
        System.out.println("Save value");
        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            // save to file

        }
    }


}
