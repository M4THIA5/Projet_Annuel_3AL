package app.utils;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;

public class Data
{
    @FXML
    public VBox hBox;

    @FXML
    public Label label;

    public Data()
    {
         hBox = (VBox) Loader.load("listCellItem.fxml");
    }

    public void setInfo(String string)
    {
        HBox box = (HBox) hBox.getChildren().get(0);
        label = (Label) box.getChildren().get(0);
        if (label != null) label.setText(string);
    }

    public VBox getBox()
    {
        return hBox;
    }
}
