package app;

import java.util.ArrayList;
import java.util.List;

public class Context {
    private final static Context instance = new Context();

    public static Context getInstance() {
        return instance;
    }

    private final List<String> requests = new ArrayList<>();


    public List<String> getRequests() {
        return requests;
    }

    public void addRequest(String request) {
        this.requests.add(request);
    }
}
