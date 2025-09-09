# Visualizador de Datos CSV

Una aplicación web interactiva para cargar, visualizar y exportar datos en formato CSV. La aplicación permite a los usuarios cargar archivos CSV, visualizar los datos en una tabla y generar gráficos interactivos de diferentes tipos.

## Características

- **Carga de datos CSV** desde archivo o pegado directo
- **Visualización de datos** en formato de tabla
- **Gráficos interactivos** con soporte para:
  - Gráfico de barras
  - Gráfico de líneas
  - Gráfico circular
  - Gráfico de anillos
- **Exportación de gráficos** como imágenes PNG
- **Interfaz accesible** con:
  - Modo claro/oscuro
  - Ajuste de tamaño de texto
  - Modo de alto contraste
- **Arrastrar y soltar** de archivos CSV
- **Diseño responsivo** que funciona en dispositivos móviles y de escritorio

## Cómo usar

1. **Cargar datos CSV**:
   - Haz clic en "Seleccionar archivo" para cargar un archivo CSV desde tu dispositivo
   - O arrastra y suelta un archivo CSV en el área designada
   - También puedes pegar directamente los datos CSV en el área de texto

2. **Visualizar datos**:
   - Los datos se mostrarán automáticamente en formato de tabla
   - Usa las pestañas para alternar entre la vista de tabla y la vista de gráfico

3. **Generar gráfico**:
   - Selecciona las columnas para los ejes X e Y
   - Elige el tipo de gráfico que deseas generar
   - Haz clic en "Generar Gráfico"

4. **Exportar gráfico**:
   - Una vez generado el gráfico, haz clic en "Exportar Gráfico" para guardarlo como imagen PNG

## Accesibilidad

La aplicación incluye varias características de accesibilidad:

- **Modo oscuro/claro**: Alterna entre temas para una mejor visibilidad
- **Tamaño de texto ajustable**: Aumenta o disminuye el tamaño del texto según tus preferencias
- **Alto contraste**: Activa el modo de alto contraste para una mejor legibilidad
- **Navegación por teclado**: Todas las funciones son accesibles mediante teclado
- **Etiquetas ARIA**: Mejora la compatibilidad con lectores de pantalla

## Tecnologías utilizadas

- HTML5
- CSS3 (con variables CSS para temas)
- JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) - Para la generación de gráficos
- [jQuery](https://jquery.com/) - Para manipulación del DOM
- [Select2](https://select2.org/) - Para menús desplegables mejorados

## Requisitos del sistema

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (solo para cargar las bibliotecas externas)

## Instalación

No se requiere instalación. Simplemente abre el archivo `index.html` en tu navegador.

```bash
# Clonar el repositorio (opcional)
git clone https://github.com/tu-usuario/visualizador-csv.git

# Abrir el archivo index.html en tu navegador
cd visualizador-csv
start index.html  # En Windows
open index.html   # En macOS
xdg-open index.html  # En Linux
```

## Personalización

Puedes personalizar la aplicación modificando los siguientes archivos:

- `styles.css` - Para cambiar los estilos y temas
- `app.js` - Para modificar la lógica de la aplicación
- `index.html` - Para cambiar la estructura de la interfaz de usuario

## Limitaciones

- El análisis de CSV es básico y puede tener problemas con archivos muy grandes o con formatos complejos
- Los gráficos pueden volverse difíciles de leer con conjuntos de datos muy grandes
- No se soportan archivos CSV con codificaciones diferentes a UTF-8

## Solución de problemas

### No se cargan los datos
- Asegúrate de que el archivo CSV tenga un formato válido
- Verifica que el archivo no esté vacío
- Comprueba que el archivo tenga la extensión .csv

### Los gráficos no se generan correctamente
- Asegúrate de haber seleccionado columnas válidas para los ejes X e Y
- Verifica que los datos en las columnas seleccionadas sean del tipo correcto (números para el eje Y)
- Intenta recargar la página si el problema persiste

### Problemas de rendimiento
- Para conjuntos de datos grandes, considera reducir el número de puntos de datos
- Cierra otras pestañas o aplicaciones que puedan estar consumiendo recursos



---

<div align="center">
  <p>Hecho con ❤️ para visualizar datos de manera sencilla</p>
  <p>Última actualización: Septiembre 2023</p>
</div>

