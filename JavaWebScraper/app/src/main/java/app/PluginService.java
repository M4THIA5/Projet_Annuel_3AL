package app;

import org.pf4j.DefaultPluginManager;
import org.pf4j.PluginManager;

import java.nio.file.Path;
import java.nio.file.Paths;

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

    public void unloadPlugin(String pluginId) {
        pluginManager.stopPlugin(pluginId);
        pluginManager.unloadPlugin(pluginId);
        System.out.println("Plugin unloaded: " + pluginId);
    }

    public PluginManager getPluginManager() {
        return pluginManager;
    }
}
