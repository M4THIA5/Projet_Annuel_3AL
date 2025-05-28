package app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import org.kordamp.bootstrapfx.BootstrapFX;

import java.io.IOException;
import java.util.Objects;
import java.util.prefs.Preferences;

public class GUI extends Application {
    private final Preferences prefs = Preferences.userNodeForPackage(WebScrapController.class);
    private static final String THEME_KEY = "appTheme";

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(WebScrapController.class.getResource("web.fxml"));
        Scene scene = new Scene(loader.load(), 500, 600);
        stage.setTitle("Webscraper");
        WebScrapController controller = loader.getController();
//        scene.getStylesheets().add(BootstrapFX.bootstrapFXStylesheet());
        String savedTheme = prefs.get(THEME_KEY, "/app/utils/theme-light.css");
        scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource(savedTheme)).toExternalForm());
        stage.setScene(scene);
        stage.getIcons().add(new Image("icon.jpg"));
        controller.setup();
        stage.show();
    }
}
