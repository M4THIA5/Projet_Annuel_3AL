package pa.mastermind.gamelogic;

import javafx.scene.paint.Color;

public enum Colors
{
	WHITE(Color.WHITE), YELLOW(Color.YELLOW), BLACK(Color.BLACK), BROWN(Color.SADDLEBROWN), ORANGE(Color.ORANGE),
	RED(Color.RED), GREEN(Color.GREEN), BLUE(Color.BLUE), COLORLESS(Color.rgb(60, 60, 60));

	private Color color;

	private Colors(Color color)
	{
		this.color = color;
	}

	public static Colors getByName(String name)
	{
		String normalizedName = name.toLowerCase();
		Colors returnee = switch(normalizedName)
		{
			case "white" -> WHITE;
			case "yellow" -> YELLOW;
			case "black" -> BLACK;
			case "brown" -> BROWN;
			case "orange" -> ORANGE;
			case "red" -> RED;
			case "green" -> GREEN;
			case "blue" -> BLUE;
			default -> null;
		};
		if(returnee != null)
		{
			return returnee;
		}
		throw new IllegalArgumentException("No such color available");
	}

	public static Colors getByNumber(int number)
	{
		Colors returnee = switch(number)
		{
			case 0 -> WHITE;
			case 1 -> YELLOW;
			case 2 -> ORANGE;
			case 3 -> RED;
			case 4 -> BLUE;
			case 5 -> GREEN;
			case 6 -> BROWN;
			case 7 -> BLACK;
			default -> null;
		};
		if(returnee != null)
		{
			return returnee;
		}
		throw new IllegalArgumentException("No such color available");
	}

	public int getNumber()
	{
		return switch(this)
		{
			case WHITE -> 0;
			case YELLOW -> 1;
			case ORANGE -> 2;
			case RED -> 3;
			case BLUE -> 4;
			case GREEN -> 5;
			case BROWN -> 6;
			case BLACK -> 7;
			default -> -1;
		};
	}

	public Color getColor()
	{
		return color;
	}

	public String toString()
	{
		return switch(this)
				{
					case WHITE -> "white";
					case YELLOW -> "yellow";
					case ORANGE -> "orange";
					case RED -> "red";
					case BLUE -> "blue";
					case GREEN -> "green";
					case BROWN -> "brown";
					case BLACK -> "black";
					default -> "null";
				};
	}
}
