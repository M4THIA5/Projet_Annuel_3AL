module pa.history {
    requires pa.common;
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires org.pf4j;
    requires java.desktop;

    opens pa.history to javafx.fxml;
    exports pa.history;
}
