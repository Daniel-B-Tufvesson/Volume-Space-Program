import { Vector } from "./vector.js"

// Rocket should point up towards space. Unfortunately this means we have to 
// subtract the initial rotation everytime we need to render or do collision 
// detection. There is probably a more elegant way of doing this.
const INITIAL_ROTATION = -Math.PI / 2

export class Rocket {

    boosting = false
    launched = false
    exploded = false
    onExplode = null  // Explosion callback.
    velocityX = 0
    velocityY = 0
    boosterAcceleration = 200
    gravityScale = 6000  // How much gravity should affect the rocket. 
    rotation = INITIAL_ROTATION

    constructor(x, y, halfWidth, height) {
        this.x = x
        this.y = y
        this.halfWidth = halfWidth
        this.height = height

        // The three local points on this triangle rocket. Practical for iterating.
        this.points = [
            new Vector(0, -height),
            new Vector(halfWidth, 0),
            new Vector(-halfWidth, 0)
        ]
    }

    /**
     * Draw the rocket.
     */
    draw(ctx) {

        // Subtract the initial rotation, otherwise the rocket will be lying down.
        const rotation = this.rotation - INITIAL_ROTATION

        // Transform the context.
        ctx.translate(this.x, this.y)
        ctx.rotate(rotation)

        const h = this.height
        const hw = this.halfWidth

        // Draw a triangle.
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.moveTo(0, -h)
        ctx.lineTo(-hw, 0)
        ctx.lineTo(hw, 0)
        ctx.fill();
        ctx.closePath();

        if (this.boosting) {
            // Draw flame (an animated triangle).
            const flameLength = (h / 2) * (1.2 + Math.sin(performance.now() / 50) / 2)
            ctx.fillStyle = 'orange'
            ctx.beginPath();
            ctx.moveTo(0, flameLength)
            ctx.lineTo(-hw, 0)
            ctx.lineTo(hw, 0)
            ctx.fill();
            ctx.closePath()
        }

        // Restore transform.
        ctx.rotate(-rotation)
        ctx.translate(-this.x, -this.y)
    }

    /**
     * Update the rocket's physics and logic. 
     */
    update(deltaTime, planet, viewRect) {

        if (this.boosting) {
            this.boost(deltaTime)
            this.launched = true
        }

        // Apply physics if rocket has launched.
        if (this.launched) {
            this.applyGravity(deltaTime, planet.x, planet.y)

            // Apply velocity.
            this.x += this.velocityX * deltaTime
            this.y += this.velocityY * deltaTime

            // Blow up the rock if colliding with the planet. 
            if (this.checkCollisions(planet, viewRect)) {
                this.explode()
            }
        }
    }

    /**
     * Accelerate the rocket in its current direction given by its rotation. 
     */
    boost(deltaTime) {

        // Accelerate the rocket.
        const direction = new Vector(Math.cos(this.rotation), Math.sin(this.rotation))
        const acceleration = direction.scale(this.boosterAcceleration * deltaTime)
        this.velocityX += acceleration.x
        this.velocityY += acceleration.y

        // Rotate the rocket when boosting.
        this.rotation += this.boosterAcceleration * deltaTime * 0.01
    }

    /**
     * Apply gravity to the rocket, accelerating it towards the planet.
     */
    applyGravity(deltaTime, planetX, planetY) {
        // The idea here is that gravity is stronger closer to the planet. This 
        // is basically Newtonian gravity, but super simplified to suit the gameplay.
        const delta = new Vector(planetX - this.x, planetY - this.y)
        const gravity = this.gravityScale / delta.len()
        const acceleration = delta.norm().scale(gravity * deltaTime)
        this.velocityX += acceleration.x
        this.velocityY += acceleration.y
    }

    /**
     * Check for collisions with either the planet or the view rect. Returns true if so.
     */
    checkCollisions(planet, viewRect) {
        // The rocket is a triangle, so we check collision by checking each of the three
        // points on the triangle. For the planet, a point is colliding if it's inside of 
        // its radius. For the view rect, a point is colliding if it's outside any of its
        // bounds. This is actually a lazy approach, but it's good enough for our purposes.

        // Subtract the initial rotation, otherwise it will treat the rocket as lying down.
        const rotation = this.rotation - INITIAL_ROTATION

        // Check each point on the triangle.
        for (let point of this.points) {
            point = point.rotate(rotation)
            point.x += this.x
            point.y += this.y
            
            // Check collision with planet. Note: the rocket touches the planet during take-off, 
            // so we also prevent the collision if the rocket is moving away from the planet.
            if (planet.isOverlapping(point.x, point.y) && this.isFallingTowardsPlanet(planet)) {
                return true
            }

            // Check collision with edges.
            if (point.x < viewRect.minX || point.x > viewRect.maxX ||
                point.y < viewRect.minY || point.y > viewRect.maxY) {
                return true;
            }
        }

        // No collisions occurred.
        return false
    }

    /**
     * Check if the rocket is moving towards the planet or away.
     */
    isFallingTowardsPlanet(planet){
        // We can tell that the rocket is moving towards the planet if the 
        // dot product between v and u is positive, where u is the vector from
        // the rocket to the planet, and v is the velocity of the rocket. A 
        // negative dot product, on the other hand, means that the rocket is moving
        // away from the planet.
        const toPlanet = new Vector(planet.x - this.x, planet.y - this.y)
        const velocity = new Vector(this.velocityX, this.velocityY)
        return toPlanet.dot(velocity) > 0
    }

    /**
     * Blow up the rocket.
     */
    explode() {
        this.exploded = true

        // Fire callback.
        if (this.onExplode !== null) {
            this.onExplode()
        }
    }
}