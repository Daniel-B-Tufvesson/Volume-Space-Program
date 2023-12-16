/**
 * A 2D vector for simplifying the vector space calculations.
 */
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Compute the length of this vector.
     */
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Return the normalized vector.
     */
    norm() {
        const l = this.len() + 0.00001; // epsilon to prevent division by zero.
        return new Vector(this.x / l, this.y / l);
    }

    /**
     * Return a scaled version of this vector.
     */
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    /**
     * Return a rotated vector around the origin.
     */
    rotate(rotationRad) {
        const sin = Math.sin(rotationRad);
        const cos = Math.cos(rotationRad);
        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Compute the dot product of this vector and another.
     */
    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y
    }

}
