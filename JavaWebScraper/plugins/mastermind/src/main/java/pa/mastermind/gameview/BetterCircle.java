package pa.mastermind.gameview;

import pa.mastermind.gamelogic.Colors;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.StrokeType;

public class BetterCircle extends Circle
{
	private Colors color;
	private int level;
	private boolean easy;


	public BetterCircle(Colors color, double radius, int level, boolean easy)
	{
		super(radius);
		this.color = color;
		this.level = level;
		this.easy = easy;
		super.setFill(color.getColor());
		super.setStrokeWidth(3);
		super.setStrokeMiterLimit(10);
		super.setStrokeType(StrokeType.CENTERED);
		super.setStroke(Color.LIGHTGRAY);
	}

	public void cycleThroughColor(int level)
	{
		int val = 8;
		if(easy)
			val = 6;
		if(this.level == level)
		{
			this.color = Colors.getByNumber((color.getNumber() + 1) % val);
			super.setFill(color.getColor());
		}
	}

	public Colors getColor()
	{
		return color;
	}

	public void setColor(Colors color)
	{
		this.color = color;
		super.setFill(color.getColor());
	}
}
