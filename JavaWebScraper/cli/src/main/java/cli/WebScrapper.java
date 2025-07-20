package cli;

import org.openqa.selenium.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.function.BiConsumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvException;

import static java.lang.Thread.sleep;


public class WebScrapper {

    public static String ERROR_STRING = "Une erreur est survenue, aucun texte n'a été trouvé. Merci de réessayer.";

    public String getWordsToSearchForWithGPT4(String keyword) throws IOException, URISyntaxException {
        HttpURLConnection connection = getHttpURLConnection();
        connection.setConnectTimeout(10000);
        connection.setReadTimeout(15000);
        String requestBody = "{  \"model\": \"llama-3.3-70b-versatile\", \"messages\": [{ \"role\": \"system\", " +
                "\"content\": \"Tu dois analyser le ou les mots-clés que l'on te donne, et en ressortir une liste de " +
                "mots en lien, que ce soit des synonymes ou non, avec les mots clés donnés. Il est obligatoire que " +
                "l'on puisse retrouver ces mots clés nouvellement trouvés sur une page web que l'on recherche sur" +
                " internet, comme si l'on faisait une recherche Google avec les élements de ta liste. À toi de garder" +
                " le plus important. N'interagis pas avec l'utilisateur. Seule ta réponse relative à la liste " +
                "demandée est attendue. N'introduis pas ta réponse, ne donne pas de conclusion. Retourne simplement " +
                "la liste, en pensant à garder les mots clés de base dans ta réponse. Le premier élément de ta" +
                " liste doit absolument être les ou les mots-clés donnés par l'utilisateur.\" }," +
                "{\"role\":\"user\", \"content\": \"J'ai cet élément à rechercher sur Google, quels seraient les mots" +
                " qui pourraient me ressortir les informations les plus intéressantes ? \\\"" + keyword + "\\\"\"}] }";

        return getString(connection, requestBody);
    }

    public List<String> extractRelevantText(WebDriver driver, List<String> keywords) throws IOException, URISyntaxException {
        List<String> paragraphs = new ArrayList<>();
        List<WebElement> elements = List.of();
        for (int attempt = 0; attempt < 3; attempt++) {
            try {
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(7));
                wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("p")));

