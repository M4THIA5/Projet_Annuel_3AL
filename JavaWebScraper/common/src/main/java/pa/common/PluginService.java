package pa.common;

import javafx.scene.control.Menu;
import javafx.scene.control.TabPane;
import org.pf4j.DefaultPluginManager;
import org.pf4j.PluginManager;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class PluginService {
    private final PluginManager pluginManager;

    public PluginService() {
        this.pluginManager = new DefaultPluginManager(Paths.get("plugins"));
        pluginManager.loadPlugins();
        pluginManager.startPlugins();
    }

    public void loadPlugin(Path pluginJar) {
        String wrapper = pluginManager.loadPlugin(pluginJar);
        if (wrapper != null) {
            pluginManager.startPlugin(wrapper);
            System.out.println("Plugin loaded and started: " + wrapper);
        }
    }
    public void loadPlugin(Path pluginJar, Menu pluginMenu, Context results, TabPane tab) {
        String wrapper = pluginManager.loadPlugin(pluginJar);
        if (wrapper != null) {
            pluginManager.startPlugin(wrapper);
            System.out.println("Plugin loaded and started: " + wrapper);
            if (wrapper.contains("history")) {
                List<HistoryExtension> extensions = pluginManager.getExtensions(HistoryExtension.class);
                if (!extensions.isEmpty()) {
                    System.out.println("HistoryExtension found: " + extensions.getFirst().toString());
                    extensions.getFirst().injectInto(pluginMenu, results, tab);
                } else {
                    System.out.println("No HistoryExtension found in the plugin.");
                }
            }
        }
    }

    public void unloadPlugin(String pluginId) {
        pluginManager.stopPlugin(pluginId);
        pluginManager.unloadPlugin(pluginId);
        System.out.println("Plugin unloaded: " + pluginId);
    }

    public PluginManager getPluginManager() {
        return pluginManager;
    }
}
