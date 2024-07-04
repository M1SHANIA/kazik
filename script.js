export default class WheelOfFortune {
    constructor(element, labels) {
        this.animationTime = 4000; // Adjusted animation time for smoother effect
        this.element = element;
        this.labels = labels;
        this.container = this.createElement('div', 'wheel-of-fortune__container');
        this.element.appendChild(this.container);
        this.degrees = 360 / labels.length;
        this.currentRotation = 0; // Current rotation in degrees
        this.isLocked = false;

        this.labels.forEach(this.createSegment);
        this.labels.forEach(this.createLabel);
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

    spin = (targetIndex) => {
        if (this.isLocked) return;

        this.isLocked = true;

        // Reset rotation to zero before each spin
        this.container.style.transition = 'none';
        this.container.style.transform = `rotate(0deg)`;

        setTimeout(() => {
            // Calculate target rotation to reach the target segment clockwise
            const targetRotation = 360 * 5 + (360 - (this.degrees * targetIndex));

            // Apply transition to animate the spin
            this.container.style.transition = `transform ${this.animationTime}ms cubic-bezier(0.33, 1, 0.68, 1)`;
            this.container.style.transform = `rotate(${targetRotation}deg)`;

            // Update current rotation after the animation completes
            setTimeout(() => {
                this.isLocked = false;
                this.currentRotation = targetRotation % 360; // Update current rotation to the new position
            }, this.animationTime);
        }, 50); // Delay added to ensure transition reset takes effect
    };

    createElement = (type, className) => {
        const element = document.createElement(type);
        element.className = className;
        return element;
    };
}
