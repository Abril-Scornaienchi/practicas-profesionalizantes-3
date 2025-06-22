// Circle.js
import { Figure } from './Figure.js';

export class Circle extends Figure {
    constructor(ctx, id, x, y, radius, color) {
        super(ctx, id, x, y, color);
        this.radius = radius;
        this.type = 'Círculo';
        this.shortType = 'C';
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        this.ctx.fill();
        this.ctx.restore();
    }

    rotate(direction) {
    }
}
