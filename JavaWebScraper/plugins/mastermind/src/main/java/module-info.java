module pa.mastermind {
    requires pa.common;
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires org.pf4j;
    requires java.desktop;

    opens pa.mastermind to javafx.fxml;
    exports pa.mastermind;
}
