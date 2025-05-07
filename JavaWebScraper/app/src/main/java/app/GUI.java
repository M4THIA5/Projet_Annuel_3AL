package app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import org.kordamp.bootstrapfx.BootstrapFX;

import java.io.IOException;

public class GUI extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(WebScrapController.class.getResource("web.fxml"));
        Scene scene = new Scene( loader.load(), 500, 600);
        stage.setTitle("Webscraper");
        WebScrapController controller = loader.getController();
        scene.getStylesheets().add(BootstrapFX.bootstrapFXStylesheet());
        stage.setScene(scene);
        stage.getIcons().add(new Image("icon.jpg"));
        controller.setup();
        stage.show();
    }
}
