package pa.history;

import javafx.scene.control.Menu;
import javafx.scene.control.MenuItem;
import org.pf4j.Extension;
import pa.common.Context;
import pa.common.HistoryExtension;

import java.util.List;

@Extension
public class MyButtonExtension implements HistoryExtension {
    @Override
    public void injectInto(Menu pluginMenu, Context context) {
        MenuItem item = new MenuItem("Plugin - Action");
        item.setOnAction(e -> System.out.println("Action depuis le plugin"));
        pluginMenu.getItems().add(item);
    }
}
