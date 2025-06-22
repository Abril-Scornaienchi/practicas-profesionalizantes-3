// main.js
import { GameEngineRenderer } from './GameEngineRenderer.js';
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Triangle } from './Triangle.js';

function main() {
    console.log("main.js: La función main se ha iniciado.");
    const gameEngine = new GameEngineRenderer('mainCanvas', 'activeFigureName', 'figuresTableBody');
    const colorPicker = document.getElementById('colorPicker');

    if (!gameEngine.canvas || !colorPicker || !gameEngine.activeFigureNameSpan || !gameEngine.figuresTableBody) {
        console.error("main.js: Uno o más elementos del DOM necesarios para la inicialización no fueron encontrados. Verifique los IDs en index.html.");
        alert("Error crítico: No se pudieron cargar elementos esenciales de la interfaz. Verifique la consola.");
        return;
    }

    function getFigureData(type) {
        console.log(`main.js: Solicitando datos para la figura de tipo: ${type}`);
        let id = prompt(`Ingrese el identificador (nombre único) para el ${type}:`);
        if (!id) {
            console.log("main.js: Creación de figura cancelada o ID vacío.");
            return null;
        }

        if (gameEngine.figures.some(f => f.id === id)) {
            alert('Ese ID ya existe. Por favor, ingrese un ID único.');
            console.warn(`main.js: ID duplicado intentado: ${id}`);
            return null;
        }

        let x = parseInt(prompt(`Ingrese la coordenada X para el ${type}:`));
        let y = parseInt(prompt(`Ingrese la coordenada Y para el ${type}:`));
        if (isNaN(x) || isNaN(y)) {
            alert('Coordenadas no válidas. Por favor, ingrese números para las coordenadas.');
            console.error(`main.js: Coordenadas no válidas ingresadas para ${type}: x=${x}, y=${y}`);
            return null;
        }

        let dimensions;
        if (type === 'Rectángulo') {
            let width = parseInt(prompt(`Ingrese el ancho del ${type}:`));
            let height = parseInt(prompt(`Ingrese la altura del ${type}:`));
            if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                alert('Dimensiones no válidas. Ancho y alto deben ser números positivos.');
                console.error(`main.js: Dimensiones de Rectángulo no válidas: width=${width}, height=${height}`);
                return null;
            }
            dimensions = { width, height };
        } else if (type === 'Círculo') {
            let radius = parseInt(prompt(`Ingrese el radio del ${type}:`));
            if (isNaN(radius) || radius <= 0) {
                alert('Radio no válido. El radio debe ser un número positivo.');
                console.error(`main.js: Radio de Círculo no válido: radius=${radius}`);
                return null;
            }
            dimensions = { radius };
        } else if (type === 'Triángulo') {
            let sideLength = parseInt(prompt(`Ingrese el tamaño del lado del ${type}:`));
            if (isNaN(sideLength) || sideLength <= 0) {
                alert('Tamaño de lado no válido. El lado debe ser un número positivo.');
                console.error(`main.js: Tamaño de lado de Triángulo no válido: sideLength=${sideLength}`);
                return null;
            }
            dimensions = { sideLength };
        }

        const color = colorPicker.value;
        console.log(`main.js: Datos de figura recolectados para ${type}:`, { id, x, y, color, dimensions });
        return { id, x, y, color, dimensions };
    }

    document.getElementById('createRectangleBtn').addEventListener('click', () => {
        try {
            console.log("main.js: Botón 'Crear Rectángulo' clickeado.");
            const data = getFigureData('Rectángulo');
            if (data) {
                const rect = new Rectangle(gameEngine.ctx, data.id, data.x, data.y, data.dimensions.width, data.dimensions.height, data.color);
                gameEngine.addFigure(rect);
                gameEngine.setActiveFigure(rect.id);
                console.log("main.js: Rectángulo creado y añadido:", rect);
            }
        } catch (error) {
            console.error("main.js: Error al crear Rectángulo:", error);
            alert("Ocurrió un error inesperado al crear el Rectángulo. Consulta la consola para más detalles.");
        }
    });

    document.getElementById('createCircleBtn').addEventListener('click', () => {
        try {
            console.log("main.js: Botón 'Crear Círculo' clickeado.");
            const data = getFigureData('Círculo');
            if (data) {
                const circle = new Circle(gameEngine.ctx, data.id, data.x, data.y, data.dimensions.radius, data.color);
                gameEngine.addFigure(circle);
                gameEngine.setActiveFigure(circle.id);
                console.log("main.js: Círculo creado y añadido:", circle);
            }
        } catch (error) {
            console.error("main.js: Error al crear Círculo:", error);
            alert("Ocurrió un error inesperado al crear el Círculo. Consulta la consola para más detalles.");
        }
    });

    document.getElementById('createTriangleBtn').addEventListener('click', () => {
        try {
            console.log("main.js: Botón 'Crear Triángulo' clickeado.");
            const data = getFigureData('Triángulo');
            if (data) {
                const triangle = new Triangle(gameEngine.ctx, data.id, data.x, data.y, data.dimensions.sideLength, data.color);
                gameEngine.addFigure(triangle);
                gameEngine.setActiveFigure(triangle.id);
                console.log("main.js: Triángulo creado y añadido:", triangle);
            }
        } catch (error) {
            console.error("main.js: Error al crear Triángulo:", error);
            alert("Ocurrió un error inesperado al crear el Triángulo. Consulta la consola para más detalles.");
        }
    });
}
window.onload = main;
