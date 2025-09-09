# Herramienta de Visualización de Datos

Una aplicación web de una sola página (SPA) que permite visualizar datos en formato CSV de manera interactiva, con soporte para diferentes tipos de gráficos y características de accesibilidad.

## Características

- Visualización de datos en formato de tabla
- Generación de gráficos interactivos (barras, líneas, torta)
- Carga de datos mediante copia/pega o subida de archivos CSV
- Temas claro y oscuro
- Características de accesibilidad (WCAG 2.1)
- Diseño responsivo
- Exportación de gráficos a imágenes PNG

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para cargar las bibliotecas externas)

## Instalación

1. Clona o descarga este repositorio
2. Abre el archivo `index.html` en tu navegador

## Uso

### Cargar datos
1. **Método 1**: Pega tus datos CSV en el área de texto
2. **Método 2**: Haz clic en "Seleccionar archivo" para cargar un archivo CSV
3. Haz clic en "Procesar Datos"

### Ver datos
- Los datos se mostrarán en una tabla interactiva
- Usa la barra de desplazamiento horizontal si hay muchas columnas

### Crear gráficos
1. Selecciona la columna para el eje X (categorías)
2. Selecciona una o más columnas para el eje Y (valores)
3. Elige el tipo de gráfico
4. (Opcional) Ingresa un título para el gráfico
5. Haz clic en "Generar Gráfico"

### Exportar
- Para guardar el gráfico como imagen, haz clic en "Exportar Imagen"

### Temas
- **Modo oscuro**: Activa/desactiva el modo oscuro con el interruptor en la esquina superior derecha
- **Alto contraste**: Activa/desactiva el modo de alto contraste para mejor visibilidad

## Características de accesibilidad

Esta aplicación incluye las siguientes características de accesibilidad:

1. **Navegación por teclado**:
   - Navegación completa con teclado
   - Atajos de teclado para funciones comunes
   - Enfoque visible en elementos interactivos

2. **Contraste ajustable**:
   - Modo de alto contraste para mejor legibilidad
   - Controles para cambiar entre temas

3. **Compatibilidad con lectores de pantalla**:
   - Estructura semántica HTML5
   - Atributos ARIA para elementos interactivos
   - Textos alternativos para elementos no textuales

4. **Tamaño de texto escalable**:
   - Diseño flexible que se adapta al zoom del navegador

5. **Mensajes de estado**:
   - Retroalimentación clara para acciones del usuario
   - Alertas para errores y confirmaciones

## Ejemplo de datos CSV

```
Mes,Ventas,Gastos,Beneficios
Enero,1000,400,600
Febrero,1200,450,750
Marzo,1500,500,1000
Abril,1800,600,1200
Mayo,2000,700,1300
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript (ES6+)
- [Chart.js](https://www.chartjs.org/) - Para la generación de gráficos
- [Bootstrap 5](https://getbootstrap.com/) - Para el diseño responsivo
- [Font Awesome](https://fontawesome.com/) - Para iconos

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## Créditos

Desarrollado como parte de un proyecto académico.

## Contacto

Si tienes preguntas o comentarios, por favor abre un issue en el repositorio.
