package fr.laporteacote.javawebscraper;

import fr.laporteacote.javawebscraper.utils.Loader;
import fr.laporteacote.javawebscraper.utils.RingProgressIndicator;
import javafx.application.Platform;
import javafx.concurrent.Task;
import javafx.event.ActionEvent;
import javafx.event.Event;
import javafx.fxml.FXML;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
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
import javafx.geometry.Insets;

import javafx.stage.Modality;
import javafx.stage.Stage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.io.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static launcher.Updater.getUserVersion;


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

    public TextArea textarea;

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

    public void click(ActionEvent mouseEvent) throws InterruptedException {
        if (keyword.getText().isEmpty()) {
            errors.setText("Au moins une valeur néessaire n'est pas remplie.");
            return;
        }
        errors.setText("");

        Task<Void> task = new Task<>() {
            @Override
            protected Void call() throws IOException {
                setupChromeDriver();
                updateProgress(0, 100);
                // Remplace par ton chemin ou mets dans le PATH
                // https://googlechromelabs.github.io/chrome-for-testing/#stable
                ChromeOptions options = new ChromeOptions();
                options.addArguments("--headless");  // Mode invisible
                options.addArguments("--disable-blink-features=AutomationControlled");
                options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                WebDriver driver = new ChromeDriver(options);
                WebScrapper webScrapper = new WebScrapper();
                try {
                    String url = "https://www.google.com/search?q=" + URLEncoder.encode(keyword.getText(), StandardCharsets.UTF_8);
                    scrappedValues = webScrapper.scrap(driver, url, keyword.getText(), this::updateProgress);
                    sleep(2000);
                    updateProgress(100, 100);
                } catch (Exception e) {
                    Platform.runLater(() -> {
                        errors.setText(e.getMessage());
                        showError(e);
                    });
                } finally {
                    driver.quit();
                }
                return null;
            }
        };
        Stage loading = createLoadingPopup(task);

        task.setOnRunning(e -> loading.show());
        task.setOnSucceeded(e -> {
            loading.close();
            try {
                Tab tab = new Tab("Request " + ++count +" : " + keyword.getText());
                Node node = Loader.load("result.fxml");
                assert node != null;
                textarea = (TextArea) node.lookup("#text");
                textarea.setText(scrappedValues);
                textarea.setEditable(false);
                tab.setContent(node);
                tabPane.getTabs().add(tab);
            } catch (Exception ex) {
                errors.setText(ex.getMessage());
                showError(ex);
            }
        });

        task.setOnFailed(e -> {
            loading.close();
            errors.setText("Erreur : " + task.getException().getMessage());
            showError(task.getException());
        });

        Thread thread = new Thread(task);
        thread.setDaemon(true);
        thread.start();
    }


    private void setupChromeDriver() throws IOException {
        // Récupérer l'URL du chromedriver dans le .jar
        InputStream chromedriverStream = WebScrapController.class.getClassLoader().getResourceAsStream("chromedriver.exe");

        if (chromedriverStream == null) {
            throw new IOException("chromedriver.exe n'a pas été trouvé dans le .jar");
        }

        // Créer un fichier temporaire pour stocker chromedriver
        File tempFile = new File(System.getProperty("java.io.tmpdir"), "chromedriver.exe");

        // Copier le fichier du .jar vers le fichier temporaire
        try (OutputStream outputStream = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = chromedriverStream.read(buffer)) > 0) {
                outputStream.write(buffer, 0, length);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Définir la propriété pour le WebDriver
        System.setProperty("webdriver.chrome.driver", tempFile.getAbsolutePath());

        // Pour s'assurer que le fichier est exécutable
        tempFile.setExecutable(true);
    }


    private void showError(Throwable e) {
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
        alert.setContentText(" JAVA Application created by the team of Laporte à Côté\n Version "+ getUserVersion());

        alert.showAndWait();
    }

    public void saveValueClipBoard(MouseEvent mouseEvent) {
        System.out.println("Save value");
        String str = textarea != null ? textarea.getText() : "jdfr";
        Clipboard clip = Toolkit.getDefaultToolkit()
                .getSystemClipboard();
        StringSelection strse1 = new StringSelection(str);
        clip.setContents(strse1, strse1);
        JOptionPane.showMessageDialog(null,
                "TEXTS ARE COPIED!");
        Clipboard board = Toolkit.getDefaultToolkit().getSystemClipboard();


    }

    public void saveInFile(MouseEvent mouseEvent) throws IOException {
        System.out.println("Save value");
        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            String str = textarea != null ? textarea.getText() : "jdfr";
            FileOutputStream outputStream = new FileOutputStream(file+".txt");
            byte[] strToBytes = str.getBytes();
            outputStream.write(strToBytes);

            outputStream.close();
        }
    }

    public Stage createLoadingPopup(Task<?> task) {
        Stage dialog = new Stage();
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setResizable(false);
        dialog.setOnCloseRequest(event -> {
        });
        RingProgressIndicator ringProgressIndicator = new RingProgressIndicator();
        ringProgressIndicator.setRingWidth(200);
        ringProgressIndicator.makeIndeterminate();

        task.progressProperty().addListener((obs, oldProgress, newProgress) -> {
             ringProgressIndicator.setProgress((int) (newProgress.doubleValue()*100));
        });


        VBox box = new VBox(ringProgressIndicator, new Label("Chargement en cours..."));
        box.setAlignment(Pos.CENTER);
        box.setPadding(new Insets(20, 0, 0, 0));
        dialog.setOnCloseRequest(Event::consume);


        dialog.setScene(new Scene(box, 400, 300));
        return dialog;
    }
}
