"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const groupFields = async (props) => {
    const { entry, fields } = props;
    let entryFields = entry.fields;
    let groupedFields = {};
    for (let fieldID = 0; fieldID < fields.length; fieldID++) {
        const { name, value, rename, operations } = fields[fieldID];
        const field = entryFields[name];
        if (field) {
            const fieldValue = field["en-AU"];
            if (operations) {
                let newEntryValue = fieldValue;
                for (let operationID = 0; operationID < operations.length; operationID++) {
                    const operation = operations[operationID];
                    newEntryValue = await (0, __1.default)({
                        entryValue: newEntryValue,
                        ...operation,
                    });
                }
                groupedFields[rename ? rename : name] = value ? value : newEntryValue;
            }
            else
                groupedFields[rename ? rename : name] = value ? value : fieldValue;
        }
    }
    return groupedFields;
};
exports.default = groupFields;
