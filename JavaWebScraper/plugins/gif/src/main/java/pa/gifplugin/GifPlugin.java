package pa.gifplugin;

import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

import javax.swing.*;

public class GifPlugin extends Plugin {

    public GifPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println("GifPlugin started!");
        String[] a = new String[1];
        main(a);
    }

    @Override
    public void stop() {
        System.out.println("GifPlugin stopped!");
    }

    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null, "GifPlugin is now active.","Information",  JOptionPane.INFORMATION_MESSAGE);
    }
}

