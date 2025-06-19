package pa.common;

import javafx.scene.Scene;
import javafx.scene.control.Menu;
import org.pf4j.ExtensionPoint;

public interface MastermindExtension extends ExtensionPoint {
    String getGameName();
    Scene createGameUI();
    void injectInto(Menu pluginMenu);

}
