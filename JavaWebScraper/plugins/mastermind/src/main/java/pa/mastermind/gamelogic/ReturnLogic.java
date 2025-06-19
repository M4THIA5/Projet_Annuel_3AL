package pa.mastermind.gamelogic;

import java.util.Random;

public class ReturnLogic
{
	private static Random random = new Random();
	public static Pins[] getCorrectPins(Colors[] currentRow, Colors[] solution)
	{
		Colors[] tempSolution = new Colors[4];
		Colors[] tempCurrentRow = new Colors[4];
		for(int i = 0; i < 4; i++)
		{
			tempSolution[i] = solution[i];
			tempCurrentRow[i] = currentRow[i];
		}


		int blackPegs = 0;
		for(int i = 0; i < solution.length; i++)
		{
			if(tempSolution[i] == tempCurrentRow[i])
			{
				blackPegs++;
				tempSolution[i] = Colors.COLORLESS;
				tempCurrentRow[i] = Colors.COLORLESS;
			}
		}

		int whitePegs = 0;
		for(int i = 0; i < solution.length; i++)
		{
			if(tempSolution[i] == Colors.COLORLESS)
			{
				continue;
			}
			for(int j = 0; j < solution.length; j++)
			{
				if(tempCurrentRow[j] == Colors.COLORLESS)
				{
					continue;
				}
				if(tempSolution[i] == tempCurrentRow[j])
				{
					whitePegs++;
					tempSolution[i] = Colors.COLORLESS;
					tempCurrentRow[j] = Colors.COLORLESS;
				}
			}
		}


		Pins[] result = new Pins[4];
		for(int i = 0; i < result.length; i++)
		{
			if(blackPegs != 0)
			{
				result[i] = Pins.BLACK;
				blackPegs--;
			}
			else
			{
				if(whitePegs != 0)
				{
					result[i] = Pins.WHITE;
					whitePegs--;
				}
				else
				{
					result[i] = Pins.COLORLESS;
				}
			}
		}
		return result;
	}

	public static Colors[] generateCode()
	{
		Colors[] returnee = new Colors[4];
		for(int i = 0; i < returnee.length; i++)
		{
			int rand = random.nextInt() % 8;
			rand = Integer.signum(rand) * rand;
			returnee[i] = Colors.getByNumber(rand);
		}
		return returnee;
	}

	public static Colors[] fakeCode()
	{
		Colors[] returnee = new Colors[4];
		for(int i = 0; i < returnee.length; i++)
		{
			returnee[i] = Colors.WHITE;
		}
		return returnee;
	}

	public static Colors[] generateEasyCode()
	{
		Colors[] returnee = new Colors[4];
		for(int i = 0; i < returnee.length; i++)
		{
			int rand = random.nextInt() % 6;
			rand = Integer.signum(rand) * rand;
			returnee[i] = Colors.getByNumber(rand);
		}
		return returnee;
	}
}
