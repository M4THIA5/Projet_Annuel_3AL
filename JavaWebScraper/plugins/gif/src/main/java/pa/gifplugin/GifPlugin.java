package pa.gifplugin;

import io.github.cdimascio.dotenv.Dotenv;
import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

import javax.swing.*;
import java.io.*;
import java.util.Arrays;
import java.util.Base64;
import java.util.Objects;

public class GifPlugin extends Plugin {

    public GifPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println("GifPlugin started!");
        String[] a = new String[1];
        Dotenv dotenv;
        dotenv = Dotenv.configure().ignoreIfMissing().load();
        String apiKey = dotenv.get("GIPHY_KEY");
        if (apiKey == null) {
            String decodedKey;
            try {
                byte[] decodedBytes = Base64.getDecoder().decode(Objects.requireNonNull(
                        getClass().getClassLoader().getResourceAsStream("k")
                ).readAllBytes());
                decodedKey = new String(decodedBytes);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            BufferedWriter writer;
            try {
                writer = new BufferedWriter(new FileWriter(".env", true));
                writer.append("\nGIPHY_KEY=\"").append(decodedKey).append("\"");
                writer.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        main(a);
    }

    @Override
    public void stop() {
        System.out.println("GifPlugin stopped!");
    }

    public static void main(String[] args) {
        JOptionPane.showMessageDialog(null, "GifPlugin is now active.", "Information", JOptionPane.INFORMATION_MESSAGE);
    }
}

