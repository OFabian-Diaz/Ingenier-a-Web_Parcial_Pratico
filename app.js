// DOM Elements
const csvInput = document.getElementById('csvInput');
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const clearBtn = document.getElementById('clearBtn');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const chartConfigForm = document.getElementById('chartConfigForm');
const xAxisSelect = document.getElementById('xAxis');
const yAxisSelect = document.getElementById('yAxis');
const chartTypeSelect = document.getElementById('chartType');
const chartTitleInput = document.getElementById('chartTitle');
const exportChartBtn = document.getElementById('exportChartBtn');
const dataChart = document.getElementById('dataChart').getContext('2d');
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleHighContrast = document.getElementById('toggleHighContrast');

// Global variables
let chart = null;
let currentData = [];
let headers = [];

// Initialize the application
function init() {
    setupEventListeners();
    setThemeFromLocalStorage();
    setupAccessibility();
}

// Set up event listeners
function setupEventListeners() {
    processBtn.addEventListener('click', processCSV);
    clearBtn.addEventListener('click', clearAll);
    fileInput.addEventListener('change', handleFileUpload);
    chartConfigForm.addEventListener('submit', generateChart);
    exportChartBtn.addEventListener('click', exportChart);
    darkModeToggle.addEventListener('change', toggleDarkMode);
    toggleHighContrast.addEventListener('click', toggleHighContrastMode);
    
    // Keyboard navigation for accessibility
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Set up accessibility features
function setupAccessibility() {
    // Add ARIA attributes
    csvInput.setAttribute('aria-label', 'Área de texto para pegar datos CSV');
    fileInput.setAttribute('aria-label', 'Seleccionar archivo CSV');
    processBtn.setAttribute('aria-label', 'Procesar datos CSV');
    clearBtn.setAttribute('aria-label', 'Limpiar todos los datos');
    
    // Set initial states
    toggleHighContrast.setAttribute('aria-pressed', 'false');
    darkModeToggle.setAttribute('aria-checked', document.body.getAttribute('data-theme') === 'dark');
}

// Toggle dark mode
function toggleDarkMode() {
    const isDark = darkModeToggle.checked;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    darkModeToggle.setAttribute('aria-checked', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Aplicar estilos específicos para el tema
    applyThemeStyles(isDark);
    
    // Actualizar el gráfico si existe
    if (chart) {
        updateChartTheme();
    }
}

// Aplicar estilos específicos para el tema
function applyThemeStyles(isDark) {
    // Agregar o quitar clase para transiciones suaves
    document.body.classList.add('theme-transition');
    
    // Cambiar el ícono del botón de tema
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Actualizar el texto descriptivo para lectores de pantalla
    const themeText = document.getElementById('theme-text');
    if (themeText) {
        themeText.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }
    
    // Actualizar el título de la página
    document.title = isDark ? 'BI Tool - Modo Oscuro' : 'BI Tool - Modo Claro';
    
    // Eliminar la clase de transición después de que termine
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

// Toggle high contrast mode
function toggleHighContrastMode() {
    const isHighContrast = document.body.classList.toggle('high-contrast');
    toggleHighContrast.setAttribute('aria-pressed', isHighContrast);
    localStorage.setItem('highContrast', isHighContrast);
    
    // Update chart colors if chart exists
    if (chart) {
        updateChartTheme();
    }
}

// Set theme from local storage
function setThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Aplicar el tema guardado
    if (savedTheme === 'dark') {
        darkModeToggle.checked = true;
        document.body.setAttribute('data-theme', 'dark');
        applyThemeStyles(true);
    } else {
        darkModeToggle.checked = false;
        document.body.setAttribute('data-theme', 'light');
        applyThemeStyles(false);
    }
}

// Process CSV data
function processCSV() {
    const csvData = csvInput.value.trim();
    if (!csvData) {
        showAlert('Por favor ingrese o cargue un archivo CSV', 'warning');
        return;
    }

    try {
        // Parse CSV to array of objects
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('El CSV debe contener al menos una fila de encabezados y una fila de datos');
        }

        headers = parseCSVLine(lines[0]);
        currentData = [];
        
        // Process data rows
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length !== headers.length) {
                console.warn(`La fila ${i + 1} tiene un número incorrecto de columnas y será omitida`);
                continue;
            }
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            currentData.push(row);
        }

        if (currentData.length === 0) {
            throw new Error('No se encontraron datos válidos en el CSV');
        }

        updateTable();
        updateAxisSelects();
        showAlert('Datos cargados correctamente', 'success');
    } catch (error) {
        console.error('Error al procesar el CSV:', error);
        showAlert(`Error: ${error.message}`, 'danger');
    }
}

