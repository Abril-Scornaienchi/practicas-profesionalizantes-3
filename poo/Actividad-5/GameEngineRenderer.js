export class GameEngineRenderer {
    constructor(canvasId, activeFigureNameSpanId, figuresTableBodyId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.figures = [];
        this.activeFigure = null;
        this.keysPressed = {};
        this.activeFigureNameSpan = document.getElementById(activeFigureNameSpanId);
        this.figuresTableBody = document.getElementById(figuresTableBodyId);

        if (!this.canvas) {
            console.error("GameEngineRenderer: El elemento Canvas no fue encontrado. ID esperado:", canvasId);
            return;
        }
        if (!this.activeFigureNameSpan) {
            console.error("GameEngineRenderer: El elemento activeFigureNameSpan no fue encontrado. ID esperado:", activeFigureNameSpanId);
            return;
        }
        if (!this.figuresTableBody) {
            console.error("GameEngineRenderer: El elemento figuresTableBody no fue encontrado. ID esperado:", figuresTableBodyId);
            return;
        }
        console.log("GameEngineRenderer: Todos los elementos del DOM cargados correctamente.");


        this.setupEventListeners();
        this.animationFrameId = null;
        this.renderLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key] = false;
        });
    }

    addFigure(figure) {
        console.log(`GameEngineRenderer: Añadiendo figura: ${figure.id}, Tipo: ${figure.type}`);
        this.figures.push(figure);
        console.log(`GameEngineRenderer: Figuras actuales en el array:`, this.figures.map(f => f.id));
        this.updateFiguresTable();
        this.render();
    }

    setActiveFigure(figureId) {
        console.log(`GameEngineRenderer: Intentando establecer figura activa con ID: ${figureId}`);
        const selectedFigure = this.figures.find(f => f.id === figureId);
        if (selectedFigure) {
            this.activeFigure = selectedFigure;
            console.log(`GameEngineRenderer: Figura activa seleccionada: ${this.activeFigure.id}`);
            this.updateActiveFigureIndicator();
            this.updateFiguresTableHighlight();
        } else {
            console.warn(`GameEngineRenderer: No se encontró la figura con ID: ${figureId}. Desactivando figura activa.`);
            this.activeFigure = null;
            this.updateActiveFigureIndicator();
            this.updateFiguresTableHighlight();
        }
    }

    updateActiveFigure() {
        if (!this.activeFigure) return;

        let moved = false;
        if (this.keysPressed['ArrowUp']) {
            this.activeFigure.move(0, -this.activeFigure.speed);
            moved = true;
        }
        if (this.keysPressed['ArrowDown']) {
            this.activeFigure.move(0, this.activeFigure.speed);
            moved = true;
        }
        if (this.keysPressed['ArrowLeft']) {
            this.activeFigure.move(-this.activeFigure.speed, 0);
            moved = true;
        }
        if (this.keysPressed['ArrowRight']) {
            this.activeFigure.move(this.activeFigure.speed, 0);
            moved = true;
        }
        
        if (this.keysPressed['a'] || this.keysPressed['A']) {
            this.activeFigure.rotate(-1);
            moved = true;
        }
        if (this.keysPressed['d'] || this.keysPressed['D']) {
            this.activeFigure.rotate(1);
            moved = true;
        }

        if (moved) {
            this.render();
        }
    }

    updateActiveFigureIndicator() {
        if (this.activeFigureNameSpan) {
            this.activeFigureNameSpan.textContent = this.activeFigure ? this.activeFigure.id : 'Ninguna';
            console.log(`GameEngineRenderer: Indicador de figura activa actualizado a: ${this.activeFigure ? this.activeFigure.id : 'Ninguna'}`);
        }
    }

    updateFiguresTable() {
        console.log("GameEngineRenderer: Iniciando actualización de tabla de figuras.");
        if (!this.figuresTableBody) {
            console.error("GameEngineRenderer: 'figuresTableBody' es null o undefined al intentar actualizar la tabla.");
            return;
        }

        this.figuresTableBody.innerHTML = '';
        console.log(`GameEngineRenderer: Tabla limpiada. Hay ${this.figures.length} figuras para añadir.`);

        if (this.figures.length === 0) {
            console.log("GameEngineRenderer: No hay figuras para añadir a la tabla. La tabla estará vacía.");
        }

        this.figures.forEach(figure => {
            const row = this.figuresTableBody.insertRow();
            row.dataset.figureId = figure.id;
            row.classList.add('cursor-pointer');
            
            const typeCell = row.insertCell();
            typeCell.textContent = figure.shortType;

            const idCell = row.insertCell();
            idCell.textContent = figure.id;

            console.log(`GameEngineRenderer: Fila creada y añadida para Tipo: ${figure.shortType}, ID: ${figure.id}`);

            row.addEventListener('click', () => {
                console.log(`GameEngineRenderer: Clic en fila para figura ID: ${figure.id}`);
                this.setActiveFigure(figure.id);
            });
        });
        this.updateFiguresTableHighlight();
        console.log("GameEngineRenderer: Tabla de figuras actualizada completamente.");
    }

    updateFiguresTableHighlight() {
        console.log("GameEngineRenderer: Actualizando resaltado de tabla.");
        if (!this.figuresTableBody) return;

        const rows = this.figuresTableBody.querySelectorAll('tr');
        if (rows.length === 0) {
            console.log("GameEngineRenderer: No hay filas en la tabla para resaltar.");
        }

        rows.forEach(row => {
            if (this.activeFigure && row.dataset.figureId === this.activeFigure.id) {
                row.classList.add('selected');
                console.log(`GameEngineRenderer: Resaltando fila para ID: ${row.dataset.figureId}`);
            } else {
                row.classList.remove('selected');
            }
        });
        console.log("GameEngineRenderer: Resaltado de tabla actualizado.");
    }

    renderLoop() {
        this.updateActiveFigure(); 
        this.animationFrameId = requestAnimationFrame(() => this.renderLoop()); 
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.figures.forEach(figure => figure.draw());
    }
}
