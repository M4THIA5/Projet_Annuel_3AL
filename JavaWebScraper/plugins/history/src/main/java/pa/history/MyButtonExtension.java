package pa.history;

import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.*;
import org.pf4j.Extension;
import pa.common.Context;
import pa.common.HistoryExtension;

import javax.swing.*;
import java.io.IOException;


@Extension
public class MyButtonExtension implements HistoryExtension {
    @Override
    public void injectInto(Menu pluginMenu, Context context, TabPane tabPane) {
        MenuItem item = new MenuItem("Plugin - Action");
        item.setOnAction(evt ->
                {
                    // Ouvre une boîte de dialogue avec une ListView de tous les éléments dans context.getRequests()
                    javafx.scene.control.Dialog<String> dialog = new javafx.scene.control.Dialog<>();
                    dialog.setTitle("Historique des requêtes");

                    javafx.scene.control.ListView<String> listView = new javafx.scene.control.ListView<>();
                    listView.getItems().addAll(context.getRequestsTitles());

                    dialog.getDialogPane().setContent(listView);
                    dialog.getDialogPane().getButtonTypes().add(javafx.scene.control.ButtonType.CLOSE);

                    listView.setOnMouseClicked(event -> {
                        if (event.getClickCount() == 2) {
                            String selected = listView.getSelectionModel().getSelectedItem();
                            if (selected != null) {
                                dialog.close();
                                System.out.println("Ouvrir un nouvel onglet avec le contenu de : " + selected);
                                int index = -1;
                                int currentIndex = 0;
                                String text = context.getRequests().get(selected);
                                for (String key : context.getRequestsTitles()) {
                                    if (key.equals(selected)) {
                                        index = currentIndex;
                                        break;
                                    }
                                    currentIndex++;
                                }
                                if (text != null) {
                                    System.out.println("Contenu de l'élément sélectionné : " + text);
                                    Tab tab = new Tab("Request " + ++index + " : " + selected);
                                    FXMLLoader fxmlLoader = new FXMLLoader(
                                            MyButtonExtension.class.getResource("result.fxml")
                                    );
                                    Node node;
                                    try {
                                        node = fxmlLoader.load();
                                    } catch (IOException ex) {
                                        throw new RuntimeException(ex);
                                    }
                                    assert node != null;
                                    TextArea textarea = (TextArea) node.lookup("#text");
                                    textarea.setText(text);
                                    textarea.setEditable(false);
                                    Button saveBt = (Button) node.lookup("#copyBtn");
                                    Button copyBt = (Button) node.lookup("#saveBtn");
                                    saveBt.setId("copyBtn" + selected);
                                    copyBt.setId("saveBtn" + selected);
                                    tab.setContent(node);
                                    tabPane.getTabs().add(tab);
                                } else {
                                    JOptionPane.showMessageDialog(
                                            null,
                                            "Aucun contenu trouvé pour l'élément sélectionné.",
                                            "Erreur",
                                            JOptionPane.ERROR_MESSAGE);
                                }
                            }
                        }
                    });

                    dialog.showAndWait();
                }
        );
        pluginMenu.getItems().add(item);
    }
}
