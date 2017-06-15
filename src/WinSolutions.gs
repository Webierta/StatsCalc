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

uses
	Gee
	Gtk
//	Sqlite

class WinSolution: Gtk.ApplicationWindow

	texto_solution: Gtk.TextView

	solution_text_final: string
	solution_text_final_xy: string

	lista_1: list of string
	lista_2: list of string
	lista_3: list of string
	lista_4: list of string
	lista_5: list of string

	def sorted_dic(collection: Gee.Collection of string): Gee.Iterable of string
		var dic = new list of string
		dic.add_all(collection)
		dic.sort ()
		return dic

	def spaces(col: int, datos_dic: dict of(string,string)): list of string
		var lista = new list of string
		var lista_temp = new list of string
		for clave in sorted_dic(datos_dic.keys)
			if (col == 1)
				lista_temp.add(clave[4:clave.length])
			else
				lista_temp.add(datos_dic[clave])
		distancia: int
		if (col == 1)
			distancia = 25
		else if (col == 2)
			distancia = 20
		else if (col == 4)
			distancia = 30
		else
			distancia = 10
		for x in lista_temp
			n_spc: int = distancia - x.length
			spc: string = " "
			for var i = 0 to n_spc
				spc += " "
			x = x + spc + "\t"
			lista.add(x)
		return lista

	def dic_stats1 (datos_1:dict of(string,string))

		solution_text_final = ""

		lista_1 = spaces(1, datos_1)
		lista_2 = spaces(2, datos_1)

		for var i = 0 to ((lista_1.size)-1)  // (lista_1.size/2)-1
			solution_text_final += lista_1.get(i) + lista_2.get(i) + "\n"

		solution_text_final = "\t\t\t\tSET 1\n\n" + solution_text_final

	def dic_stats2 (datos_1:dict of(string,string), datos_2:dict of(string,string),
		datos_3:dict of(string,string))

		solution_text_final = ""

		lista_1 = spaces(1, datos_1)
		lista_2 = spaces(2, datos_1)
		lista_3 = spaces(3, datos_2)

		lista_4 = spaces(1, datos_3)
		lista_5 = spaces(4, datos_3)

		for var i = 0 to ((lista_1.size)-1)  // (lista_1.size/3)-1
			solution_text_final += lista_1.get(i)+lista_2.get(i)+lista_3.get(i)+"\n"

		for var i = 0 to (lista_4.size-1)
			solution_text_final += lista_4.get(0)+lista_5.get(0)+"\n"

		solution_text_final = "\t\t\t\tSET 1\t\t\tSET 2\n\n" + solution_text_final

	def ventana(select_from: string)

		this.set_modal(true)
		this.set_transient_for(win_inicio)
		this.window_position = WindowPosition.CENTER
		this.border_width = 8
		this.set_default_size (950, 500)
		//this.set_is_maximized(true)

		var header = new Gtk.HeaderBar()
		header.show_close_button = true
		header.set_title ("STATS CALC: Results")
		header.set_hexpand (true)
		this.set_titlebar(header)

		var boton_save = new Button.from_icon_name("gtk-save", IconSize.BUTTON)
		boton_save.set_tooltip_text ("Save as")
		header.pack_start(boton_save)
		//boton_save.clicked.connect(guardar_solution)

		var boton_copy = new Button.from_icon_name("gtk-copy", IconSize.BUTTON)
		boton_copy.set_tooltip_text ("Copy all")
		header.pack_start(boton_copy)
		boton_copy.clicked.connect(copy_solution)

		var box_solution = new Gtk.Box (Gtk.Orientation.VERTICAL, 0)
		box_solution.set_hexpand(true)
		box_solution.set_vexpand(true)
		this.add(box_solution)

		var scrolled_solution = new Gtk.ScrolledWindow (null, null)
		box_solution.pack_start (scrolled_solution, true, true, 0)

		texto_solution = new Gtk.TextView()
		texto_solution.set_wrap_mode (Gtk.WrapMode.WORD)
		texto_solution.set_editable(false)
		texto_solution.set_hexpand(true)
		texto_solution.set_monospace(true)

		solution_text:string = solution_text_final

		texto_solution.buffer.text = solution_text
		texto_solution.set_left_margin(10)
		texto_solution.set_right_margin(10)
		texto_solution.set_top_margin(20)

		start: Gtk.TextIter
		end: Gtk.TextIter
		insert: Gtk.TextIter
		var buffer = texto_solution.get_buffer()

		buffer.create_tag("size", "size", 12000)
		buffer.create_tag("weight", "weight", Pango.Weight.BOLD)
		buffer.create_tag("line_color", "background", "aliceblue")

		//buffer.get_iter_at_mark(out insert, buffer.get_insert())
		buffer.get_iter_at_offset(out insert, 0)
		buffer.insert_with_tags_by_name(ref insert, "\t\t\t\t" + select_from + "\n\n", -1, "weight")

		buffer.get_iter_at_line (out start, 0)
		buffer.get_iter_at_line (out end, -1)
		buffer.apply_tag_by_name ("size", start, end)

		for var line = 2 to 9
			buffer.get_iter_at_line (out start, line*2)
			buffer.get_iter_at_line (out end, (line*2)+1)
			buffer.apply_tag_by_name ("line_color", start, end)

		scrolled_solution.add (texto_solution)
		this.show_all()
		this.set_keep_above(true)

	def copy_solution()
		start: Gtk.TextIter
		end: Gtk.TextIter
		var buffer = texto_solution.get_buffer()
		buffer.get_iter_at_offset (out start, 0)
		buffer.get_iter_at_offset (out end, -1)
		buffer.select_range(start, end)
		display: Gdk.Display = this.get_display ()
		var clipboard = Gtk.Clipboard.get_for_display(display, Gdk.SELECTION_CLIPBOARD)
		buffer.copy_clipboard(clipboard)

	def salir_solution()
		this.destroy()
