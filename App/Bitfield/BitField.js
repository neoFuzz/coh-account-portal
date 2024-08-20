class BitField {
    constructor(value = 0) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    get(n) {
        if (Number.isInteger(n)) {
            return (this.value & (1 << n)) !== 0;
        } else {
            return 0;
        }
    }

    set(n, newValue = true) {
        if (Number.isInteger(n)) {
            this.value = (this.value & ~(1 << n)) | (newValue ? (1 << n) : 0);
        }
    }

    clear(n) {
        this.set(n, false);
    }

    toString() {
        const constants = this.constructor.constants || {};
        const result = {};

        for (const [key, value] of Object.entries(constants)) {
            result[key] = this.get(value) ? 1 : 0;
        }

        return JSON.stringify(result, null, 2);
    }
}

module.exports = BitField;
