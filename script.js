export default class WheelOfFortune {
    constructor(element, labels) {
        this.animationSpins = 5;
        this.animationTime = 5000;
        this.element = element;
        this.labels = labels;
        this.container = this.createElement('div', 'wheel-of-fortune__container');
        this.element.appendChild(this.container);
        this.degrees = 360 / labels.length;
        this.currentRotation = 0;
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
        const animationRotate = 360 * this.animationSpins;
        const totalRotation = this.currentRotation + (-segmentDegrees - randomDegrees - animationRotate);

        const targetRotation = totalRotation;

        this.animateRotation(targetRotation, () => {
            this.currentRotation = targetRotation % 360;
            this.isLocked = false;
        });
    };

    animateRotation = (targetRotation, callback) => {
        const start = performance.now();
        const duration = this.animationTime;

        const animate = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = this.easeInOut(progress);

            const rotation = this.currentRotation + (targetRotation - this.currentRotation) * easeProgress;
            this.container.style.transform = `rotate(${rotation}deg)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        };

        requestAnimationFrame(animate);
    };

    easeInOut = (time) => {
        return 0.5 * (1 - Math.cos(Math.PI * time));
    };

    createElement = (type, className) => {
        const element = document.createElement(type);
        element.className = className;
        return element;
    };
}
