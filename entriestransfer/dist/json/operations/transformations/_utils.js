"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueMapping = exports.dateToEupropeanFormat = exports.refrenceToSTring = exports.refrenceMapping = exports.refrenceToJson = exports.toRichText = void 0;
const moment_1 = __importDefault(require("moment"));
const _get_entries_1 = require("../../../helpers/contentful/_get_entries");
const changes_json_1 = __importDefault(require("../../changes.json"));
const toRichText = (value) => {
    let richText = {
        content: [
            {
                content: [
                    {
                        data: {},
                        marks: [],
                        nodeType: "text",
                        value: value || "",
                    },
                ],
                data: {},
                nodeType: "paragraph",
            },
        ],
        data: {},
        nodeType: "document",
    };
    return richText;
};
exports.toRichText = toRichText;
const refrenceToJson = async (value, mapping) => {
    const { spaceID, environment } = changes_json_1.default;
    const { sys: { id }, } = value;
    const locale = "en-AU";
    const entry = await (0, _get_entries_1.getEntryByID)({
        spaceID,
        environment,
        entryID: id,
    });
    const fields = entry?.fields;
    let updatedFields = {};
    const mappingKeys = Object.keys(mapping);
    Object.keys(mapping).forEach((i) => {
        if (fields?.[i]) {
            updatedFields[mapping[i]] = fields[i][locale];
        }
    });
    console.log("converted refrence to json");
    return updatedFields;
};
exports.refrenceToJson = refrenceToJson;
const refrenceMapping = async (value, mapping) => {
    const { spaceID, environment } = changes_json_1.default;
    if (mapping["fieldID"]) {
        const fieldID = mapping["fieldID"];
        const fieldValue = value[fieldID] || [];
        let mappings = [];
        for (let i = 0; i < fieldValue.length; i++) {
            const entry = fieldValue[i];
            if (entry) {
                const refrence = await (0, exports.refrenceMapping)(entry, {
                    ...mapping,
                    fieldID: undefined,
                });
                if (refrence)
                    mappings.push(refrence);
            }
        }
        return { ...value, [fieldID]: mappings };
    }
    else {
        const { sys: { id }, } = value;
        const entry = await (0, _get_entries_1.getEntryByID)({
            spaceID,
            environment,
            entryID: id,
        });
        if (entry) {
            const destContentTypeID = mapping?.content_type;
            const q = entry?.fields?.["name"]?.["en-AU"];
            const prefix = mapping?.prefix;
            const queryString = prefix && String(q).trim().length > 0 ? `${mapping?.prefix}${q}` : q;
            let entryFromOtherEnv;
            let entryProps = {
                spaceID: mapping?.spaceID,
                environment: mapping?.environment,
                slug: "name",
                q: queryString,
                contentTypeID: destContentTypeID || entry.sys.contentType.sys.id,
            };
            if (destContentTypeID) {
                if (Array.isArray(destContentTypeID)) {
                    for (let cidx = 0; cidx < destContentTypeID.length; cidx++) {
                        const contentIDToCheck = destContentTypeID[cidx];
                        console.log(`Looking entry for ${queryString} in ${contentIDToCheck}`);
                        const destinationEntry = await (0, _get_entries_1.getEntryByField)({
                            ...entryProps,
                            contentTypeID: contentIDToCheck,
                        });
                        if (destinationEntry && destinationEntry?.items?.length > 0) {
                            entryFromOtherEnv = destinationEntry;
                            console.log("found.... exiting from the loop");
                            break;
                        }
                    }
                }
                else {
                    entryFromOtherEnv = await (0, _get_entries_1.getEntryByField)(entryProps);
                }
            }
            console.log("converted refrence to another refrence");
            if (entryFromOtherEnv && entryFromOtherEnv?.items?.length > 0) {
                const newEntry = entryFromOtherEnv?.items[0];
                return {
                    sys: {
                        type: "Link",
                        linkType: "Entry",
                        id: newEntry?.sys?.id,
                    },
                };
            }
            else
                return undefined;
        }
        else
            return undefined;
    }
};
exports.refrenceMapping = refrenceMapping;
const refrenceToSTring = async (value, mapping) => {
    const { spaceID, environment } = changes_json_1.default;
    const { sys: { id }, } = value;
    const locale = "en-AU";
    const entry = await (0, _get_entries_1.getEntryByID)({
        spaceID,
        environment,
        entryID: id,
    });
    if (entry) {
        const fields = entry.fields;
        if (fields?.[mapping])
            return fields[mapping]?.["en-AU"];
    }
    return undefined;
};
exports.refrenceToSTring = refrenceToSTring;
const dateToEupropeanFormat = (props) => {
    const { value } = props;
    const convertedDate = (0, moment_1.default)(String(value)).format("DD/MM/YYYY").toString();
    return convertedDate;
};
exports.dateToEupropeanFormat = dateToEupropeanFormat;
const valueMapping = (props) => {
    const { mapping } = props;
    return mapping?.value;
};
exports.valueMapping = valueMapping;
