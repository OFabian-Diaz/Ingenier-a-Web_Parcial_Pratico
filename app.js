/**
 * Visualizador Interactivo de Datos CSV
 * 
 * Esta aplicación permite cargar, visualizar y analizar datos en formato CSV
 * a través de una interfaz web accesible y fácil de usar.
 */

// Variables globales
let csvData = [];
let headers = [];
let currentChart = null;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar event listeners
    initEventListeners();
    
    // Cargar preferencias guardadas
    loadPreferences();
});

// Inicializar event listeners
function initEventListeners() {
    // Botones principales
    document.getElementById('parseBtn').addEventListener('click', parseCSV);
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('generateChartBtn').addEventListener('click', generateChart);
    document.getElementById('exportChartBtn').addEventListener('click', exportChart);
    
    // Controles de accesibilidad
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('fontSizeBtn').addEventListener('click', toggleFontSize);
    document.getElementById('contrastBtn').addEventListener('click', toggleHighContrast);
    
    // Navegación por pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.getAttribute('data-tab')));
    });
    
    // Permitir arrastrar y soltar archivos
    setupDragAndDrop();
}

// Manejar la carga de archivos CSV
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('fileName').textContent = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('csvData').value = e.target.result;
        parseCSV();
    };
    reader.readAsText(file);
}

// Configurar arrastrar y soltar archivos
function setupDragAndDrop() {
    const dropArea = document.body;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    document.body.classList.add('highlight');
}

function unhighlight() {
    document.body.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length) {
        const file = files[0];
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            document.getElementById('fileInput').files = files;
            document.getElementById('fileName').textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('csvData').value = e.target.result;
                parseCSV();
            };
            reader.readAsText(file);
        } else {
            showError('Por favor, sube un archivo CSV válido.');
        }
    }
}

// Analizar el texto CSV
function parseCSV() {
    try {
        const csvText = document.getElementById('csvData').value.trim();
        
        if (!csvText) {
            showError('Por favor, ingresa o carga un archivo CSV.');
            return;
        }
        
        // Dividir las líneas del CSV
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
            showError('El archivo CSV debe tener al menos una fila de encabezados y una fila de datos.');
            return;
        }
        
        // Obtener los encabezados
        headers = parseCSVLine(lines[0]);
        
        // Procesar las filas de datos
        csvData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length !== headers.length) continue; // Saltar filas inválidas
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            csvData.push(row);
        }
        
        if (csvData.length === 0) {
            showError('No se encontraron datos válidos en el archivo CSV.');
            return;
        }
        
        // Actualizar la interfaz de usuario
        updateUIAfterParse();
        
    } catch (error) {
        console.error('Error al analizar el CSV:', error);
        showError('Error al analizar el archivo CSV. Asegúrate de que el formato sea correcto.');
    }
}

// Analizar una línea de CSV, manejando comillas y comas dentro de campos
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Añadir el último valor
    values.push(current.trim());
    
    return values;
}

// Actualizar la interfaz después de analizar el CSV
function updateUIAfterParse() {
    // Mostrar la sección de datos
    document.getElementById('dataSection').classList.remove('hidden');
    
    // Generar la tabla
    generateTable();
    
    // Actualizar los selectores de ejes
    updateAxisSelectors();
    
    // Generar un gráfico por defecto
    if (headers.length >= 2) {
        document.getElementById('xAxis').value = headers[0];
        document.getElementById('yAxis').value = headers[1];
        generateChart();
    }
    
    // Desplazarse a la sección de datos
    document.getElementById('dataSection').scrollIntoView({ behavior: 'smooth' });
}

// Generar la tabla HTML
function generateTable() {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    // Limpiar la tabla
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Agregar encabezados
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });
    
    // Agregar filas de datos
    csvData.forEach(row => {
        const tr = document.createElement('tr');
        
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] || '';
            tr.appendChild(td);
        });
        
        tableBody.appendChild(tr);
    });
}

// Actualizar los selectores de ejes
function updateAxisSelectors() {
    const xAxisSelect = document.getElementById('xAxis');
    const yAxisSelect = document.getElementById('yAxis');
    
    // Limpiar selectores
    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';
    
    // Llenar con los encabezados
    headers.forEach(header => {
        const option1 = document.createElement('option');
        option1.value = header;
        option1.textContent = header;
        xAxisSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = header;
        option2.textContent = header;
        yAxisSelect.appendChild(option2);
    });
    
    // Actualizar Select2
    $(xAxisSelect).trigger('change');
    $(yAxisSelect).trigger('change');
}

