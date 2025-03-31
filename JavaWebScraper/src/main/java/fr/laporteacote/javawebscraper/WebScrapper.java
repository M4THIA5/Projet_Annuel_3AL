package fr.laporteacote.javawebscraper;

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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import static java.lang.Thread.sleep;

public class WebScrapper {
    public List<String> extractRelevantText(WebDriver driver, String keyword) {
        List<String> paragraphs = new ArrayList<>();
        List<WebElement> elements = List.of();
        try {
            sleep(2000);
            elements = driver.findElements(By.tagName("p")); // Récupère tous les <p>
            elements.addAll(driver.findElements(By.tagName("h1")));
            elements.addAll(driver.findElements(By.tagName("h2")));
            elements.addAll(driver.findElements(By.tagName("li")));
        } catch (StaleElementReferenceException e) {
            System.out.println("erreur");
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        for (WebElement element : elements) {
            String text = element.getText().trim();
            if (!text.isEmpty() && text.toLowerCase().contains(keyword.toLowerCase()) && text.length() > 30) {
                paragraphs.add(text); // Garde les paragraphes contenant le mot-clé
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

    public String summarizeWithGPT4(List<String> text) throws IOException, URISyntaxException {
        HttpURLConnection connection = getHttpURLConnection();


        String requestBody = "{  \"model\": \"llama-3.3-70b-versatile\", \"messages\": [{ \"role\": \"system\", " +
                "\"content\": \"Tu dois analyser les informations que l'on te donne, et les résumer " +
                "en un condensé pertinent et utilisable dans un article de blog. Toutes les informations ne " +
                "sont pas forcément intéressantes à utiliser. À toi de garder le plus important. N'interagis pas avec " +
                "l'utilisateur. Seule ta réponse relative au résumé est attendue.\" }," +
                "{\"role\":\"user\", \"content\": \"J'ai ce texte là que j'ai récupéré, peux-tu m'en extraire les" +
                " informations les plus intéressantes ? \\\"" + stringify(text) + "\\\"\"}] }";
//        System.out.println(stringify(text));
//        return "ff";
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
            System.out.println(err);
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
            formatted = text.get(0);
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
        return formatted.substring(0,6000);
    }

    private static HttpURLConnection getHttpURLConnection() throws URISyntaxException, IOException {
        String apiKey = "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";
        URL url = new URI("https://api.groq.com/openai/v1/chat/completions").toURL();

        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", "Bearer " + apiKey);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        return connection;
    }

    public String scrap(WebDriver driver, String url, String keyword) throws Exception {
        dodgeGoogleCookieMessage(driver, url);

        List<String> urls = getGoogleSearchResults(driver);

        List<String> data = new ArrayList<>();
        urls.forEach(link -> {
            driver.get(link);
            data.addAll(extractRelevantText(driver, keyword));
        });


        List<String> newdata = new ArrayList<>();
        for (String pr : data) {
            String cleaned = this.cleanHTMLContent(pr);
            if (!cleaned.isEmpty()) {
                newdata.add(cleaned);
            }
        }
        String finalString = this.summarizeWithGPT4(newdata);

        return extractResponse(finalString);

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
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);

        return rootNode.path("choices").get(0).path("message").path("content").asText();
    }


}
