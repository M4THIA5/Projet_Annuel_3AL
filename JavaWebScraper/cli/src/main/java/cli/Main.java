package cli;


import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;


import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;


public class Main {
    private static void setupChromeDriver() throws IOException {
        // Récupérer l'URL du chromedriver dans le .jar
        InputStream chromedriverStream = WebScrapper.class.getClassLoader().getResourceAsStream("chromedriver.exe");

        if (chromedriverStream == null) {
            throw new IOException("chromedriver.exe n'a pas été trouvé dans le .jar");
        }

        // Créer un fichier temporaire pour stocker chromedriver
        File tempFile = new File(System.getProperty("java.io.tmpdir"), "chromedriver.exe");

        // Copier le fichier du .jar vers le fichier temporaire
        try (OutputStream outputStream = new FileOutputStream(tempFile)) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = chromedriverStream.read(buffer)) > 0) {
                outputStream.write(buffer, 0, length);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Définir la propriété pour le WebDriver
        System.setProperty("webdriver.chrome.driver", tempFile.getAbsolutePath());

        // Pour s'assurer que le fichier est exécutable
        tempFile.setExecutable(true);
    }
    public static void main(String[] args) throws Exception {
        String word;
        if (args.length == 0) {
            System.out.println("Please provide a word");
            Scanner myObj = new Scanner(System.in);
            word = myObj.nextLine();
            if (word.isEmpty()) {
                throw new IllegalArgumentException("Aucun mot à rechercher");
            }
        } else {
            word = String.join(" ", args);
        }
        setupChromeDriver();
        //         Remplace par ton chemin ou mets dans le PATH
//         https://googlechromelabs.github.io/chrome-for-testing/#stable
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");  // Mode invisible
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--dns-prefetch-disable");
        options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        ChromeDriverService service =
                new ChromeDriverService.Builder()
                        .withLogFile(new File("log.log"))
                        .withAppendLog(true)
                        .withReadableTimestamp(true)
                        .build();
        WebDriver driver = new ChromeDriver(options);
        try {
            WebScrapper webScrapper = new WebScrapper();
            String url = "https://www.google.com/search?q=" + URLEncoder.encode(word, StandardCharsets.UTF_8);

            System.out.println(webScrapper.scrap(driver, url, word));
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            driver.quit(); // Fermer le navigateur
        }
    }
}
