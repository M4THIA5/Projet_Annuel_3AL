package app;

import app.utils.Loader;
import pa.common.Context;
import pa.common.PluginService;
import pa.common.RingProgressIndicator;
import javafx.application.Platform;
import javafx.concurrent.Task;
import javafx.event.Event;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.MenuItem;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.*;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.geometry.Insets;

import javafx.stage.Modality;
import javafx.stage.Stage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

import cli.WebScrapper;
import org.pf4j.PluginManager;
import pa.common.LoadingPopupCustomizer;

import static launcher.Updater.getUserVersion;

import java.util.prefs.Preferences;


public class WebScrapController extends Thread {

    private final Preferences prefs = Preferences.userNodeForPackage(WebScrapController.class);
    private static final String THEME_KEY = "appTheme";

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
    public Menu options;
    @FXML
    public TextArea textarea;
    public Button saveBt;
    public Button copyBt;
    @FXML
    public MenuItem changeThemeItem;
    @FXML
    public VBox baseVBOX;
    Context currentContext = Context.getInstance();


    @FXML
    void initialize() {
        changeThemeItem.setOnAction(evt -> showThemeDialog());
        baseVBOX.setOnDragOver(event -> {
            if (event.getGestureSource() != baseVBOX && event.getDragboard().hasFiles()) {
                /* allow for both copying and moving, whatever user chooses */
                event.acceptTransferModes(TransferMode.COPY_OR_MOVE);
            }
            event.consume();
        });

        baseVBOX.setOnDragDropped(event -> {
            Dragboard db = event.getDragboard();
            boolean success = false;
            if (db.hasFiles()) {
                success = true;
                File file = db.getFiles().getFirst();
                PluginService pluginService = currentContext.getPluginService();
                if (file.getName().endsWith(".jar")) {
                    if (file.getName().contains("history")) {
                        pluginService.loadPlugin(file.toPath(), options, currentContext, tabPane);
                    } else if (file.getName().contains("mastermind")) {
                        pluginService.loadPlugin(file.toPath(), options);
                    } else {
                        pluginService.loadPlugin(file.toPath());
                    }
                } else {
                    showError(new Throwable("Fichier non supporté !"));
                }
            }
            /* let the source know whether the string was successfully
             * transferred and used */
            event.setDropCompleted(success);

            event.consume();
        });

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
        btn.sceneProperty().addListener((obs, scene, newScene) -> {
            if (newScene != null) {
                newScene.getAccelerators().put(KeyCodeCombination.keyCombination("Ctrl+Enter"), new Runnable() {
                    @FXML
                    public void run() {
                        System.out.println("Enter KeyCodeCombination Ctrl+Enter");
                        btn.fire();
                    }
                });
            }
        });
    }

