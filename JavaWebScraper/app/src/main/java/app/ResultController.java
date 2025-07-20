package app;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import pa.common.Context;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class ResultController  implements Initializable {
    private Context context;
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        context = Context.getInstance();
    }
    @FXML
    public Button saveBtn;
    @FXML
    public Button copyBtn;

    public void saveValueClipBoard(ActionEvent actionEvent) {
        Button btn = (Button) actionEvent.getSource();
        String id = btn.getId().substring("copyBtn".length());
        String str = context.getRequests().get(id);
        Clipboard clip = Toolkit.getDefaultToolkit()
                .getSystemClipboard();
        StringSelection strse1 = new StringSelection(str);
        clip.setContents(strse1, strse1);


    }

    public void saveInFile(ActionEvent actionEvent) throws IOException {
        System.out.println("Save value");
        Button btn = (Button) actionEvent.getSource();
        String id =btn.getId().substring("saveBtn".length());
        System.out.println(id);
        JFileChooser fileChooser = new JFileChooser();
        if (fileChooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            String str = context.getRequests().get(id);
            FileOutputStream outputStream = new FileOutputStream(file + ".txt");
            byte[] strToBytes = str.getBytes();
            outputStream.write(strToBytes);

            outputStream.close();
        }
    }


}
