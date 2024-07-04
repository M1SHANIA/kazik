export default class WheelOfFortune {
    constructor(element, labels) {
        this.animationTime = 2000; // Reduce the animation time for faster spins
        this.element = element;
        this.labels = labels;
        this.container = this.createElement('div', 'wheel-of-fortune__container');
        this.element.appendChild(this.container);
        this.degrees = 360 / labels.length;
        this.isLocked = false;

        this.labels.forEach(this.createSegment);
        this.labels.forEach(this.createLabel);
        this.element.appendChild(this.createElement('div', 'wheel-of-fortune__arrow'));
    }

    createSegment = (label, index) => {
        const segment = this.createElement('div', 'wheel-of-fortune__segment');
        const skew = this.degrees - 90;

        segment.style.transform = `rotate(${this.degrees * index + skew - this.degrees / 2}deg) skewX(${skew}deg)`;

        this.container.appendChild(segment);
    };

    createLabel = (label, index) => {
        const labelNode = this.createElement('div', 'wheel-of-fortune__label');
        const labelText = this.createElement('div', 'wheel-of-fortune__label-text');

        labelText.appendChild(document.createTextNode(label));
        labelNode.appendChild(labelText);
        labelNode.style.transform = `rotate(${this.degrees * index}deg)`;

        this.container.appendChild(labelNode);
    };

    spin = (index) => {
        if (this.isLocked) return;

        this.isLocked = true;

        const segmentDegrees = this.degrees * index - 90 - this.degrees / 2;
        const randomDegrees = (this.degrees - 6) * Math.random() + 3;
        const animationRotate = 360 * 5; // Number of spins before stopping
        const totalRotation = -segmentDegrees - randomDegrees - animationRotate;

        // Reset to initial position without transition
        this.container.style.transition = 'none';
        this.container.style.transform = `rotate(0deg)`;

        // Force reflow to apply the reset immediately
        this.container.offsetHeight;

        // Apply the rotation with transition
        this.container.style.transition = `transform ${this.animationTime}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        this.container.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            this.isLocked = false;
        }, this.animationTime);
    };

    createElement = (type, className) => {
        const element = document.createElement(type);
        element.className = className;
        return element;
    };
}