    public void click() {
        if (keyword.getText().isEmpty()) {
            errors.setText("Au moins une valeur néessaire n'est pas remplie.");
            return;
        }
        errors.setText("");
        final String[] scrappedValues = new String[1];

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
                options.addArguments("--dns-prefetch-disable");
                options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                WebDriver driver = new ChromeDriver(options);
                WebScrapper webScrapper = new WebScrapper();
                try {
                    String url = "https://www.google.com/search?q=" + URLEncoder.encode(keyword.getText(), StandardCharsets.UTF_8);
                    scrappedValues[0] = webScrapper.scrap(driver, url, keyword.getText(), this::updateProgress);
                    currentContext.addRequest(keyword.getText(), scrappedValues[0]);
                    System.out.println("added. len : " + currentContext.getRequests().size());
                    sleep(3000);
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
        Stage loading = createLoadingPopup(task, keyword.getText());

        task.setOnRunning(evt -> loading.show());
        task.setOnSucceeded(evt -> {
            loading.close();
            try {
                Tab tab = new Tab("Request " + ++count + " : " + keyword.getText());
                Node node = Loader.load("result.fxml");
                assert node != null;
                textarea = (TextArea) node.lookup("#text");
                textarea.setText(scrappedValues[0]);
                textarea.setEditable(false);
                saveBt = (Button) node.lookup("#copyBtn");
                copyBt = (Button) node.lookup("#saveBtn");
                saveBt.setId("copyBtn" + keyword.getText());
                copyBt.setId("saveBtn" + keyword.getText());
                tab.setContent(node);
                tabPane.getTabs().add(tab);
            } catch (Exception ex) {
                errors.setText(ex.getMessage());
                showError(ex);
            }
        });

        task.setOnFailed(evt -> {
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

    private void showThemeDialog() {
        Dialog<String> dialog = new Dialog<>();
        dialog.setTitle("Choisir un thème");
        dialog.setHeaderText("Sélectionnez un thème pour l'application");

        // Boutons
        ButtonType applyButtonType = new ButtonType("Appliquer", ButtonBar.ButtonData.OK_DONE);
        dialog.getDialogPane().getButtonTypes().addAll(applyButtonType, ButtonType.CANCEL);

        // Thèmes disponibles
        ToggleGroup group = new ToggleGroup();

        VBox content = new VBox(10);
        content.setPadding(new Insets(10));

        // Liste des thèmes
        Map<String, String> themeMap = Map.of("Clair", "/app/utils/theme-light.css", "Sombre", "/app/utils/theme-dark.css", "Bleu", "/app/utils/theme-blue.css", "Vert", "/app/utils/theme-green.css", "Sepia", "/app/utils/theme-sepia.css", "Rose", "/app/utils/theme-pink.css", "Contrasté", "/app/utils/theme-high-contrast.css", "Terminal", "/app/utils/theme-terminal.css");

        for (String label : themeMap.keySet()) {
            RadioButton rb = new RadioButton(label);
            rb.setToggleGroup(group);
            content.getChildren().add(rb);
        }

        dialog.getDialogPane().setContent(content);

        // Résultat du choix
        dialog.setResultConverter(dialogButton -> {
            if (dialogButton == applyButtonType) {
                RadioButton selected = (RadioButton) group.getSelectedToggle();
                return selected != null ? selected.getText() : null;
            }
            return null;
        });

        Optional<String> result = dialog.showAndWait();
        result.ifPresent(themeLabel -> {
            String cssFile = themeMap.get(themeLabel);
            if (cssFile != null) {
                applyTheme(cssFile);
                prefs.put(THEME_KEY, cssFile);
            }
        });
    }

    private void applyTheme(String theme) {
        Scene scene = changeThemeItem.getParentPopup().getOwnerWindow().getScene();
        scene.getStylesheets().clear();
        scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource(theme)).toExternalForm());
    }

    @FXML
    private void showPlugins() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("plugins.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = new Stage();
            stage.setTitle("Manage Plugins");
            stage.setScene(scene);
            stage.show();
        } catch (IOException e) {
            e.printStackTrace();
        }
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
        alert.setContentText(" JAVA Application created by the team of Laporte à Côté\n Version " + getUserVersion());

        alert.showAndWait();
    }

    public Stage createLoadingPopup(Task<?> task, String keywords) {
        PluginManager pluginManager = currentContext.getPluginService().getPluginManager();
        List<LoadingPopupCustomizer> customizers = pluginManager.getExtensions(LoadingPopupCustomizer.class);
        System.out.println("Found customizers: " + customizers);

        if (!customizers.isEmpty()) {
            return customizers.getFirst().createLoadingPopup(task, keywords);
        }

        Stage dialog = new Stage();
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setResizable(false);
        dialog.setOnCloseRequest(evt -> {
        });
        RingProgressIndicator ringProgressIndicator = new RingProgressIndicator();
        ringProgressIndicator.setRingWidth(200);
        ringProgressIndicator.makeIndeterminate();

        task.progressProperty().addListener((obs, progress, newProgress) -> ringProgressIndicator.setProgress((int) (newProgress.doubleValue() * 100)));


        VBox box = new VBox(ringProgressIndicator, new Label("Chargement en cours..."));
        box.setAlignment(Pos.CENTER);
        box.setPadding(new Insets(20, 0, 0, 0));
        dialog.setOnCloseRequest(Event::consume);


        dialog.setScene(new Scene(box, 400, 300));
        return dialog;
    }
}
