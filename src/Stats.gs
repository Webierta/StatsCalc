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
// Sqlite

win_inicio: Gtk.ApplicationWindow

init

	Intl.setlocale( LocaleCategory.ALL, "" )
	new StatsCalc ("stats.calc",
		ApplicationFlags.HANDLES_OPEN).run(args)

class StatsCalc: Gtk.Application

	version: string = "0.0.1"
	icon: Gdk.Pixbuf

	win_inicio: Gtk.ApplicationWindow
	win_write: Gtk.ApplicationWindow

	select_from: string = "Population"
	select_groups: string = "1"
	select_dec: string = "4"
	boton_dec: string
	select_sep: string = "Lines"
	boton_sep : string


	write: Gtk.TextView
	//write2: Gtk.TextView
	write3: Gtk.TextView
	header_write: Gtk.HeaderBar
	write_ok: Button

	set_1: dict of string, string
	set_2: dict of string, string
	set_3: dict of string, string

	construct (application_id: string, flags: ApplicationFlags)
		if !id_is_valid(application_id)
			error("Error: application id %s is not valid", application_id)
		this.application_id = application_id
		this.flags = flags

	def salida()
		win_inicio.destroy()
		Process.exit(0)

	def setting()

		var dialogo_settings = new Gtk.Dialog.with_buttons ("Settings",
			win_inicio,
			Gtk.DialogFlags.MODAL | Gtk.DialogFlags.DESTROY_WITH_PARENT,
			"gtk-cancel", Gtk.ResponseType.CANCEL,
			"gtk-ok", Gtk.ResponseType.OK)

		dialogo_settings.set_default_size (300, 300)
		dialogo_settings.set_border_width (4)

		var content_area = dialogo_settings.get_content_area ()
		content_area.set_spacing (10)
		content_area.set_border_width (10)

		var grid = new Gtk.Grid()
		content_area.add (grid)

		var setting_dec = new Gtk.Frame("<b>Maximum Number of Decimal Places in Results</b>")
		(setting_dec.label_widget as Gtk.Label).use_markup = true
		var caja_dec = new Box (Orientation.VERTICAL, 0)
		setting_dec.add(caja_dec)
		//caja_from.border_width = 10
		var dec_1 = new Gtk.RadioButton.with_label_from_widget (null, "2")
		var dec_2 = new Gtk.RadioButton.with_label_from_widget (dec_1, "4")
		var dec_3 = new Gtk.RadioButton.with_label_from_widget (dec_1, "6")
		dec_1.toggled.connect(dec_select)
		dec_2.toggled.connect(dec_select)
		dec_3.toggled.connect(dec_select)
		caja_dec.pack_start(dec_1, true, false, 5)
		caja_dec.pack_start(dec_2, true, false, 5)
		caja_dec.pack_start(dec_3, true, false, 5)

		case select_dec
			when "2"
				dec_1.set_active(true)
			when "4"
				dec_2.set_active(true)
			when "6"
				dec_3.set_active(true)
			default
				dec_1.set_active(true)

		var setting_sep = new Gtk.Frame("<b>Enter data separated by</b>")
		(setting_sep.label_widget as Gtk.Label).use_markup = true
		var caja_sep = new Box (Orientation.VERTICAL, 0)
		setting_sep.add(caja_sep)
		var sep_1 = new Gtk.RadioButton.with_label_from_widget (null, "Lines")
		var sep_2 = new Gtk.RadioButton.with_label_from_widget (sep_1, "Commas")
		sep_1.toggled.connect(sep_select)
		sep_2.toggled.connect(sep_select)
		caja_sep.pack_start(sep_1, true, false, 5)
		caja_sep.pack_start(sep_2, true, false, 5)
		case select_sep
			when "Lines"
				sep_1.set_active(true)
			when "Commas"
				sep_2.set_active(true)
			default
				sep_1.set_active(true)

		grid.attach(setting_dec, 1, 1, 1, 1)
		grid.attach(setting_sep, 1, 2, 1, 1)
		dialogo_settings.show_all()

		run_setting:int = dialogo_settings.run()
		if run_setting == Gtk.ResponseType.OK
			select_dec = boton_dec
			select_sep = boton_sep
			dialogo_settings.destroy()
		else if run_setting == Gtk.ResponseType.CANCEL
			dialogo_settings.destroy()

	def dec_select(button: Gtk.ToggleButton)
		if (button.get_active())
			boton_dec = button.get_label()

	def sep_select(button: Gtk.ToggleButton)
		if (button.get_active())
			boton_sep = button.get_label()