// Parse a single CSV line, handling quoted values
function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    // Add the last value
    result.push(currentValue.trim());
    return result;
}

// Update the data table
function updateTable() {
    // Clear existing content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Add headers
    headers.forEach(header => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = header;
        tableHeader.appendChild(th);
    });
    
    // Add data rows
    currentData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        tr.setAttribute('aria-rowindex', rowIndex + 1);
        
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        
        tableBody.appendChild(tr);
    });
}

// Update the axis select dropdowns
function updateAxisSelects() {
    // Clear existing options
    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';
    
    // Add options for each header
    headers.forEach(header => {
        // X-axis (single select)
        const xOption = document.createElement('option');
        xOption.value = header;
        xOption.textContent = header;
        xAxisSelect.appendChild(xOption);
        
        // Y-axis (multiple select)
        const yOption = document.createElement('option');
        yOption.value = header;
        yOption.textContent = header;
        yAxisSelect.appendChild(yOption.cloneNode(true));
    });
    
    // Set default selections
    if (headers.length > 0) {
        xAxisSelect.value = headers[0];
        
        // Select all numeric columns for Y-axis by default
        if (headers.length > 1) {
            Array.from(yAxisSelect.options).forEach(option => {
                option.selected = true;
            });
        }
    }
}

// Generate the chart
function generateChart(e) {
    e.preventDefault();
    
    if (!currentData.length) {
        showAlert('No hay datos para generar el gráfico', 'warning');
        return;
    }
    
    const xAxis = xAxisSelect.value;
    const yAxes = Array.from(yAxisSelect.selectedOptions).map(opt => opt.value);
    const chartType = chartTypeSelect.value;
    const chartTitle = chartTitleInput.value || 'Gráfico de Datos';
    
    if (!xAxis || yAxes.length === 0) {
        showAlert('Por favor seleccione al menos un eje X y un eje Y', 'warning');
        return;
    }
    
    try {
        // Prepare datasets
        const datasets = yAxes.map((yAxis, index) => {
            return {
                label: yAxis,
                data: currentData.map(row => parseFloat(row[yAxis]) || 0),
                backgroundColor: getChartColor(index, 0.7),
                borderColor: getChartColor(index, 1),
                borderWidth: 1
            };
        });
        
        // Create or update chart
        if (chart) {
            chart.destroy();
        }
        
        const isHorizontal = chartType === 'horizontalBar';
        const xAxisData = currentData.map(row => row[xAxis]);
        
        chart = new Chart(dataChart, {
            type: chartType === 'horizontalBar' ? 'bar' : chartType,
            data: {
                labels: xAxisData,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            size: 18
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: isHorizontal ? {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valores',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: xAxis,
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                } : {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valores',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: xAxis,
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
        
        // Enable export button
        exportChartBtn.disabled = false;
        
    } catch (error) {
        console.error('Error al generar el gráfico:', error);
        showAlert(`Error al generar el gráfico: ${error.message}`, 'danger');
    }
}

// Update chart theme based on current settings
function updateChartTheme() {
    if (!chart) return;
    
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const isHighContrast = document.body.classList.contains('high-contrast');
    
    const textColor = isDark ? '#ffffff' : '#212529';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Update chart options
    chart.options.plugins.title.color = textColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    
    // Update legend text color
    chart.options.plugins.legend.labels.color = textColor;
    
    // Update datasets colors if in high contrast mode
    if (isHighContrast) {
        chart.data.datasets.forEach((dataset, index) => {
            dataset.backgroundColor = getHighContrastColor(index, 0.7);
            dataset.borderColor = getHighContrastColor(index, 1);
        });
    }
    
    chart.update();
}

// Export chart as PNG
function exportChart() {
    if (!chart) {
        showAlert('No hay gráfico para exportar', 'warning');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'grafico.png';
    link.href = chart.toBase64Image('image/png');
    link.click();
    
    showAlert('Gráfico exportado correctamente', 'success');
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        csvInput.value = e.target.result;
        // Auto-process the file
        processCSV();
    };
    reader.onerror = function() {
        showAlert('Error al leer el archivo', 'danger');
    };
    reader.readAsText(file);
}

// Clear all data and reset the application
function clearAll() {
    csvInput.value = '';
    fileInput.value = '';
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    xAxisSelect.innerHTML = '<option value="">Seleccione una columna</option>';
    yAxisSelect.innerHTML = '<option value="">Seleccione una o más columnas</option>';
    chartTitleInput.value = '';
    
    if (chart) {
        chart.destroy();
        chart = null;
    }
    
    currentData = [];
    headers = [];
    exportChartBtn.disabled = true;
    
    showAlert('Datos limpiados correctamente', 'info');
}

// Show alert message
function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    // Insert after the header
    const header = document.querySelector('header');
    header.parentNode.insertBefore(alertDiv, header.nextSibling);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(alertDiv);
        if (alert) alert.close();
    }, 5000);
}

// Get chart color based on index and theme
function getChartColor(index, opacity = 1) {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        // Colores más vibrantes para modo oscuro
        const darkColors = [
            `rgba(100, 149, 237, ${opacity})`,  // Cornflower Blue
            `rgba(144, 238, 144, ${opacity})`,  // Light Green
            `rgba(255, 182, 193, ${opacity})`,  // Light Pink
            `rgba(221, 160, 221, ${opacity})`,  // Plum
            `rgba(255, 215, 0, ${opacity})`,    // Gold
            `rgba(70, 130, 180, ${opacity})`,   // Steel Blue
            `rgba(240, 128, 128, ${opacity})`,  // Light Coral
            `rgba(152, 251, 152, ${opacity})`   // Pale Green
        ];
        return darkColors[index % darkColors.length];
    } else {
        // Colores estándar para modo claro
        const lightColors = [
            `rgba(75, 192, 192, ${opacity})`,
            `rgba(54, 162, 235, ${opacity})`,
            `rgba(255, 99, 132, ${opacity})`,
            `rgba(255, 159, 64, ${opacity})`,
            `rgba(153, 102, 255, ${opacity})`,
            `rgba(255, 205, 86, ${opacity})`,
            `rgba(201, 203, 207, ${opacity})`,
            `rgba(54, 162, 235, ${opacity})`
        ];
        return lightColors[index % lightColors.length];
    }
}

// Get high contrast colors
function getHighContrastColor(index, opacity = 1) {
    const colors = [
        `rgba(255, 255, 0, ${opacity})`,    // Yellow
        `rgba(0, 255, 255, ${opacity})`,    // Cyan
        `rgba(255, 0, 255, ${opacity})`,    // Magenta
        `rgba(0, 255, 0, ${opacity})`,      // Green
        `rgba(0, 0, 255, ${opacity})`,      // Blue
        `rgba(255, 165, 0, ${opacity})`,    // Orange
        `rgba(255, 0, 0, ${opacity})`,      // Red
        `rgba(128, 0, 128, ${opacity})`     // Purple
    ];
    return colors[index % colors.length];
}

// Handle keyboard navigation for accessibility
function handleKeyboardNavigation(e) {
    // Skip to main content with keyboard
    if (e.key === 'Tab' && e.target === document.body) {
        e.preventDefault();
        document.querySelector('main').focus();
    }
    
    // Close alerts with Escape key
    if (e.key === 'Escape') {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = bootstrap.Alert.getInstance(alert);
            if (bsAlert) bsAlert.close();
        }
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
