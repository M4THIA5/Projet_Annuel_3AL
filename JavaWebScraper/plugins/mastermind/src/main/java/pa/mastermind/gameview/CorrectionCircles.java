package pa.mastermind.gameview;

import pa.mastermind.gamelogic.Pins;
import javafx.scene.layout.Background;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.StrokeType;
import pa.mastermind.main.Commons;

public class CorrectionCircles
{
	private Circle topLeft;
	private Circle topRight;
	private Circle bottomLeft;
	private Circle bottomRight;

	public CorrectionCircles()
	{
		this.topLeft = new Circle(Commons.RADIUS_SMALL);
		this.topLeft.setFill(Pins.COLORLESS.getColor());
		this.topLeft.setStrokeWidth(1.5);
		this.topLeft.setStrokeMiterLimit(10);
		this.topLeft.setStrokeType(StrokeType.CENTERED);
		this.topLeft.setStroke(Color.LIGHTGRAY);
		this.topRight = new Circle(Commons.RADIUS_SMALL);
		this.topRight.setFill(Pins.COLORLESS.getColor());
		this.topRight.setStrokeWidth(1.5);
		this.topRight.setStrokeMiterLimit(10);
		this.topRight.setStrokeType(StrokeType.CENTERED);
		this.topRight.setStroke(Color.LIGHTGRAY);
		this.bottomLeft = new Circle(Commons.RADIUS_SMALL);
		this.bottomLeft.setFill(Pins.COLORLESS.getColor());
		this.bottomLeft.setStrokeWidth(1.5);
		this.bottomLeft.setStrokeMiterLimit(10);
		this.bottomLeft.setStrokeType(StrokeType.CENTERED);
		this.bottomLeft.setStroke(Color.LIGHTGRAY);
		this.bottomRight = new Circle(Commons.RADIUS_SMALL);
		this.bottomRight.setFill(Pins.COLORLESS.getColor());
		this.bottomRight.setStrokeWidth(1.5);
		this.bottomRight.setStrokeMiterLimit(10);
		this.bottomRight.setStrokeType(StrokeType.CENTERED);
		this.bottomRight.setStroke(Color.LIGHTGRAY);
	}

	public void changeFill(Pins[] pins)
	{
		topLeft.setFill(pins[0].getColor());
		topRight.setFill(pins[1].getColor());
		bottomLeft.setFill(pins[2].getColor());
		bottomRight.setFill(pins[3].getColor());
	}

	public HBox getBox()
	{
		VBox left = new VBox(topLeft, bottomLeft);
		left.setBackground(Background.EMPTY);
		left.setSpacing(2);
		VBox right = new VBox(topRight, bottomRight);
		right.setBackground(Background.EMPTY);
		right.setSpacing(2);

		HBox result = new HBox(left, right);
		result.setBackground(Background.EMPTY);
		result.setSpacing(2);
		return result;
	}
}
