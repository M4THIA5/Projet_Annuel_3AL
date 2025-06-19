package pa.mastermind;

import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuItem;
import org.pf4j.Extension;
import pa.common.MastermindExtension;
import pa.mastermind.gameview.GameView;
import pa.mastermind.main.Mastermind;

@Extension
public class MastermindGameExtension implements MastermindExtension {

    @Override
    public String getGameName() {
        return "Mastermind";
    }

    @Override
    public Scene createGameUI() {
        Mastermind mastermind= new Mastermind();
        return mastermind.createMainMenu();
    }

    @Override
    public void injectInto(Menu pluginMenu) {
        MenuItem item = new MenuItem("MasterMind");
        item.setOnAction(evt ->
                {
                    Mastermind mastermind= new Mastermind();

                    javafx.scene.control.Dialog<String> dialog = new javafx.scene.control.Dialog<>();
                    dialog.setTitle("MasterMind");
                    mastermind.primaryStage = (javafx.stage.Stage) dialog.getDialogPane().getScene().getWindow();
                    mastermind.view= new GameView(mastermind);
                    dialog.getDialogPane().setContent(mastermind.createMainMenu().getRoot());
                    dialog.getDialogPane().getButtonTypes().add(javafx.scene.control.ButtonType.CLOSE);
                    dialog.showAndWait();
                }
        );
        pluginMenu.getItems().add(item);
    }
}
