module pa.gifplugin {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires org.pf4j;
    requires java.desktop;
    requires pa.common;

    opens pa.gifplugin to javafx.fxml;
    exports pa.gifplugin;
}
