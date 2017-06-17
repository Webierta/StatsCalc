# STATS CALC

## Statistics Calculator

Calculate basic descriptive statistics for one or two data set from a population o a sample.

The elementary statistical calculations, such as mean, median, variance, regression correlation, are not complex to perform, but are laborious. This disadvantage becomes more acute as the size of the samples to be analyzed increases.

With this statistical calculator you can obtain the most common statistical indexes for one and two samples. Stats Calc including:

- Descriptive parameters: Size, Minimum, Maximum, Summation, Summation squared, Sum of squares.
- Measures of Central Tendency: Mean, Geometric mean, Median, Mode <sup id="mode">[1](#f1)</sup>.
- Measures of Dispersion: Range, Mean Absolute Deviation, Variance, Standard desviation, Coefficient of variation.
- Correlation: Covariance, Correlation coefficient, Linear Regression(coming soon)...

<b id="mode">1</b> Mode returns a single value or NO if it does not exist. If there is more than one, return one of them and indicate that there is more. [↩](#mode)

### Screenshots

![StatsCalc Start](http://genie.webierta.skn1.com/_media/wiki/inicio2.png?w=400&tok=fd80f5) ![StatsCalc Settings](http://genie.webierta.skn1.com/_media/wiki/settings.png?w=400&tok=18ce0d)

![StatsCalc Results](http://genie.webierta.skn1.com/_media/wiki/results.png)

## Data Supported

Only numbers. Integer and decimal numbers (with point, not comma), positive (unsigned) and negative (with -) are supported. Each data in a line or separated by commas (check the settings for entering data).

When a valid index can not be obtained with the entered data:
- NaN may appear when it is not possible to return a number.
- That index is not shown in the results (for example, some relationship measures are not shown if the two sets of data are not the same size).

## Options Available At Startup

- Data from population (default) or sample.
- Data sets: 1 (default) or 2.

## Ways To Enter Data

- Type with the keyboard.
- Copy and paste.
- Import data from a SQLite database (coming soon...).

See settings to choose how to write and paste the data.

## Settings

Choose the maximum number of decimal places: 2, 4 (default) or 6. All results are rounded to the eighth decimal.

Choose how to enter the data:
- Separated by lines (default): each data in a line.
- Separated by commas: a comma followed by a space (e.g. 11.25, -23.54, 0.55, 51.33).
	
Preferences are reset each time the program is closed. In future versions the settings will be saved.

## Save Results

You can copy all the solutions to the clipboard to paste them into any text file.

Export to a new text file (coming soon...).

## Development

The application is still under development, implying at least two things:

1. It is possible that errors appear (the strange thing would be the opposite).
2. It is in continuous process of improvement and incorporation of new functions.

This program comes WITHOUT ANY WARRANTY. See the GNU General Public License for more details.

If you want to collaborate to improve this application, you can communicate the errors that you find or the proposals and suggestions that you consider opportune.

Known bugs:
The design of the results window can be broken with very very large numbers.

Thank you for using Stats Calc, I hope they make your life a bit easier!
Jesús Cuerda - webierta@gmail.com

### Compile and execute

Dependencies:

- libgee-0.8-2 (>=0.18.0-2)
- libgtk-3-0 (>=3.20)
- libsqlite3-0 (>=3.14) (coming soon)

valac --pkg gtk+-3.0 --pkg sqlite3 --pkg gee-0.8 -X -lm Stats.gs Calculator.gs WinSolutions.gs WinHelp.gs --output stats

./stats

Soon available in package deb to install.
