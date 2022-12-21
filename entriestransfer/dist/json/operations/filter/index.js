"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterRecords = void 0;
const changes_json_1 = __importDefault(require("../../changes.json"));
const filterRecords = (props) => {
    const { filters } = changes_json_1.default;
    const { entryValues } = props;
    let entries = entryValues;
    if (Array.isArray(filters) && filters.length > 0) {
        for (let filterID = 0; filterID < filters.length; filterID++) {
            const { fieldID, operations } = filters[filterID];
            let fileterdEntries = [];
            console.log(`entries count: ${entries.length}`);
            for (let entryID = 0; entryID < entries.length; entryID++) {
                const entryValue = entries[entryID];
                let isValid = true;
                const data = entryValue.fields;
                for (let opID = 0; opID < operations.length; opID++) {
                    const { name, value } = operations[opID];
                    const conditionalValue = value;
                    if (data[fieldID]) {
                        const fieldValue = data[fieldID]["en-AU"];
                        if (name === "fieldValueMatch") {
                            isValid = fieldValue === conditionalValue;
                        }
                        else if (name === "fieldTypeMatch") {
                            if (conditionalValue === "empty") {
                                // console.log(fieldValue);
                                isValid = fieldValue === "" || !fieldValue;
                            }
                            if (conditionalValue === "notEmpty") {
                                isValid = fieldValue !== "" || fieldValue;
                            }
                        }
                        else if (name === "fieldValueNotContain") {
                            if (typeof fieldValue === "string") {
                                isValid = !fieldValue.includes(conditionalValue);
                            }
                        }
                        else if (name === "fieldValueContain") {
                            if (typeof fieldValue === "string") {
                                isValid = fieldValue.includes(conditionalValue);
                            }
                        }
                    }
                    else if (!data[fieldID] &&
                        name === "fieldTypeMatch" &&
                        conditionalValue === "empty")
                        isValid = true;
                    else
                        isValid = false;
                }
                if (isValid)
                    fileterdEntries.push(entryValue);
            }
            entries = fileterdEntries;
        }
    }
    console.log(`entries count: ${entries.length}`);
    return entries;
};
exports.filterRecords = filterRecords;
