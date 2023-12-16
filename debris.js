import { Vector } from "./vector.js"

export class RocketDebris {

    gravityScale = 6000
    destroyed = false
    rotation = Math.random() * Math.PI
    rotationalVelocity = Math.random() * 10

    constructor(x, y, velocityX, velocityY) {
        this.x = x
        this.y = y
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    draw(ctx) {

        // Transform the context.
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        const hh = 2
        const hw = 2

        // Draw a triangle.
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.moveTo(0, -hh)
        ctx.lineTo(-hw, hh)
        ctx.lineTo(hw, hh)
        ctx.fill()
        ctx.closePath()

        // Restore transform.
        ctx.rotate(-this.rotation)
        ctx.translate(-this.x, -this.y)
    }
    
    update(deltaTime, planet) {

        // Apply velocity.
        this.x += this.velocityX * deltaTime
        this.y += this.velocityY * deltaTime
        this.rotation += this.rotationalVelocity * deltaTime

        this.applyGravity(deltaTime, planet.x, planet.y)

        // Destroy debris if colliding with planet.
        if (planet.isOverlapping(this.x, this.y)) {
            this.destroyed = true
        }
    }

    applyGravity(deltaTime, planetX, planetY) {
        const delta = new Vector(planetX - this.x, planetY - this.y)
        const gravity = this.gravityScale / delta.len()
        const acceleration = delta.norm().scale(gravity * deltaTime)
        this.velocityX += acceleration.x
        this.velocityY += acceleration.y
    }
}