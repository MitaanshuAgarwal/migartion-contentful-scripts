"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEntry = void 0;
const updateEntry = async (props) => {
    let { locale, fieldID, entry, value, checkCondition, where } = props;
    const update = async () => {
        entry.fields[fieldID] = {
            [locale]: value,
        };
        await entry.update();
    };
    if (checkCondition) {
        if (entry.fields[fieldID] === where) {
            await update();
        }
    }
    else
        await update();
    return entry;
};
exports.updateEntry = updateEntry;
