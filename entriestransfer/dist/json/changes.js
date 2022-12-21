"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const changes_json_1 = __importDefault(require("./changes.json"));
const validations_1 = __importDefault(require("./operations/validations"));
const operations_1 = __importDefault(require("./operations"));
const checkEntryAgainstJSON = async (props) => {
    let { entry, locale } = props;
    const { fields } = changes_json_1.default;
    for (let fieldID = 0; fieldID < fields.length; fieldID++) {
        const { fieldID: fieldName, skipUndefinedCheck, replacingOtherFieldValue, replacingFieldID, change: { where, operations }, } = fields[fieldID];
        const toBeUpdated = where
            ?.map((condition) => (0, validations_1.default)({
            ...condition,
            entryValue: entry.fields[fieldName]?.[locale],
        }))
            .includes(true);
        if (toBeUpdated) {
            let updatedEntry = entry.fields[fieldName]?.[locale];
            if (replacingOtherFieldValue) {
                updatedEntry = entry.fields[replacingFieldID]?.[locale];
                if (typeof updatedEntry !== "undefined" || skipUndefinedCheck) {
                    for (let operationID = 0; operationID < operations.length; operationID++) {
                        const operation = operations[operationID];
                        updatedEntry = await (0, operations_1.default)({
                            ...operation,
                            entryValue: updatedEntry,
                        });
                    }
                    if (!entry.fields[replacingFieldID]?.[locale]) {
                        entry.fields[replacingFieldID] = {
                            [locale]: {},
                        };
                    }
                    entry.fields[replacingFieldID][locale] = updatedEntry;
                }
            }
            else if (typeof updatedEntry !== "undefined" || skipUndefinedCheck) {
                for (let operationID = 0; operationID < operations.length; operationID++) {
                    const operation = operations[operationID];
                    updatedEntry = await (0, operations_1.default)({
                        ...operation,
                        entryValue: updatedEntry,
                    });
                }
                if (!entry.fields[fieldName]?.[locale]) {
                    entry.fields[fieldName] = {
                        [locale]: {},
                    };
                }
                entry.fields[fieldName][locale] = updatedEntry;
            }
        }
    }
    return entry;
};
exports.default = checkEntryAgainstJSON;
