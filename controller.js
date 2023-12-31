
export class Controller {
    
    constructor(canvas, engine) {
        this.engine = engine

        canvas.addEventListener('mousedown', () => this.onMouseDown())
        canvas.addEventListener('mouseup', () => this.onMouseUp())
        canvas.addEventListener('touchstart', () => this.onMouseDown())
        canvas.addEventListener('touchend', () => this.onMouseUp())
    }

    onMouseDown() {
        if (this.engine.rocket.exploded) {
            this.engine.restart()
        }
        else {
            this.engine.rocket.boosting = true
        }
    }

    onMouseUp() {
        this.engine.rocket.boosting = false
    }
}