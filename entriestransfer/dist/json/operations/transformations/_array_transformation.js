"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayTransformation = void 0;
const arrayTransformation = (props) => {
    const { value, mapping: { from, to, key }, } = props;
    let updatedEntryValue = [];
    if (from === "string" && to === "object") {
        updatedEntryValue = value.map((i) => {
            return {
                [key]: i,
            };
        });
    }
    else {
        updatedEntryValue = value;
    }
    return updatedEntryValue;
};
exports.arrayTransformation = arrayTransformation;