// Generar el gráfico
function generateChart() {
    try {
        const xAxis = document.getElementById('xAxis').value;
        const yAxis = document.getElementById('yAxis').value;
        const chartType = document.getElementById('chartType').value;
        
        if (!xAxis || !yAxis) {
            showError('Por favor selecciona los ejes X e Y para generar el gráfico.');
            return;
        }
        
        // Asegurarse de que el contenedor del gráfico sea visible
        document.getElementById('chartTab').classList.add('active');
        document.getElementById('tableTab').classList.remove('active');
        
        // Preparar datos para el gráfico
        const labels = [];
        const data = [];
        
        csvData.forEach(row => {
            if (row[xAxis] !== undefined && row[yAxis] !== undefined) {
                labels.push(String(row[xAxis]));
                const value = parseFloat(row[yAxis]);
                data.push(isNaN(value) ? 0 : value);
            }
        });
        
        // Obtener el canvas y su contexto
        const canvas = document.getElementById('chartCanvas');
        const ctx = canvas.getContext('2d');
        
        // Limpiar el canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Destruir el gráfico anterior si existe
        if (currentChart) {
            currentChart.destroy();
        }
        
        // Configuración base del gráfico
        const chartConfig = {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    label: yAxis,
                    data: data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${yAxis} por ${xAxis}`,
                        font: { size: 16 }
                    },
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('es-ES').format(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: { 
                        title: { 
                            display: true, 
                            text: xAxis 
                        } 
                    },
                    y: { 
                        title: { 
                            display: true, 
                            text: yAxis 
                        },
                        beginAtZero: true 
                    }
                }
            }
        };
        
        // Configuración específica para gráficos circulares
        if (chartType === 'pie' || chartType === 'doughnut') {
            delete chartConfig.options.scales; // Eliminar escalas para gráficos circulares
            chartConfig.options.cutout = chartType === 'doughnut' ? '60%' : '0%';
        }
        
        // Crear el nuevo gráfico
        currentChart = new Chart(ctx, chartConfig);
        
        // Habilitar el botón de exportación
        document.getElementById('exportChartBtn').disabled = false;
        
    } catch (error) {
        console.error('Error al generar el gráfico:', error);
        showError(`Error al generar el gráfico: ${error.message}`);
    }
}

// Exportar el gráfico como imagen
function exportChart() {
    if (!currentChart) return;
    
    const link = document.createElement('a');
    link.download = 'grafico.png';
    link.href = document.getElementById('chartCanvas').toDataURL('image/png');
    link.click();
}

// Cambiar entre pestañas
function switchTab(tabId) {
    // Actualizar botones de pestaña
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    // Mostrar el contenido de la pestaña seleccionada
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `${tabId}Tab`);
    });
}

// Alternar entre tema claro y oscuro
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    savePreferences();
    updateThemeButton();
}

// Actualizar el ícono del botón de tema
function updateThemeButton() {
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Alternar tamaño de fuente
function toggleFontSize() {
    const body = document.body;
    
    if (body.classList.contains('larger-text')) {
        body.classList.remove('larger-text');
        body.classList.remove('large-text');
    } else if (body.classList.contains('large-text')) {
        body.classList.remove('large-text');
        body.classList.add('larger-text');
    } else {
        body.classList.add('large-text');
    }
    
    savePreferences();
}

// Alternar modo de alto contraste
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    savePreferences();
}

// Mostrar mensaje de error
function showError(message) {
    alert(message); // En una aplicación real, podrías usar un sistema de notificaciones más elegante
}

// Cargar preferencias guardadas
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('csvViewerPreferences')) || {};
    
    // Tema
    if (preferences.theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Tamaño de fuente
    if (preferences.fontSize === 'large') {
        document.body.classList.add('large-text');
    } else if (preferences.fontSize === 'larger') {
        document.body.classList.add('larger-text');
    }
    
    // Alto contraste
    if (preferences.highContrast) {
        document.body.classList.add('high-contrast');
    }
    
    updateThemeButton();
}

// Guardar preferencias
function savePreferences() {
    const preferences = {
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
        fontSize: document.body.classList.contains('larger-text') ? 'larger' : 
                 (document.body.classList.contains('large-text') ? 'large' : 'normal'),
        highContrast: document.body.classList.contains('high-contrast')
    };
    
    localStorage.setItem('csvViewerPreferences', JSON.stringify(preferences));
}
