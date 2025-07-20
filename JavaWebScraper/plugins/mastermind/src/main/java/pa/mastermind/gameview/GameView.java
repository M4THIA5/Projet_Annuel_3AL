package pa.mastermind.gameview;

import pa.mastermind.gamelogic.Colors;
import pa.mastermind.gamelogic.Pins;
import pa.mastermind.gamelogic.ReturnLogic;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.effect.ColorAdjust;
import javafx.scene.effect.GaussianBlur;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import pa.mastermind.main.Commons;
import pa.mastermind.main.Mastermind;


public class GameView
{
	private Mastermind game;
	private Colors[] solution;
	private int currentLevel;
	private HBox[] boxes;
	private BetterCircle[][] betterCircles;
	private CorrectionCircles[] circles;
	private Scene root;
	private boolean easy;

	public GameView(Mastermind game)
	{
		this.game = game;
	}

	public Scene getGame(boolean easy)
	{
		solution = ReturnLogic.generateCode();
		if(easy)
			solution = ReturnLogic.generateEasyCode();
		currentLevel = 0;
		boxes = new HBox[14];
		circles = new CorrectionCircles[13];
		betterCircles = new BetterCircle[13][4];
		this.easy = easy;

		for(int i = 0; i < boxes.length - 1; i++)
		{
			int x = i;
			circles[i] = new CorrectionCircles();
			betterCircles[i][0] = new BetterCircle(Colors.COLORLESS, Commons.RADIUS, boxes.length - i - 2, easy);
			betterCircles[i][0].setOnMousePressed(new EventHandler<MouseEvent>()
			{
				@Override
				public void handle(MouseEvent mouseEvent)
				{
					betterCircles[x][0].cycleThroughColor(currentLevel);
				}
			});
			betterCircles[i][1] = new BetterCircle(Colors.COLORLESS, Commons.RADIUS, boxes.length - i - 2, easy);
			betterCircles[i][1].setOnMousePressed(new EventHandler<MouseEvent>()
			{
				@Override
				public void handle(MouseEvent mouseEvent)
				{
					betterCircles[x][1].cycleThroughColor(currentLevel);
				}
			});
			betterCircles[i][2] = new BetterCircle(Colors.COLORLESS, Commons.RADIUS, boxes.length - i - 2, easy);
			betterCircles[i][2].setOnMousePressed(new EventHandler<MouseEvent>()
			{
				@Override
				public void handle(MouseEvent mouseEvent)
				{
					betterCircles[x][2].cycleThroughColor(currentLevel);
				}
			});
			betterCircles[i][3] = new BetterCircle(Colors.COLORLESS, Commons.RADIUS, boxes.length - i - 2, easy);
			betterCircles[i][3].setOnMousePressed(new EventHandler<MouseEvent>()
			{
				@Override
				public void handle(MouseEvent mouseEvent)
				{
					betterCircles[x][3].cycleThroughColor(currentLevel);
				}
			});
			/*if(i == 0)
			{
				betterCircles[i][0] = new BetterCircle(solution[0], Commons.RADIUS, boxes.length - i - 2);
				betterCircles[i][1] = new BetterCircle(solution[1], Commons.RADIUS, boxes.length - i - 2);
				betterCircles[i][2] = new BetterCircle(solution[2], Commons.RADIUS, boxes.length - i - 2);
				betterCircles[i][3] = new BetterCircle(solution[3], Commons.RADIUS, boxes.length - i - 2);
			}*/
			boxes[i] = new HBox(betterCircles[i]);
			boxes[i].getChildren().add(0, circles[i].getBox());
			boxes[i].setAlignment(Pos.CENTER);
			boxes[i].setSpacing(3);
			boxes[i].setBackground(new Background(new BackgroundFill(Color.rgb(25, 25, 26), CornerRadii.EMPTY,
																	 Insets.EMPTY)));
		}
		Button submit = new Button("Submit");
		submit.setOnAction(x -> {
			boolean contain = false;
			for(int i = 0; i < betterCircles[13 - currentLevel - 1].length; i++)
			{
				if(betterCircles[13 - currentLevel - 1][i].getColor() == Colors.COLORLESS)
				{
					contain = true;
					break;
				}
			}
			if(!contain)
			{
				submitSolution();
			}
		});
		submit.setOnMouseEntered(y -> submit.setEffect(new ColorAdjust(0, 0, 0.19, 0.2)));
		submit.setOnMouseExited(y -> submit.setEffect(null));
		submit.setStyle(Commons.STYLE);
		boxes[13] = new HBox(submit);
		boxes[13].setAlignment(Pos.CENTER);
		boxes[13].setSpacing(6);
		boxes[13].setBackground(new Background(new BackgroundFill(Color.rgb(25, 25, 26), CornerRadii.EMPTY,
																  Insets.EMPTY)));


		VBox stack = new VBox(boxes);
		stack.setSpacing(6);
		stack.setAlignment(Pos.CENTER);
		stack.setBackground(new Background(new BackgroundFill(Color.rgb(25, 25, 26), CornerRadii.EMPTY,
															  Insets.EMPTY)));
		System.out.println(solution[0].toString());
		System.out.println(solution[1].toString());
		System.out.println(solution[2].toString());
		System.out.println(solution[3].toString());
		Scene scene = new Scene(stack, Commons.WIDTH, Commons.HEIGHT);
		scene.setFill(Color.rgb(25, 25, 26));
		return root = scene;
	}

