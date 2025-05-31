package pa.history;

import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import org.pf4j.Extension;
import pa.common.HistoryExtension;

@Extension
public class MyButtonExtension implements HistoryExtension {
    @Override
    public String getName() {
        return "Mon Bouton Plugin";
    }

    @Override
    public Node createContent() {
        VBox box = new VBox();
        box.getChildren().add(new Label("Hello depuis le plugin !"));
        return box;
    }
}
