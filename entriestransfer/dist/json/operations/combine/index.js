"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../../helpers");
const changes_json_1 = __importDefault(require("../../changes.json"));
const _addlocale_1 = require("../utils/_addlocale");
const _group_1 = __importDefault(require("./_group"));
const combineEntry = async (props) => {
    let { entry } = props;
    const { combine: combineProps } = changes_json_1.default;
    let updatedEntry = {};
    for (let operationID = 0; operationID < combineProps.length; operationID++) {
        const { operation } = combineProps[operationID];
        const { name, fields, mapping, value } = operation;
        if (name === "groupFields") {
            updatedEntry = await (0, _group_1.default)({ entry, fields });
        }
        else if (name === "addNewEntry") {
            const { spaceID, environment, content_type } = mapping;
            updatedEntry = await (0, helpers_1.addEntry)({
                spaceID,
                environment,
                content_type,
                fields: (0, _addlocale_1.addlocale)({ locale: "en-AU", entry: updatedEntry }),
                toBePublished: true,
            });
        }
        else if (name === "combineRefrenceAsLink") {
            entry.fields = {
                ...entry.fields,
                [value]: {
                    "en-AU": [
                        {
                            sys: {
                                type: "Link",
                                linkType: "Entry",
                                id: updatedEntry.sys.id,
                            },
                        },
                    ],
                },
            };
        }
    }
    return entry;
};
exports.default = combineEntry;
