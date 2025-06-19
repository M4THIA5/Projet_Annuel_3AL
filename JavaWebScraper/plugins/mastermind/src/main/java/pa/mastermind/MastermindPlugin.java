package pa.mastermind;

import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

import javax.swing.*;

public class MastermindPlugin extends Plugin {

    public MastermindPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println("MastermindPlugin started!");
        String[] a = new String[1];
        main(a);
    }

    @Override
    public void stop() {
        System.out.println("MastermindPlugin stopped!");
    }

    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null,  "MastermindPlugin is now active.","Information", JOptionPane.INFORMATION_MESSAGE);
    }
}