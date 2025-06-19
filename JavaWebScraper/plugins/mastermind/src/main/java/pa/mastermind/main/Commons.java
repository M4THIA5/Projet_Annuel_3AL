package pa.mastermind.main;

import java.awt.*;

public interface Commons
{
	Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();

	public static final long HEIGHT = (long) (screenSize.getHeight() - screenSize.getHeight() / 15); //1600
// 	public static final long HEIGHT = 1000; //1600
//	public static final long WIDTH = 450; //900
	public static final long WIDTH = HEIGHT / 16 * 9; //900

	public static final long RADIUS = (HEIGHT / 39);
	public static final long RADIUS_ENDSCREEN = (HEIGHT / 39);
	public static final long RADIUS_SMALL = (WIDTH / 65);

	public static final String STYLE =
			"-fx-text-fill: #FFFFFF; -fx-background-color: #19191A; -fx-font-size: " + (HEIGHT / 30) + "px;";
	public static final String STYLE_SEETHROUGH = "-fx-text-fill: #FFFFFF; -fx-background-color: rgba(37, 37, 38, 0); "
			+ "-fx-font-size: " + (HEIGHT / 30) + "px;";
	public static final String STYLE_NON_SEETHROUGH = "-fx-text-fill: #FFFFFF; -fx-background-color: rgba(20, 20, 21, " +
			"0.8); " + "-fx-font-size: " + (HEIGHT / 30) + "px;";
	public static final String STYLE_WON = "-fx-text-fill: #11EE11; -fx-background-color: rgba(37, 37, 38, 0); " +
			"-fx-font-size: " + (HEIGHT / 10) + "px;";
	public static final String STYLE_LOST = "-fx-text-fill: #FF0000; -fx-background-color: rgba(37, 37, 38, 0); " +
			"-fx-font-size: " + (HEIGHT / 10) + "px;";
	public static final String LABEL =
			"-fx-text-fill: #FFFFFF; -fx-background-color: rgba(37, 37, 38, 0); " + "-fx" + "-font-size: " + (WIDTH / 19) + "px;";
	public static final String HEADING =
			"-fx-text-fill: #FF0000; -fx-background-color: #19191A; -fx-font-size: " + +(WIDTH / 7) + "px;";
	public static final String SCORE =
			"-fx-text-fill: #FFFFFF; -fx-background-color: #19191A; -fx-font-size: " + (HEIGHT / 40) + "px;";
}
