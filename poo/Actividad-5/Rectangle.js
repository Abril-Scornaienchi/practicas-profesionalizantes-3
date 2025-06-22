import { Figure } from './Figure.js';

export class Rectangle extends Figure {
    constructor(ctx, id, x, y, width, height, color) {
        super(ctx, id, x, y, color);
        this.width = width;
        this.height = height;
        this.type = 'Rectángulo';
        this.shortType = 'R';
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.angle);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.ctx.restore();
    }
}
