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

class Calculator: Object

	sumatorio: double = 0
	sumatorio_dif: double = 0
	sumatorio_2: double = 0
	producto: double = 1
	suma_cuadrado: double
	media_arit: double = 0
	mediana:double = 0
	varianza: double = 0
	desviacion: double = 0
	desviacion_media: double = 0
	//negativos:bool = false
	select_from: string = "Population"

	sumatorio_x: double = 0
	sumatorio_y: double = 0
	sumatorio_dif_x: double = 0
	sumatorio_dif_y: double = 0
	sumatorio_2_x: double = 0
	sumatorio_2_y: double = 0
	sumatorio_x_por_y: double = 0
	sumatorio_dif_xy: double
	varianza_x: double = 0
	varianza_y: double = 0
	desviacion_x: double
	desviacion_y: double
	covarianza: double = 0

	dic_cal_1: dict of string, string
	dic_cal_2: dict of string, string

	def calc1(select_dec: string, select_from: string,
		muestra: list of double?): dict of string, string

		if (select_from == "Sample")
			select_from = "S"
		else
			select_from = "P"
		
		dic_cal_1 = new dict of string, string

		// TAMAÑO ENTERO Y ORDEN ASCENDENTE  .sort()
		size_int: int = muestra.size
		for var x = 1 to (muestra.size-1)
			for var y = 0 to (muestra.size-2)
				var v1 = muestra[y]
				var v2 = muestra[y+1]
				if (v1 > v2)
					var r = muestra[y]
					muestra[y] = muestra[y+1]
					muestra[y+1] = r
		print("Orden ascendente:")
		for var i=0 to (muestra.size-1)
			print("%.4f", muestra[i])

		// TAMAÑO DOUBLE
		size: double = muestra.size
		size_str: string = dato_dec_to_str(size, select_dec)
		dic_cal_1["10. Size"] = size_str

		// MINIMO
		minimo: double = muestra.get(0)
		minimo_str: string = dato_dec_to_str(minimo, select_dec)
		dic_cal_1["12. Lowest value"] = minimo_str

		// MAXIMO
		maximo: double = muestra.get(muestra.size-1)
		maximo_str: string = dato_dec_to_str(maximo, select_dec)
		dic_cal_1["14. Highest value"] = maximo_str

		// SUMATORIOS Y PRODUCTO
		for x in muestra
			sumatorio += x
			producto *= x
			suma_cuadrado += x*x
			//if (x < 0)
			//	negativos = true

		// SUMATORIO
		sigma: double = sumatorio
		sigma_str: string = dato_dec_to_str(sigma, select_dec)
		dic_cal_1["16. Summation 𝚺x"] = sigma_str

		// SUMATORIO AL CUADRADO
		sigma2: double = sigma * sigma
		sigma2_str: string = dato_dec_to_str(sigma2, select_dec)
		dic_cal_1["18. Summation squared (𝚺x)²"] = sigma2_str

		// SUMATORIO DE CUADRADOS
		sigmax2: double = suma_cuadrado
		sigmax2_str: string = dato_dec_to_str(sigmax2, select_dec)
		dic_cal_1["20. Sum of squares 𝚺x²"] = sigmax2_str

		// MEDIA ARITMETICA
		media_arit = sumatorio / size
		media_arit_str: string = dato_dec_to_str(media_arit, select_dec)
		dic_cal_1["22. Arithmetic Mean"] = media_arit_str

		// MEDIA GEOMETRICA
		exp: double = 1 / size
		//if (negativos == false)
		media_geo: double = Math.pow(producto, exp)
		media_geo_str: string = dato_dec_to_str(media_geo, select_dec)
		dic_cal_1["24. Geometric Mean"] = media_geo_str

		// MEDIANA
		if (size % 2 == 0)  // Lista par
			pos1:int = (size_int/2)-1
			pos2:int = ((size_int/2)+1)-1
			mediana = (muestra.get(pos1)+muestra.get(pos2))/2
		else  // Lista impar
			pos:int = ((size_int+1)/2)-1
			mediana = muestra.get(pos)
		mediana_str: string = dato_dec_to_str(mediana, select_dec)
		dic_cal_1["26. Median"] = mediana_str

		// MODA [20]

		//RANGO
		rango: double = maximo - minimo
		rango_str: string = dato_dec_to_str(rango, select_dec)
		dic_cal_1["30. Range"] = rango_str

		// SUMATORIOS
		for x in muestra
			sumatorio_dif += Math.fabs(x-media_arit)
			sumatorio_2 += Math.pow((x-media_arit), 2)

		// DESVIACION MEDIA
		desviacion_media = sumatorio_dif/size_int
		desviacion_media_str: string = dato_dec_to_str(desviacion_media, select_dec)
		dic_cal_1["32. Mean Absolute Deviation"] = desviacion_media_str

		if (select_from == "P")
			print "POBLACION"
			//varianza = (sumatorio_2/size_int) - Math.pow(media_arit, 2)
			varianza = sumatorio_2/size_int
			desviacion = Math.sqrt(varianza)
		else
			print "MUESTRA"
			varianza = sumatorio_2/(size_int-1)
			desviacion = Math.sqrt(varianza)

		// VARIANZA
		varianza_str: string = dato_dec_to_str(varianza, select_dec)
		dic_cal_1["34. Variance"] = varianza_str

		// DESVIACION TIPICA
		desviacion_str: string = dato_dec_to_str(desviacion, select_dec)
		dic_cal_1["36. Standard Deviation"] = desviacion_str

		// COEFICIENTE DE VARIACION
		coef_variacion: double = (desviacion/media_arit)
		coef_variacion_str: string = dato_dec_to_str(coef_variacion, select_dec)
		dic_cal_1["38. Coefficient of variation"] = coef_variacion_str

		return dic_cal_1

	def calc2(select_dec: string, select_from: string, muestra1: list of(double?),
		muestra2: list of double?): dict of string, string

