package pa.common;

import javafx.scene.control.Menu;
import javafx.scene.control.TabPane;
import org.pf4j.ExtensionPoint;


public interface HistoryExtension extends ExtensionPoint {
    void injectInto(Menu pluginMenu, Context results, TabPane tab);
}
