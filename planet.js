export class Planet {
    
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
    }

    draw(ctx) {
        ctx.fillStyle = "lightgray"
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    /**
     * Check if the point is overlapping with the planet.
     */
    isOverlapping(x, y) {
        const dx = this.x - x
        const dy = this.y - y
        return dx*dx + dy*dy < this.radius * this.radius
    }
}