//		sumatorio_x: double = 0
//		sumatorio_y: double = 0
//		sumatorio_dif_x: double = 0
//		sumatorio_dif_y: double = 0
//		sumatorio_2_x: double = 0
//		sumatorio_2_y: double = 0
//		sumatorio_x_por_y: double = 0
//		sumatorio_dif_xy: double = 0
//		varianza_x: double = 0
//		varianza_y: double = 0
//		desviacion_x: double
//		desviacion_y: double
//		covarianza: double = 0

		if (select_from == "Sample")
			select_from = "S"
		else
			select_from = "P"

		dic_cal_2 = new dict of string, string

		// TAMAÑO
		size_x: double = muestra1.size
		size_y: double = muestra2.size
		size_int_x: int = muestra1.size
		size_int_y: int = muestra2.size	

		// SUMATORIOS Y PRODUCTO
		for x in muestra1
			sumatorio_x += x
		for y in muestra2
			sumatorio_y += y

		// MEDIA ARITMETICA
		media_arit_x: double = sumatorio_x / size_x
		media_arit_y: double = sumatorio_y / size_y

		// SUMATORIOS
		for x in muestra1
			sumatorio_dif_x += Math.fabs(x-media_arit_x)
			sumatorio_2_x += Math.pow((x-media_arit_x), 2)
		for y in muestra2
			sumatorio_dif_y += Math.fabs(y-media_arit_y)
			sumatorio_2_y += Math.pow((y-media_arit_y), 2)

		//VARIANZA Y DESVIACION
		if (select_from == "P")
			varianza_x = sumatorio_2_x/size_int_x
			varianza_y = sumatorio_2_y/size_int_y
			desviacion_x = Math.sqrt(varianza_x)
			desviacion_y = Math.sqrt(varianza_y)
		else
			varianza_x = sumatorio_2_x/(size_int_x-1)
			varianza_y = sumatorio_2_y/(size_int_y-1)
			desviacion_x = Math.sqrt(varianza_x)
			desviacion_y = Math.sqrt(varianza_y)

		// COVARIANZA
		if (size_int_x == size_int_y)

			for var xy = 0 to (muestra1.size-1)
				sumatorio_x_por_y += (muestra1[xy]*muestra2[xy])
			print("SUMATORIO X Y = %.4f", sumatorio_x_por_y)

			for var xy = 0 to (muestra1.size-1)
				sumatorio_dif_xy += (muestra1[xy]-media_arit_x)*(muestra2[xy]-media_arit_y)
				print("SUMATORIO DIF XY = %.4f = %.4f - %.4f", sumatorio_dif_xy, muestra1[xy],media_arit_x)

			if (select_from == "P")
				//covarianza = ((sumatorio_x_por_y/(size_x)) - (media_arit_x * media_arit_y))
				covarianza = sumatorio_dif_xy / size_x
			else
				//covarianza = ((sumatorio_x_por_y/(size_int_x-1)) - (media_arit_x * media_arit_y))
				covarianza = sumatorio_dif_xy / (size_x-1)		

			print("SUMATORIO X POR Y = %.4f", sumatorio_dif_xy)
			print("COVARIANZA = %.4f", covarianza)

			covarianza_str: string = dato_dec_to_str(covarianza, select_dec)
			dic_cal_2["40. Covariance"] = covarianza_str

		for clave in dic_cal_2.keys
			print("SOLUCION4: %s = %s", clave, dic_cal_2[clave])

		return dic_cal_2


	def dato_dec_to_str (dec:double, select_dec:string): string
		print("DECIMALES SELECCIONADOS: %s", select_dec)
		decimal_setting:int = int.parse(select_dec)
		//dec = Math.round (dec)
		//dato_str:string = dec.to_string()

		//dato_str: string = numero.format(buf)	// SOLUCION CON 4 DECIMALES
		buf: array of char = new array of char[double.DTOSTR_BUF_SIZE]
		dato_str: string = dec.format(buf, "%.8lf")	// REDONDEA A 8 DECIMALES
		print"DATOS"
		print(dato_str)

		largo: int = dato_str.length
		if (dato_str != "0.00000000") and (dato_str != "-0.00000000")
			while (dato_str[largo-1:largo] == "0" or dato_str[largo-1:largo] == ".")
				if (dato_str[largo-1:largo] == "0" or dato_str[largo-1:largo] == ".")
					dato_str = dato_str.splice(largo-1, largo, "")
				largo = dato_str.length
		else
			dato_str = "0"

		print(dato_str)
		if dato_str.contains (".")
			punto:int = dato_str.index_of(".")
			fin:int = dato_str.length
			deci:int = (fin-1) - punto
			print("DECIMALES: %i", deci)
			if (deci > decimal_setting)
				deci = decimal_setting
			dato_str = dato_str[0: punto+deci+1]
			return dato_str
		else
			return dato_str
