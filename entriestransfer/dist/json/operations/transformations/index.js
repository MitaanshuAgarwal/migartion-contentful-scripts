"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _utils_1 = require("./_utils");
const _array_transformation_1 = require("./_array_transformation");
const transformation = async (props) => {
    const { operation, entryValue, mapping } = props;
    if (operation === "textToRichText")
        return (0, _utils_1.toRichText)(entryValue);
    else if (operation === "referenceToJson")
        return await (0, _utils_1.refrenceToJson)(entryValue, mapping);
    else if (operation === "referenceMapping") {
        let newEntryValue;
        if (Array.isArray(entryValue)) {
            newEntryValue = [];
            for (let refrenceID = 0; refrenceID < entryValue.length; refrenceID++) {
                const reference = await (0, _utils_1.refrenceMapping)(entryValue[refrenceID], mapping);
                newEntryValue.push(reference);
            }
            newEntryValue = newEntryValue.filter((i) => i);
        }
        else {
            newEntryValue = await (0, _utils_1.refrenceMapping)(entryValue, mapping);
        }
        return newEntryValue;
    }
    else if (operation === "referenceToString") {
        let newEntryValue;
        if (Array.isArray(entryValue)) {
            newEntryValue = await Promise.all(entryValue.map(async (i) => await (0, _utils_1.refrenceToSTring)(i, mapping)));
            newEntryValue = newEntryValue.filter((i) => i);
        }
        else {
            newEntryValue = await (0, _utils_1.refrenceToSTring)(entryValue, mapping);
        }
        return newEntryValue;
    }
    else if (operation === "ArrayTransformation") {
        return (0, _array_transformation_1.arrayTransformation)({
            value: entryValue,
            mapping,
        });
    }
    else if (operation === "valueMapping") {
        return (0, _utils_1.valueMapping)({
            value: entryValue,
            mapping: mapping,
        });
    }
    else if (operation === "dateStringToEuropeanDateFormat") {
        return (0, _utils_1.dateToEupropeanFormat)({
            value: entryValue,
        });
    }
};
exports.default = transformation;
