"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameObjectKey = void 0;
const renameObjectKey = (props) => {
    try {
        const { entry, replacements } = props;
        let replacedItems = Object.keys(entry)
            .map((key) => {
            const newKey = replacements[key] || key;
            return { [newKey]: entry[key] };
        })
            .filter((i) => i);
        const updatedEntry = replacedItems.reduce((a, b) => Object.assign({}, a, b), {});
        return updatedEntry;
    }
    catch (error) {
        console.log(error);
    }
};
exports.renameObjectKey = renameObjectKey;