//			if (boton_sep == "Commas")
//				boton_sep = ", "
//			else
//				boton_sep = "\n"

	def ayuda()
		new WinHelp()

	def acercade()
		var about = new Gtk.ApplicationWindow(this)
		try
			icon = new Gdk.Pixbuf.from_file_at_scale("img/sumatorio.jpg", 150, 150, true)
		except e: Error
			msg_error: string = e.message + "\nUnloaded image."
			var noti = new MessageDialog(about, Gtk.DialogFlags.MODAL,
				Gtk.MessageType.WARNING, Gtk.ButtonsType.CLOSE, msg_error)
			var res_noti = noti.run()
			if res_noti == Gtk.ResponseType.CLOSE
				noti.destroy()
		authors: array of string = { "JESUS CUERDA VILLANUEVA", "webierta@gmail.com"}
		license: string = ("Copyleft 2017 Jesús Cuerda - All Wrongs Reserved.\n\n"
			+ "Stats Calc is free software: you can redistribute it and/or modify\n"
			+ "it under the terms of the GNU General Public License as published\n"
			+ "by the Free Software Foundation, either version 3 of the License,\n"
			+ "or (at your option) any later version.\n\n"
			+ "Stats Calc is distributed in the hope that it will be useful, but\n"
			+ "WITHOUT ANY WARRANTY; without even the implied warranty of\n"
			+ "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See\n"
			+ "the GNU General Public License for more details.\n\n"
			+ "You should have received a copy of the GNU General Public\n"
			+ "License along with Stats Calc.\n"
			+ "If not, see <http://www.gnu.org/licenses/>.")
		Gtk.show_about_dialog (about,
			"program-name", ("Stats Calc"),
			"logo", icon,
			"copyright", ("Copyleft 2017 - Jesús Cuerda - All Wrongs Reserved"),
			"version", version,
			"comments", "Statistics Calculator",
			"license", license,
			"authors", authors,
			"website", "http://genie.webierta.skn1.com",
			"website-label", ("Genie Doc"),
			null)

	def override activate ()

		win_inicio = new Gtk.ApplicationWindow(this)
		win_inicio.window_position = WindowPosition.CENTER
		win_inicio.set_border_width(10)
		//win_inicio.set_default_size(600, 400)
		win_inicio.destroy.connect(salida)

		var header = new Gtk.HeaderBar()
		header.show_close_button = true
		header.set_title("STATS CALC")
		header.set_hexpand(true)
		win_inicio.set_titlebar(header)

		var barra = new Gtk.MenuBar()
		header.pack_start(barra)

		var caja_op = new Box(Orientation.HORIZONTAL, 0)
		var im_op = new Image.from_icon_name("gtk-justify-fill", IconSize.LARGE_TOOLBAR)
		caja_op.pack_start(im_op, false, false, 0)

		var item_op = new Gtk.MenuItem()
		item_op.set_tooltip_text("Options")
		item_op.add(caja_op)
		barra.add(item_op)

		var filemenu = new Gtk.Menu()
		item_op.set_submenu(filemenu)

		var caja_set = new Box(Orientation.HORIZONTAL, 4)
		var im_set = new Image.from_icon_name("gtk-preferences", IconSize.MENU)
		var eti_set = new Label("Settings")
		caja_set.pack_start(im_set, false, false, 0)
		caja_set.pack_start(eti_set, false, false, 0)
		var item_set = new Gtk.MenuItem()
		item_set.add(caja_set)
		filemenu.add(item_set)
		item_set.activate.connect(setting)

		var sep1 = new SeparatorMenuItem()
		filemenu.append(sep1)

		var caja_ay = new Box (Orientation.HORIZONTAL, 4)
		var im_ay = new Image.from_icon_name("gtk-help", IconSize.MENU)
		var eti_ay = new Label ("Help")
		caja_ay.pack_start(im_ay, false, false, 0)
		caja_ay.pack_start(eti_ay, false, false, 0)
		var item_ay = new Gtk.MenuItem()
		item_ay.add(caja_ay)
		filemenu.add(item_ay)
		item_ay.activate.connect(ayuda)

		var caja_ab = new Box (Orientation.HORIZONTAL, 4)
		var im_ab = new Image.from_icon_name("gtk-about", IconSize.MENU)
		var eti_ab = new Label ("About")
		caja_ab.pack_start(im_ab, false, false, 0)
		caja_ab.pack_start(eti_ab, false, false, 0)
		var item_ab = new Gtk.MenuItem()
		item_ab.add(caja_ab)
		filemenu.add(item_ab)
		item_ab.activate.connect(acercade)

		var sep2 = new SeparatorMenuItem()
		filemenu.append(sep2)

		var caja_exit = new Box (Orientation.HORIZONTAL, 4)
		var im_exit = new Image.from_icon_name("gtk-quit", IconSize.MENU)
		var eti_exit = new Label ("Exit")
		caja_exit.pack_start(im_exit, false, false, 0)
		caja_exit.pack_start(eti_exit, false, false, 0)
		var item_exit = new Gtk.MenuItem()
		item_exit.add(caja_exit)
		filemenu.add(item_exit)
		item_exit.activate.connect(salida)

		var grid = new Gtk.Grid()
		grid.set_column_spacing(10)
		grid.set_column_homogeneous(false)
		grid.set_row_spacing(10)
		grid.set_border_width (10)
		win_inicio.add (grid)

		var titulo_inicio = new Gtk.Label(
			"<span foreground='blue' size='xx-large'>Stats Calc</span>")
		titulo_inicio.use_markup = true

		var subtit_inicio = new Gtk.Label("Statistics Calculator")

		var logo_inicio = new Gtk.Image ()
		logo_inicio.set_from_file ("img/sumatorio.jpg")

		var data_from = new Gtk.Frame("<b>Data from</b>")
		(data_from.label_widget as Gtk.Label).use_markup = true
		var caja_from = new Box (Orientation.VERTICAL, 0)
		data_from.add(caja_from)
		//caja_from.border_width = 10
		var data_from_1 = new Gtk.RadioButton.with_label_from_widget (null, "Population")
		var data_from_2 = new Gtk.RadioButton.with_label_from_widget (data_from_1, "Sample")
		data_from_1.toggled.connect(data_from_select)
		caja_from.pack_start(data_from_1, true, false, 5)
		caja_from.pack_start(data_from_2, true, false, 5)

		var data_groups = new Gtk.Frame("<b>Data Sets</b>")
		(data_groups.label_widget as Gtk.Label).use_markup = true
		var caja_groups = new Box (Orientation.VERTICAL, 0)
		data_groups.add(caja_groups)
		//caja_groups.border_width = 10
		var data_groups_1 = new Gtk.RadioButton.with_label_from_widget (null, "1")
		var data_groups_2 = new Gtk.RadioButton.with_label_from_widget (data_groups_1, "2")
		data_groups_1.toggled.connect(data_groups_select)
		caja_groups.pack_start(data_groups_1, true, false, 5)
		caja_groups.pack_start(data_groups_2, true, false, 5)

		var data_enter = new Gtk.Frame("<b>Enter Data</b>")
		(data_enter.label_widget as Gtk.Label).use_markup = true
		var caja_enter = new Box (Orientation.HORIZONTAL, 0)
		caja_enter.border_width = 10
		data_enter.add (caja_enter)
		var enter_write = new Button.with_label("Type or Paste")
		var enter_import = new Button.with_label("Import from SQLite")
		caja_enter.pack_start(enter_write, true, false, 5)
		caja_enter.pack_start(enter_import, true, false, 5)
		enter_write.clicked.connect(type)

		grid.attach(titulo_inicio, 1, 0, 2, 1)
		grid.attach(subtit_inicio, 1, 1, 2, 1)
		grid.attach(logo_inicio,   1, 2, 2, 1)
		grid.attach(data_from,	   1, 3, 1, 1)
		grid.attach(data_groups,   2, 3, 1, 1)
		grid.attach(data_enter,	   1, 4, 2, 1)

		win_inicio.show_all()

	def salir_write()
		win_write.destroy()

	// DETECTA CARACTERES NO VALIDOS, REPETIDOS (- y .) Y MAL POSICIONADOS (-)
	def verify(select_sep: string, datos:string):list of string

		detect_invalido: bool = false
		caracteres_validos: string = "0123456789.-"
		var datos_string = new list of string
		var datos_malos = new list of string

		datos_win: string = datos.replace("\r\n", "\n")

		if (select_sep == "Commas")
			select_sep = ", "
			datos_win = datos_win.replace("\n", "")
		else
			select_sep = "\n"

		print("VERIFICANDO: %s", select_sep)

		for dato in datos_win.split(select_sep)   //("\n") (", ")
			cont_neg: int = 0
			cont_pun: int = 0
			if (dato.length > 0)
				for var i = 0 to (dato.length-1)
					if (dato[i].to_string() in caracteres_validos) == false
						print("%s NO", dato)
						detect_invalido = true
						break
					else if (dato[i].to_string() == "-")
						cont_neg +=1
						if (cont_neg > 1)
							print "MUCHOS NEGATIVOS"
							detect_invalido = true
							break
						if (dato.to_string().index_of("-") != 0)
							print("NEGATIVO NO INICIAL")
							detect_invalido = true
							break
					else if (dato[i].to_string() == ".")
						cont_pun +=1
						if (cont_pun > 1)
							print "MUCHOS PUNTOS"
							detect_invalido = true
							break
					else
						print("%s OK", dato)

		// RECOPILA DATOS VALIDOS
		if (detect_invalido == true)
			print("LISTA DE DATOS VACIA1")
			return datos_malos
		else
			for dato in datos_win.split(select_sep)	// ("\n") (", ")
				if (dato.length > 0)
					datos_string.add(dato)
			if (datos_string.size > 0)
				return datos_string
			else
				print("LISTA DE DATOS VACIA2")
				return datos_malos

	def no_valid()
		msg: string = ("Invalid data detected!\n"
			+ "Check the settings for entering data.\n"
			+ "Only numbers. These can be integers,\n"
			+ "decimals, positives or negatives.\n"
			+ "Decimal numbers use a point (e.g. 11.25).\n"
			+ "See help for more information.")
		var noti = new MessageDialog(win_write, Gtk.DialogFlags.MODAL,
		Gtk.MessageType.ERROR, Gtk.ButtonsType.CLOSE, msg)
		var res_noti = noti.run()
		if res_noti == Gtk.ResponseType.CLOSE
			noti.destroy()

	def ok_write()
		todo_ok1: bool = false
		todo_ok2: bool = false
		todo_ok3: bool = false

		var muestra1 = new list of string
		var muestra1_double = new list of double?
		var muestra2 = new list of string
		var muestra2_double = new list of double?

		if (select_groups == "1")
			if (write.buffer.text != "")
				muestra1 = verify(select_sep, write.buffer.text)

				if (muestra1.size > 0)
					print("LISTA DE DATOS 1:")
					for t in muestra1
						muestra1_double.add(double.parse(t))
					for n in muestra1_double
						print("%.4f", n)
					todo_ok1 = true
					todo_ok2 = false
					todo_ok3 = false
				else
					print("LISTA MALA 1")
					todo_ok1 = false
					todo_ok2 = false
					todo_ok3 = false
			else
				print "NADA 1"
				todo_ok1 = false
				todo_ok2 = false
				todo_ok3 = false

		else if (select_groups == "2")
			if (write.buffer.text != "")
				muestra1 = verify(select_sep, write.buffer.text)
				if (muestra1.size > 0)
					print("LISTA DE DATOS 1/2:")
					for t in muestra1
						muestra1_double.add(double.parse(t))
					for n in muestra1_double
						print("%.4f", n)
					todo_ok2 = true
					todo_ok1 = false
				else
					print("LISTA MALA 1/2")
					todo_ok2 = false
					todo_ok3 = false
					todo_ok1 = false
			else
				print "NADA 1/2"
				todo_ok2 = false
				todo_ok3 = false
				todo_ok1 = false
			if (write3.buffer.text != "")
				muestra2 = verify(select_sep, write3.buffer.text)
				if (muestra2.size > 0)
					print("LISTA DE DATOS 2:")
					for t in muestra2
						muestra2_double.add(double.parse(t))
					for n in muestra2_double
						print("%.4f", n)
					todo_ok3 = true
					todo_ok1 = false
				else
					print("LISTA MALA 2")
					todo_ok3 = false
					todo_ok2 = false
					todo_ok1 = false
			else
				print "NADA 2"
				todo_ok3 = false
				todo_ok2 = false
				todo_ok1 = false

		if (todo_ok1 == true)
			var calculando1 = new Calculator
			set_1 = calculando1.calc1(select_dec, select_from, muestra1_double)
			win_write.destroy()
			
			var solution = new WinSolution()
			solution.dic_stats1(set_1)
			solution.ventana(select_from)

		else if ((todo_ok2 == true) and (todo_ok3 == true))

			var calculando3 = new Calculator
			set_3 = calculando3.calc2(select_dec, select_from, muestra1_double, muestra2_double)
					
			var calculando1 = new Calculator
			set_1 = calculando1.calc1(select_dec, select_from, muestra1_double)
			
			var calculando2 = new Calculator
			set_2 = calculando2.calc1(select_dec, select_from, muestra2_double)

			win_write.destroy()
			
			var solution = new WinSolution()
			solution.dic_stats2(set_1, set_2, set_3)
			solution.ventana(select_from)

		else
			no_valid()

	def help_write()
		msg: string = ("How to enter data.\n"
			+ "Check the settings for entering data.\n"
			+ "Only numbers. These can be integers,\n"
			+ "decimals, positives or negatives.\n"
			+ "Decimal numbers use a point (e.g. 11.25).\n"
			+ "See help for more information.")
		var noti = new MessageDialog(win_write, Gtk.DialogFlags.MODAL,
		Gtk.MessageType.INFO, Gtk.ButtonsType.CLOSE, msg)
		var res_noti = noti.run()
		if res_noti == Gtk.ResponseType.CLOSE
			noti.destroy()

	def clear_write1()
		write.buffer.text = ""

	def clear_write2()
		//write2.buffer.text = ""
		write.buffer.text = ""

	def clear_write3()
		write3.buffer.text = ""

	def type()

		win_write = new Gtk.ApplicationWindow(this)
		win_write.set_modal(true)
		win_write.set_transient_for(win_inicio)
		win_write.window_position = WindowPosition.CENTER
		win_write.border_width = 4
		//win_write.set_default_size (250, 400)
		win_write.default_height = 400

		header_write = new Gtk.HeaderBar()
		header_write.show_close_button = true
		header_write.set_title ("One data set")
		header_write.set_hexpand (true)
		win_write.set_titlebar(header_write)

		var write_help = new Button.from_icon_name("gtk-dialog-info", IconSize.MENU)
		write_help.set_tooltip_text ("How to enter data")
		write_help.clicked.connect(help_write)
		header_write.pack_start(write_help)

		if (select_groups == "1")
			var write_clear1 = new Button.from_icon_name("gtk-clear", IconSize.MENU)
			write_clear1.set_tooltip_text ("Clear all")
			write_clear1.clicked.connect(clear_write1)
			header_write.pack_start(write_clear1)

		else if (select_groups == "2")
			var write_clear2 = new Button.from_icon_name("gtk-clear", IconSize.MENU)
			write_clear2.set_tooltip_text ("Clear Set 1")
			write_clear2.clicked.connect(clear_write2)
			header_write.pack_start(write_clear2)

			var write_clear3 = new Button.from_icon_name("gtk-clear", IconSize.MENU)
			write_clear3.set_tooltip_text ("Clear Set 2")
			write_clear3.clicked.connect(clear_write3)
			header_write.pack_end(write_clear3)

		var box_write = new Gtk.Box(Gtk.Orientation.VERTICAL, 4)  // CAJA PRINCIPAL (GRUPOS Y BOTONES)
		box_write.set_hexpand(true)
		box_write.set_vexpand(true)
		win_write.add(box_write)

		var box_group = new Gtk.Box(Gtk.Orientation.HORIZONTAL, 4)		// CAJA GRUPOS

		if (select_groups == "1")
			write = new Gtk.TextView()								// Subcaja grupo 1
			write.set_wrap_mode (Gtk.WrapMode.WORD)
			write.set_editable(true)
			write.set_hexpand(true)
			write.buffer.text = ""

			var scrolled_write = new Gtk.ScrolledWindow (null, null)
			scrolled_write.add(write)
			box_group.pack_start(scrolled_write, true, true, 0)

		else if (select_groups == "2")

			header_write.set_title ("Two data sets")

			write = new Gtk.TextView()								// Subcaja grupo 1
			write.set_wrap_mode (Gtk.WrapMode.WORD)
			write.set_editable(true)
			write.set_hexpand(true)
			//write.set_overwrite(true)
			write.buffer.text = ""

			var scrolled_write = new Gtk.ScrolledWindow (null, null)
			scrolled_write.add(write)
			box_group.pack_start(scrolled_write, true, true, 0)

