"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toArray = (value) => {
    return [value];
};
const toString = (value) => {
    return String(value);
};
const toNumber = (value) => {
    return Number(value);
};
const typeCasting = (props) => {
    const { operation, entryValue } = props;
    if (operation === "array")
        return toArray(entryValue);
    else if (operation === "number")
        return toNumber(entryValue);
    else if (operation === "string")
        return toString(entryValue);
    else
        entryValue;
};
exports.default = typeCasting;
