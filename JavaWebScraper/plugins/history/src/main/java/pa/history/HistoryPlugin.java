package pa.history;

import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

import javax.swing.*;


public class HistoryPlugin extends Plugin {

    public HistoryPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println("HistoryPlugin started!");
        String[] a = new String[1];
        main(a);
    }

    @Override
    public void stop() {
        System.out.println("HistoryPlugin stopped!");
    }

    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null,  "HistoryPlugin is now active.","Information", JOptionPane.INFORMATION_MESSAGE);
    }
}