                elements = driver.findElements(By.xpath("//*[self::p or self::h1 or self::h2 or self::li or self::div]"));

//            elements = driver.findElements(By.tagName("p")); // Récupère tous les <p>
//            elements.addAll(driver.findElements(By.tagName("h1")));
//            elements.addAll(driver.findElements(By.tagName("h2")));
//            elements.addAll(driver.findElements(By.tagName("li")));
            } catch (StaleElementReferenceException e) {
                // System.out.println("erreur");
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            for (WebElement element : elements) {
                String text = element.getText().trim();
                for (String keyword : keywords) {
                    if (!text.isEmpty() && text.toLowerCase().contains(keyword.toLowerCase()) && text.length() > 30) {
                        paragraphs.add(text); // Garde les paragraphes contenant le mot-clé
                    }

                }
            }
            if (!paragraphs.isEmpty()) {
                break; // Si on a trouvé des paragraphes, on sort de la boucle
            }
        }
        return paragraphs;
    }

    public List<String> getGoogleSearchResults(WebDriver driver) {
        List<String> urls = new ArrayList<>();

        // Récupère toutes les balises <a> correspondant aux liens des résultats Google
        List<WebElement> results = driver.findElements(By.cssSelector("div.yuRUbf a"));


        for (WebElement result : results) {
            urls.add(result.getAttribute("href")); // Extrait le lien
        }

        return urls;
    }

    public String cleanHTMLContent(String htmlContent) {
        String text = htmlContent.replaceAll("&nbsp;", " ")
                .replaceAll("\\\\", " ")
                .replaceAll("\"", "'")
                .replaceAll(":", "  ")
                .replaceAll("\\s+", " ")
                .replaceAll("(?m)^\\s*$", "");
        return text.trim();
    }

    public String summarizeWithGPT4(List<String> text, String keyword) throws IOException, URISyntaxException {
        HttpURLConnection connection = getHttpURLConnection();
        connection.setConnectTimeout(10000);
        connection.setReadTimeout(15000);
        if (text.isEmpty()) {
            return ERROR_STRING;
        }
        String requestBody = "{  \"model\": \"llama-3.3-70b-versatile\", \"messages\": [{ \"role\": \"system\", " +
                "\"content\": \"Tu dois analyser les informations que l'on te donne en lien avec ce mot : " + keyword +
                " , et les résumer en un condensé pertinent et utilisable dans un article de blog. Toutes les" +
                " informations ne sont pas forcément intéressantes à utiliser. À toi de garder le plus important." +
                " N'interagis pas avec l'utilisateur. Seule ta réponse relative au résumé est attendue. N'introduis" +
                " pas ta réponse, ne donne pas de conclusion. Reste focalisé sur les termes réccurents du texte " +
                "donné, et ne fais pas d'interprétations. Ta réponse peut être aussi longue que tu le souhaites. " +
                "Je ne veux pas que tu résumes ton propre résumé. Fais attention à la logique de ta réponse. Tu ne " +
                "dois pas renseigner d'informations que tu as récupéré si elles n'ont pas de lien avec l'ensemble" +
                " de ta réponse.\" }," +
                "{\"role\":\"user\", \"content\": \"J'ai ce texte là que j'ai récupéré, peux-tu m'en extraire les" +
                " informations les plus intéressantes ? \\\"" + stringify(text) + "\\\"\"}] }";

        return getString(connection, requestBody);
    }

    private String getString(HttpURLConnection connection, String requestBody) throws IOException {
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = requestBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }
        if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getErrorStream(), StandardCharsets.UTF_8));
            StringBuilder err = new StringBuilder();
            String errLine;
            while ((errLine = br.readLine()) != null) {
                err.append(errLine.trim());
            }
            // System.out.println(err);
            throw new RuntimeException("Failed : HTTP error code : " + connection.getResponseCode());
        }
        BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String responseLine;
        while ((responseLine = br.readLine()) != null) {
            response.append(responseLine.trim());
        }

        return response.toString();
    }

    private String stringify(List<String> text) {
        String formatted;
        if (text.size() == 1) {
            formatted = text.getFirst();
        } else {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < text.size(); i++) {
                sb.append(text.get(i));
                if (i != text.size() - 1) {
                    sb.append(" ");
                }
                sb.append("\\n");
            }
            formatted = sb.toString();
        }
        if (formatted.length() > 6000) {
            formatted = formatted.substring(0, 6000);
        }
        return formatted;
    }

    private static HttpURLConnection getHttpURLConnection() throws URISyntaxException, IOException {
        Dotenv dotenv = null;
        dotenv = Dotenv.configure().load();
        String apiKey = dotenv.get("API_KEY");
        URL url = new URI("https://api.groq.com/openai/v1/chat/completions").toURL();

        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", "Bearer " + apiKey);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        connection.setConnectTimeout(10000);
        connection.setReadTimeout(15000);
        return connection;
    }

    public String scrap(WebDriver driver, String url, String keyword) throws Exception {
        // System.out.println("Step one : dodging cookie message");
        dodgeGoogleCookieMessage(driver, url);
        // System.out.println("Step two : getting search results");
        List<String> urls = getGoogleSearchResults(driver);

        // System.out.println("Step three : getting list of relevant things to search for");
        List<String> keywords = List.of(getWordsToSearchForWithGPT4(keyword).split(","));
        // System.out.println("Step four : getting on link and extracting relevant text");
        List<String> data = new ArrayList<>();
        urls.forEach(link -> {
            // System.out.println("Checking "+link);
            driver.get(link);
            try {

                data.addAll(extractRelevantText(driver, keywords));
            } catch (IOException | URISyntaxException e) {
                throw new RuntimeException(e);
            }
        });

        // System.out.println("Step five : cleaning data");
        List<String> newdata = cleanData(data);
        // System.out.println("Step six : summarizing data");
        String finalString = this.summarizeWithGPT4(newdata, keyword);
        // System.out.println("Step seven : extracting response");
        return extractResponse(finalString);

    }

    private List<String> cleanData(List<String> data) {
        List<String> newdata = new ArrayList<>();
        for (String pr : data) {
            String cleaned = this.cleanHTMLContent(pr);
            if (!cleaned.isEmpty()) {
                newdata.add(cleaned);
            }
        }
        return newdata;
    }

    public String scrap(WebDriver driver, String url, String keyword, BiConsumer<Integer, Integer> progressCallback) throws Exception {
        int act = 14;
        // System.out.println("Step one : dodging cookie message");
        progressCallback.accept(act, 100);
        dodgeGoogleCookieMessage(driver, url);
        // System.out.println("Step two : getting search results");
        List<String> urls = getGoogleSearchResults(driver);
        progressCallback.accept(2 * act, 100);
        // System.out.println("Step three : getting list of relevant things to search for");
        List<String> keywords = List.of(getWordsToSearchForWithGPT4(keyword).split(","));
        progressCallback.accept(3 * act, 100);
        // System.out.println("Step four : getting on link and extracting relevant text");
        List<String> data = new ArrayList<>();
        int finalCount = 14 / urls.size();
        for (int i = 0; i < urls.size(); i++) {
            // System.out.println("Checking "+urls.get(i));
            driver.get(urls.get(i));
            data.addAll(extractRelevantText(driver, keywords));
            progressCallback.accept((act * 3) + (finalCount * (i + 1)), 100);
        }
        progressCallback.accept(4 * act, 100);
        // System.out.println("Step five : cleaning data");
        List<String> newdata = cleanData(data);
        progressCallback.accept(5 * act, 100);
        // System.out.println("Step six : summarizing data");
        String finalString = this.summarizeWithGPT4(newdata, keyword);
        progressCallback.accept(6 * act, 100);
        // System.out.println("Step seven : extracting response");
        String str = extractResponse(finalString);
        progressCallback.accept(7 * act, 100);
        return str;


    }

    private static void dodgeGoogleCookieMessage(WebDriver driver, String url) {
        driver.get(url); // URL du site à scraper
        List<WebElement> buttons = driver.findElements(By.cssSelector("button"));
        buttons.stream()
                .filter(webElement -> webElement.getText().equals("Tout accepter")).findFirst()
                .ifPresent(WebElement::click);
        List<WebElement> inputs = driver.findElements(By.cssSelector("input[type='submit']"));
        inputs.stream()
                .filter(webElement -> webElement.getAccessibleName().equals("Recherche Google")).findFirst()
                .ifPresent(WebElement::click);
    }

    public String extractResponse(String jsonResponse) throws Exception {
        if (jsonResponse.equals(ERROR_STRING)) {
            return ERROR_STRING;
        }
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);

        return rootNode.path("choices").get(0).path("message").path("content").asText();
    }


}
