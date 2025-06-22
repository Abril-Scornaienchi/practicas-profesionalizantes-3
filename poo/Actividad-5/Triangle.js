import { Figure } from './Figure.js';

export class Triangle extends Figure {
    constructor(ctx, id, x, y, sideLength, color) {
        super(ctx, id, x, y, color);
        this.sideLength = sideLength;
        this.type = 'Triángulo';
        this.shortType = 'T';
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.fillStyle = this.color;

        const height = (Math.sqrt(3) / 2) * this.sideLength;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -height / 2);
        this.ctx.lineTo(-this.sideLength / 2, height / 2);
        this.ctx.lineTo(this.sideLength / 2, height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
}
