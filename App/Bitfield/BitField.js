/**
 * A class for managing bit fields in SQL.
 * @class BitField
 */
class BitField {
    /**
     * Constructs a new BitField instance
     * 
     * @method constructor
     * @param {number} value - The initial value of the BitField
     * @constructor
     * @example
     * const bf = new BitField(0b1010);
     */
    constructor(value = 0) {
        this.value = value;
    }

    /**
     * Returns the current value of the BitField
     * 
     * @method getValue
     * @returns {number} The current value of the BitField
     */
    getValue() {
        return this.value;
    }

    /**
     * Sets the value of the BitField.
     * 
     * @method get
     * @param {number} n - The bit position to retrieve
     * @returns {boolean} True if the bit at position `n` is set, otherwise false
     */
    get(n) {
        if (Number.isInteger(n)) {
            return (this.value & (1 << n)) !== 0;
        } else {
            return 0;
        }
    }

    /**
     * Sets or clears a bit in the BitField.
     * 
     * @method set
     * @param {number} n - The bit position to set or clear
     * @param {boolean} [newValue=true] - The value to set at position `n`. Defaults to true
     */
    set(n, newValue = true) {
        if (Number.isInteger(n)) {
            this.value = (this.value & ~(1 << n)) | (newValue ? (1 << n) : 0);
        }
    }

    /**
     * Clears a bit in the BitField.
     * 
     * @method clear
     * @param {number} n - The bit position to clear
     */
    clear(n) {
        this.set(n, false);
    }

    /**
     * Converts the BitField instance to a JSON string representation of its set bits.
     *
     * @method toString
     * @returns {string} The JSON string representation of the BitField
     */
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
