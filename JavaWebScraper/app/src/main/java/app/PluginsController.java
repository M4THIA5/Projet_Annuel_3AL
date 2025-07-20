package app;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.CheckBox;
import javafx.scene.control.ListView;
import javafx.scene.layout.HBox;
import org.pf4j.PluginManager;
import org.pf4j.PluginState;
import org.pf4j.PluginWrapper;
import pa.common.Context;

import java.net.URL;
import java.util.ResourceBundle;

public class PluginsController implements Initializable {

    @FXML
    private ListView<HBox> pluginList;
    Context currentContext = Context.getInstance();

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        PluginManager pluginManager = currentContext.getPluginService().getPluginManager(); // singleton custom
        for (PluginWrapper plugin : pluginManager.getPlugins()) {
            CheckBox checkBox = new CheckBox(plugin.getPluginId() + " (" + plugin.getPluginState() + ")");
            checkBox.setSelected(plugin.getPluginState().equals(PluginState.STARTED));
            checkBox.setOnAction(e -> {
                if (checkBox.isSelected()) {
                    pluginManager.startPlugin(plugin.getPluginId());
                } else {
                    pluginManager.stopPlugin(plugin.getPluginId());
                }
                checkBox.setText(plugin.getPluginId() + " (" + plugin.getPluginState() + ")");
            });
            pluginList.getItems().add(new HBox(checkBox));
        }
    }
}
