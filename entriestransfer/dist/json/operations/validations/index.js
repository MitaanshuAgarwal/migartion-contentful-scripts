"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations = (props) => {
    const { name, value, entryValue } = props;
    let validationResult = false;
    if (name === "fieldTypeMatch")
        validationResult = fieldTypeMatch(value, entryValue);
    else if (name === "fieldValueMatch")
        validationResult = fieldValueMatch(value, entryValue);
    return validationResult;
};
const fieldTypeMatch = (value, entryValue) => {
    let matchResult = false;
    let shouldCheckForArray = false;
    if (value === "array")
        shouldCheckForArray = true;
    if (shouldCheckForArray)
        matchResult = Array.isArray(entryValue);
    else if (typeof entryValue === value)
        matchResult = true;
    return matchResult;
};
const fieldValueMatch = (value, entryValue) => {
    let matchResult = false;
    if (value === "empty") {
        matchResult = entryValue === "" || !entryValue;
    }
    else if (value === entryValue)
        matchResult = true;
    return matchResult;
};
exports.default = validations;
