package pa.gifplugin;

import pa.common.RingProgressIndicator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import javafx.concurrent.Task;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;
import javafx.stage.Modality;
import javafx.stage.Stage;
import org.pf4j.Extension;
import pa.common.LoadingPopupCustomizer;

import javafx.scene.image.ImageView;
import java.nio.charset.StandardCharsets;


@Extension
public class GifExtension implements LoadingPopupCustomizer {

    @Override
    public Stage createLoadingPopup(Task<?> task, String keywords) {
        Stage dialog = new Stage();
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.setResizable(false);
        Dotenv dotenv;
        dotenv = Dotenv.configure().load();
        String apiKey = dotenv.get("GIPHY_KEY");

        // Requête HTTP pour récupérer l'URL du GIF depuis l'API Giphy
        String gifUrl = null;

        try {
        String url = "https://api.giphy.com/v1/gifs/random?api_key=" + apiKey + "&tag="+java.net.URLEncoder.encode(
                 keywords ,
                        StandardCharsets.UTF_8
                ).replaceAll("\\+", "%20")+ "&rating=g";
            java.net.URL apiUrl = new java.net.URL(url);
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) apiUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                try (java.io.InputStream is = conn.getInputStream();
                     java.util.Scanner scanner = new java.util.Scanner(is).useDelimiter("\\A")) {
                    String response = scanner.hasNext() ? scanner.next() : "";
                    // Extraire l'URL du GIF depuis la réponse JSON
                    ObjectMapper objectMapper = new ObjectMapper();

                    JsonNode rootNode = objectMapper.readTree(response);

                    gifUrl = rootNode.path("data").path("images").path("original").path("url").asText();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        dialog.setOnCloseRequest(_ -> {
        });
        RingProgressIndicator ringProgressIndicator = new RingProgressIndicator();
        ringProgressIndicator.setRingWidth(200);
        ringProgressIndicator.makeIndeterminate();

        task.progressProperty().addListener(
                (_, _, newProgress) -> ringProgressIndicator.setProgress((int) (newProgress.doubleValue() * 100)));


        ImageView gifView;
        Label label = new Label("Chargement en cours...");
        VBox box;
        if (gifUrl != null) {
            gifView = new ImageView(new Image(gifUrl, true));
            gifView.setFitWidth(200);
            gifView.setPreserveRatio(true);
            box = new VBox(ringProgressIndicator, gifView, label);
            dialog.setScene(new Scene(box, 600, 500));
        } else {
            box = new VBox(ringProgressIndicator, label);
        }


        box.setAlignment(Pos.CENTER);
        box.setPadding(new Insets(20, 0, 0, 0));
        return dialog;
    }
}
