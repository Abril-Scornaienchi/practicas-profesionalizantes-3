export class Figure {
    constructor(ctx, id, x, y, color = 'blue') {
        if (new.target === Figure) {
            throw new TypeError("Cannot construct Figure instances directly");
        }
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 5;
        this.rotationSpeed = 0.1;
        this.angle = 0;
    }

    draw() {
        throw new Error("Method 'draw()' must be implemented.");
    }

    move(deltaX, deltaY) {
    this.x= this.x + deltaX;
    this.y= this.y + deltaY;
    }

    rotate(direction) {
        this.angle = this.angle + this.rotationSpeed * direction;
    }
}