//			write2 = new Gtk.TextView()								// Subcaja grupo 1
//			write2.set_wrap_mode (Gtk.WrapMode.WORD)
//			write2.set_editable(true)
//			write2.set_hexpand(true)
//			write2.buffer.text = ""

//			var scrolled_write2 = new Gtk.ScrolledWindow (null, null)
//			scrolled_write2.add(write)
//			box_group.pack_start(scrolled_write2, true, true, 0)

			write3 = new Gtk.TextView()
			write3.set_wrap_mode (Gtk.WrapMode.WORD)
			write3.set_editable(true)
			write3.set_hexpand(true)
			write3.buffer.text = ""

			var scrolled_write3 = new Gtk.ScrolledWindow (null, null)
			scrolled_write3.add(write3)
			box_group.pack_start(scrolled_write3, true, true, 0)

		var box_botones = new Gtk.Box(Gtk.Orientation.HORIZONTAL, 0)
		var write_cancel = new Button.with_label("Cancel")
		write_ok = new Button.with_label("Enter")
		write_cancel.clicked.connect(salir_write)
		write_ok.clicked.connect(ok_write)

		box_botones.pack_start(write_cancel, true, true, 2)
		box_botones.pack_start(write_ok, true, true, 2)

		box_write.pack_start (box_group, true, true, 0)
		box_write.pack_start(box_botones, false, false, 0)

		win_write.show_all ()
		win_write.set_keep_above(true)

	def data_from_select(button: Gtk.ToggleButton)
		if (button.get_active())
			select_from = button.get_label()
		else
			select_from = "Sample"

	def data_groups_select(button: Gtk.ToggleButton)
		if (button.get_active())
			select_groups = button.get_label()
		else
			select_groups = "2"
