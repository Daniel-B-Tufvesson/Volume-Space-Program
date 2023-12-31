import { Controller } from "./controller.js"
import { Engine } from "./engine.js"


/**
 * An HTML element for adjusting the volume by launching a rocket into orbit.
 * The higher the orbit, the higer the volume. The challenge is to achieve a 
 * stable orbit at the desired volume. Go to high and you explode when hitting
 * the edges. Go to low and you crash into the planet. Also, try to keep space 
 * littering at a minimal!
 * 
 * Instructions:
 * - Press the mouse button to boost the rocket. Boosting can be done as long the 
 *   rocket has not exploded.
 * - If the rocket has exploded, click the mouse button to restart.
 */
class VolumeSpaceProgram extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode:'open'})

        // Define the internal structure.
        this.shadowRoot.innerHTML = `
            <div class="container">
                <canvas></canvas>
                <div class="volume-container">
                    <i class="fa fa-volume-up fa-2x" aria-hidden="true"></i>
                    <input type="range" min="0" max="100" step="any" disabled>
                </div>
            </div>

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous">

            <style>

                canvas {
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                canvas {
                    user-select: none;
                }

                .container {
                    width: 300px;
                }

                .volume-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }
                
                input {
                    width: 230px;
                }
            </style>
        `

        // Configure the canvas.
        this.$canvas = this.shadowRoot.querySelector('canvas')
        this.$canvas.width = 300
        this.$canvas.height = 300

        this.engine = new Engine(this.$canvas)
        const controller = new Controller(this.$canvas, this.engine)
        
        // Configure the slider.
        const $slider = this.shadowRoot.querySelector('input')
        $slider.value = this.engine.altitude
        this.engine.onAltitudeChanged = (newAltitude) => {
            $slider.value = newAltitude
        }
    }

    connectedCallback() {
        this.engine.start()
    }

    disconnectedCallback() {
        this.engine.stop()
    }
}

customElements.define('volume-space-program', VolumeSpaceProgram)
