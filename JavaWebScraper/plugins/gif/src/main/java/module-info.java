module pa.gifplugin {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires org.pf4j;
    requires pa.common;
    requires io.github.cdimascio.dotenv.java;
    requires com.fasterxml.jackson.databind;
    requires java.desktop;

    opens pa.gifplugin to javafx.fxml;
    exports pa.gifplugin;
}
