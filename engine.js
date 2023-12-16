import { RocketDebris } from "./debris.js";
import { Planet } from "./planet.js";
import { Rocket } from "./rocket.js";

export class Engine {

    running = false
    prevTimestamp = null
    altitude = 0  // Between 0.0 and 100.0.
    onAltitudeChanged = null
    debris = []

    constructor($canvas) {
        this.$canvas = $canvas
        this.ctx = $canvas.getContext('2d')
        
        this.planet = new Planet($canvas.width * 0.5, $canvas.height * 0.5, 50)
        this.restart()
    }

    restart() {
        this.rocket = new Rocket(this.planet.x, this.planet.y - this.planet.radius, 6, 20)
        this.rocket.onExplode = () => this.createExplosion()
    }

    /**
     * Start the game loop.
     */
    start() {
        this.running = true
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }

    /**
     * Stop the game loop.
     */
    stop() {
        this.running = false
    }

    gameLoop(timestamp) {

        if (this.prevTimestamp == null) {
            this.prevTimestamp = timestamp
        }

        // Calculate delta-time in seconds.
        const deltaTime = (timestamp - this.prevTimestamp) / 1000.0
        this.prevTimestamp = timestamp
        
        // Update game.
        this.update(deltaTime)

        // Render.
        this.clearCanvas()
        this.draw()

        // Repeat if still running.
        if (this.running) {
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
        }
    }

    update(deltaTime) {

        // Update rocket.
        if (!this.rocket.exploded) {

            const viewRect = {
                minX: 0,
                minY: 0,
                maxX: this.$canvas.width,
                maxY: this.$canvas.height
            }

            this.rocket.update(deltaTime, this.planet, viewRect)
        }

        // Update debris.
        for (let i = 0; i < this.debris.length; i++) {
            this.debris[i].update(deltaTime, this.planet)
            if (this.debris[i].destroyed) {
                this.debris.splice(i, 1)
                i--
            }
        }

        // Compute altitude.
        this.computeAltitude()
    }

    clearCanvas() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height)
    }

    draw() {
        this.planet.draw(this.ctx)

        // Draw the rocket if it has not exploded yet.
        if (!this.rocket.exploded) {
            this.rocket.draw(this.ctx)
        }

        // Draw debris.
        this.debris.forEach((deb) => {
            deb.draw(this.ctx)
        })
    }

    computeAltitude() {

        // Altitude should be zero if rocket has exploded.
        let newAltitude = 0

        if (!this.rocket.exploded) {
            let dist = distance(this.planet.x, this.planet.y, this.rocket.x, this.rocket.y)
            dist -= this.planet.radius
            const maxDistance = this.$canvas.width / 3 - this.planet.radius
            newAltitude = (dist / maxDistance) * 100
        }

        // Update altitude if it is different.
        if (newAltitude !== this.altitude) {
            this.altitude = newAltitude

            // Fire callback about new altitude.
            if (this.onAltitudeChanged !== null) {
                this.onAltitudeChanged(this.altitude)
            }
        }
    }

    createExplosion() {

        

        // Spawn flying debris.
        for (let i = 0; i < 20; i++) {

            const explosiveForce = 100

            const debris = new RocketDebris(
                this.rocket.x + Math.random() * 6, 
                this.rocket.y + Math.random() * 6,
                this.rocket.velocityX + Math.random() * explosiveForce, 
                this.rocket.velocityY + Math.random() * explosiveForce
            )
            this.debris.push(debris)
        }
    }
}

/**
 * Compute the distance between two points.
 */
function distance(x1, y1, x2, y2) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx*dx + dy*dy)
}