package pa.mastermind.main;


import pa.mastermind.gameview.GameView;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.effect.*;
import javafx.scene.layout.Background;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import javafx.stage.StageStyle;



public class Mastermind extends Application {
    public Stage primaryStage;
    public GameView view;
    private boolean easy;

    public void start(Stage primaryStage) {
        this.primaryStage = primaryStage;
        primaryStage.initStyle(StageStyle.UNDECORATED);
        this.view = new GameView(this);
        this.easy = false;
        primaryStage.setScene(createMainMenu());
        primaryStage.show();
    }

    public Scene createMainMenu() {
        Text heading = new Text("Mastermind");
        heading.setStyle(Commons.HEADING);
        heading.setFill(Color.MEDIUMSEAGREEN);
        heading.setFont(Font.font("Verdana"));


        Button mainMenuButton = new Button("Start Game");

        mainMenuButton.setStyle(Commons.STYLE);
        mainMenuButton.setFont(new Font("Verdana", 40));
        mainMenuButton.setOnMouseEntered(y -> mainMenuButton.setEffect(new ColorAdjust(0, 0, 0.19, 0.2)));
        mainMenuButton.setOnMouseExited(y -> mainMenuButton.setEffect(null));

        mainMenuButton.setOnAction(x -> primaryStage.setScene(createGame()));

        VBox mainMenuBox = new VBox(mainMenuButton);
        mainMenuBox.setAlignment(Pos.CENTER);
        mainMenuBox.setSpacing(5);
        mainMenuBox.setBackground(Background.EMPTY);
        VBox headingBox = new VBox(heading);
        headingBox.setAlignment(Pos.CENTER);
        headingBox.setPadding(new Insets(30, 0, 0, 0));
        headingBox.setBackground(Background.EMPTY);

        BorderPane mainMenuPane = new BorderPane();
        mainMenuPane.setTop(headingBox);
        mainMenuPane.setCenter(mainMenuBox);
        BorderPane.setAlignment(mainMenuBox, Pos.CENTER);
        mainMenuPane.setStyle("-fx-background-color:transparent");

        Scene mainMenuScene = new Scene(mainMenuPane, Commons.WIDTH, Commons.HEIGHT);
        mainMenuScene.setFill(Color.rgb(25, 25, 26));
        return mainMenuScene;
    }

    private Scene createGame() {
        return view.getGame(easy);
    }


    public void endGame() {
        primaryStage.setScene(createMainMenu());
    }

    public Stage getPrimaryStage() {
        return primaryStage;
    }


}
