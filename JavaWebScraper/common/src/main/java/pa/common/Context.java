package pa.common;

import java.util.HashMap;
import java.util.List;

public class Context {
    private final static Context instance = new Context();

    public static Context getInstance() {
        return instance;
    }

    private final HashMap<String, String> requests = new HashMap<>();

    public PluginService getPluginService() {
        return pluginService;
    }

    private final PluginService pluginService = new PluginService();

    public HashMap<String, String> getRequests() {
        return requests;
    }

    public void addRequest(String keyword,String request) {
        this.requests.put(keyword, request);
    }

    public List<String> getRequestsTitles() {
        return requests.keySet().stream().toList();
    }
}