	private void submitSolution()
	{
		this.currentLevel++;
		Pins[] pins = ReturnLogic.getCorrectPins(circlesToColors(betterCircles[13 - currentLevel]), solution);
		circles[13 - currentLevel].changeFill(pins);
		if(testPins(pins))
		{
			endGame(currentLevel, true);
		}
		else
		{
			if(currentLevel == 13)
			{
				endGame(currentLevel, false);
			}
			else
			{
				for(int i = 0; i < betterCircles[13 - currentLevel - 1].length; i++)
				{
					betterCircles[13 - currentLevel - 1][i].setColor(betterCircles[13 - currentLevel][i].getColor());
				}
			}
		}

	}

	private Colors[] circlesToColors(BetterCircle[] circles)
	{
		Colors[] returnee = new Colors[circles.length];
		for(int i = 0; i < returnee.length; i++)
		{
			returnee[i] = circles[i].getColor();
		}
		return returnee;
	}

	private void endGame(int currentLevel, boolean wonGame)
	{
		root.getRoot().setEffect(new GaussianBlur(20.0f));
		VBox pauseRoot = new VBox(6);
		Label heading = null;
		if(wonGame)
		{
			heading = new Label("Game Won");
			heading.setStyle(Commons.STYLE_WON);
		}
		else
		{
			heading = new Label("Game Lost");
			heading.setStyle(Commons.STYLE_LOST);
		}
		Label correct = new Label("Correct solution:");
		correct.setStyle(Commons.LABEL);
		Label solution = new Label("Your last solution:");
		solution.setStyle(Commons.LABEL);
		Colors[] colors = circlesToColors(betterCircles[13 - currentLevel]);
		HBox playerSolution = new HBox(new BetterCircle(colors[0], Commons.RADIUS_ENDSCREEN, 0, easy),
									   new BetterCircle(colors[1], Commons.RADIUS_ENDSCREEN, 0, easy),
									   new BetterCircle(colors[2], Commons.RADIUS_ENDSCREEN, 0, easy),
									   new BetterCircle(colors[3], Commons.RADIUS_ENDSCREEN, 0, easy));
		playerSolution.setAlignment(Pos.CENTER);
		playerSolution.setSpacing(6);

		HBox correctSolution = new HBox(new BetterCircle(this.solution[0], Commons.RADIUS_ENDSCREEN, 0, easy),
										new BetterCircle(this.solution[1], Commons.RADIUS_ENDSCREEN, 0, easy),
										new BetterCircle(this.solution[2], Commons.RADIUS_ENDSCREEN, 0, easy),
										new BetterCircle(this.solution[3], Commons.RADIUS_ENDSCREEN, 0, easy));
		correctSolution.setAlignment(Pos.CENTER);
		correctSolution.setSpacing(6);

		pauseRoot.getChildren().add(heading);
		pauseRoot.getChildren().add(correct);
		pauseRoot.getChildren().add(correctSolution);
		pauseRoot.getChildren().add(solution);
		pauseRoot.getChildren().add(playerSolution);
		if(wonGame)
		{
			Label tries = new Label("It took you " + currentLevel + ((currentLevel == 1) ? " try" : " tries") + " to " +
											"win!");
			tries.setStyle(Commons.LABEL);
			pauseRoot.getChildren().add(tries);
		}

		pauseRoot.setStyle("-fx-background-color: rgba(37, 37, 38, 0.9);");
		pauseRoot.setAlignment(Pos.CENTER);
		pauseRoot.setPadding(new Insets(20));

		Button resume = new Button("Return to Main Menu");
		resume.setStyle(Commons.STYLE_SEETHROUGH);
		resume.setOnMouseEntered(y -> resume.setStyle(Commons.STYLE_NON_SEETHROUGH));
		resume.setOnMouseExited(y -> resume.setStyle(Commons.STYLE_SEETHROUGH));
		pauseRoot.getChildren().add(resume);

		Stage popupStage = new Stage(StageStyle.TRANSPARENT);
		popupStage.initOwner(game.getPrimaryStage());
		popupStage.initModality(Modality.APPLICATION_MODAL);
		popupStage.setScene(new Scene(pauseRoot, Color.TRANSPARENT));

		resume.setOnAction(event ->
						   {
							   popupStage.hide();
							   game.endGame();
						   });
		popupStage.show();
	}

	private boolean testPins(Pins[] pins)
	{
		for(Pins x: pins)
		{
			if(x != Pins.BLACK)
			{
				return false;
			}
		}
		return true;
	}
}
