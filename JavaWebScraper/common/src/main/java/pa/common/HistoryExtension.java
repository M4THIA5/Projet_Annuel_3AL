package pa.common;

import javafx.scene.control.Menu;
import org.pf4j.ExtensionPoint;


public interface HistoryExtension extends ExtensionPoint {
    void injectInto(Menu pluginMenu, Context results);
}
