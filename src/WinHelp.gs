/*
* Copyleft 2017 Jesús Cuerda - All Wrongs Reserved (https://github.com/Webierta/StatsCalc)
*
* This file is part of Stats Calc.
*
* Stats Calc is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published
* by the Free Software Foundation, either version 3 of the License,
* or (at your option) any later version.
*
* Stats Calc is distributed in the hope that it will be useful, but
* WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
* the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public
* License along with Stats Calc. If not, see <http://www.gnu.org/licenses/>.
*
* Authored by: Jesús Cuerda <webierta@gmail.com>
*/

uses Gtk

class WinHelp: Gtk.ApplicationWindow

	init

		this.set_modal(true)
		this.set_transient_for(win_inicio)
		this.window_position = WindowPosition.CENTER
		this.border_width = 8
		this.set_default_size (700, 500)

		var header = new Gtk.HeaderBar()
		header.show_close_button = true
		header.set_title ("INFO")
		header.set_hexpand (true)
		this.set_titlebar(header)

		var boton = new Button.from_icon_name("gtk-home", IconSize.BUTTON)
		boton.set_tooltip_text ("Go back")
		header.pack_start(boton)
		boton.clicked.connect(salir_ayuda)

		var box_help = new Gtk.Box (Gtk.Orientation.VERTICAL, 0)
		box_help.set_hexpand(true)
		box_help.set_vexpand(true)
		this.add(box_help)

		var scrolled_help = new Gtk.ScrolledWindow (null, null)
		box_help.pack_start (scrolled_help, true, true, 0)

		var texto_ayuda = new Gtk.TextView()
		texto_ayuda.set_wrap_mode (Gtk.WrapMode.WORD)
		texto_ayuda.set_editable(false)
		texto_ayuda.set_hexpand(true)
		var info_text = """Stats Calc
Statistics Calculator

Calculate basic descriptive statistics for one or two data set from a population o a sample.

The elementary statistical calculations, such as mean, median, variance, regression correlation, are not complex to perform, but are laborious. This disadvantage becomes more acute as the size of the samples to be analyzed increases.

With this statistical calculator you can obtain the most common statistical indexes for one and two samples. Stats Calc including:

- Descriptive parameters: Size, Minimum, Maximum, Summation, Summation squared, Sum of squares.
- Measures of Central Tendency: Mean, Geometric mean, Median, Mode (coming soon).
- Measures of Dispersion: Range, Mean Absolute Deviation, Variance, Standard desviation, Coefficient of variation.
- Correlation: Covariance, Correlation coefficient(coming soon), Linear Regression(coming soon)...

DATA SUPPORTED:
Only numbers. Integer and decimal numbers (with point, not comma), positive (unsigned) and negative (with -) are supported. Each data in a line or separated by commas (check the settings for entering data).

OPTIONS AVAILABLE AT STARTUP:
- Data from population (default) or sample.
- Data sets: 1 (default) or 2.

Important!: Keep in mind that the results vary if it is a complete population or a sample of a population. Make sure what data you want to work with.

WAYS TO ENTER DATA:
- Type with the keyboard.
- Copy and paste.
- Import data from a SQLite database (coming soon...).

See settings to choose how to write and paste the data.

SETTINGS
Choose the maximum number of decimal places: 2, 4 (default) or 6. All results are rounded to the eighth decimal.

Choose how to enter the data:
- Separated by lines (default): each data in a line.
- Separated by commas: a comma followed by a space (e.g. 11.25, -23.54, 0.55, 51.33).

Preferences are reset each time the program is closed. In future versions the settings will be saved.

SAVE RESULTS:
You can copy all the solutions to the clipboard to paste them into any text file.

Export to a new text file (coming soon...).

DEVELOPMENT:
The application is still under development, implying at least two things:

	1. It is possible that errors appear (the strange thing would be the opposite).
	2. It is in continuous process of improvement and incorporation of new functions.

This program comes WITHOUT ANY WARRANTY. See the GNU General Public License for more details.

If you want to collaborate to improve this application, you can communicate the errors that you find or the proposals and suggestions that you consider opportune.

Known bugs:
The design of the results window can be broken with very very large numbers.

Thank you for using Stats Calc, I hope they make your life a bit easier!
Jesús Cuerda - webierta@gmail.com"""

		texto_ayuda.buffer.text = info_text
		texto_ayuda.set_left_margin(10)
		texto_ayuda.set_right_margin(10)
		texto_ayuda.set_top_margin(20)

		start: Gtk.TextIter
		end: Gtk.TextIter
		var buffer = texto_ayuda.get_buffer()
		var titulo = buffer.create_tag("titulo",
			"weight", Pango.Weight.BOLD,
			"size", 24000,
			"justification", Gtk.Justification.CENTER)
		var subtitulo = buffer.create_tag("subtitulo",
			"weight", Pango.Weight.BOLD,
			"size", 14000,
			"justification", Gtk.Justification.CENTER)

		var size_txt = buffer.create_tag("size", "size", 12000)

		buffer.get_iter_at_line (out start, 0)
		buffer.get_iter_at_line (out end, 1)
		buffer.apply_tag_by_name ("titulo", start, end)

		buffer.get_iter_at_line (out start, 1)
		buffer.get_iter_at_line (out end, 2)
		buffer.apply_tag_by_name ("subtitulo", start, end)

		buffer.get_iter_at_line (out start, 2)
		buffer.get_iter_at_line (out end, -1)
		buffer.apply_tag_by_name ("size", start, end)

		scrolled_help.add (texto_ayuda)

		this.show_all()
		this.set_keep_above(true)

	def salir_ayuda()
		this.destroy()
