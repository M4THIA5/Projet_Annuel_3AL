package pa.mastermind.gamelogic;

import javafx.scene.paint.Color;

public enum Pins
{
	COLORLESS(Color.rgb(60, 60, 60)), BLACK(Color.BLACK), WHITE(Color.WHITE);

	private Color color;

	private Pins(Color color)
	{
		this.color = color;
	}

	public Color getColor()
	{
		return color;
	}

	public String toString()
	{
		switch(this)
		{
			case BLACK:
				return "Black";
			case WHITE:
				return "White";
			case COLORLESS:
				return "Colorless";
			default:
				return "Null";
		}
	}
}
