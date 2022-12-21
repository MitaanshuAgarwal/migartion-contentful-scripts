"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _get_entries_1 = require("../helpers/contentful/_get_entries");
const changes_json_1 = __importDefault(require("../json/changes.json"));
const _array_transformation_1 = require("./_array_transformation");
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
const refrenceToJson = async (value, mapping) => {
    const { spaceID, environment } = changes_json_1.default;
    const { sys: { id }, } = value;
    const locale = "en-AU";
    const entry = await (0, _get_entries_1.getEntryByID)({
        spaceID,
        environment,
        entryID: id,
    });
    const fields = entry.fields;
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
const refrenceMapping = async (value, mapping) => {
    const { spaceID, environment } = changes_json_1.default;
    if (mapping["fieldID"]) {
        const fieldID = mapping["fieldID"];
        const fieldValue = value[fieldID] || [];
        let mappings = [];
        for (let i = 0; i < fieldValue.length; i++) {
            const entry = fieldValue[i];
            if (entry) {
                const refrence = await refrenceMapping(entry, {
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
            const q = entry?.fields?.["name"]?.["en-AU"];
            const entryFromOtherEnv = await (0, _get_entries_1.getEntryByField)({
                spaceID: mapping?.spaceID,
                environment: mapping?.environment,
                slug: "name",
                q: mapping?.prefix && String(q).trim().length > 0
                    ? `${mapping?.prefix}${q}`
                    : q,
                contentTypeID: mapping?.content_type || entry.sys.contentType.sys.id,
            });
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
const transformation = async (props) => {
    const { operation, entryValue, mapping } = props;
    if (operation === "textToRichText")
        return toRichText(entryValue);
    else if (operation === "referenceToJson")
        return await refrenceToJson(entryValue, mapping);
    else if (operation === "referenceMapping") {
        let newEntryValue;
        if (Array.isArray(entryValue)) {
            newEntryValue = [];
            for (let refrenceID = 0; refrenceID < entryValue.length; refrenceID++) {
                const reference = await refrenceMapping(entryValue[refrenceID], mapping);
                newEntryValue.push(reference);
            }
            newEntryValue = newEntryValue.filter((i) => i);
        }
        else {
            newEntryValue = await refrenceMapping(entryValue, mapping);
        }
        return newEntryValue;
    }
    else if (operation === "referenceToString") {
        let newEntryValue;
        if (Array.isArray(entryValue)) {
            newEntryValue = await Promise.all(entryValue.map(async (i) => await refrenceToSTring(i, mapping)));
            newEntryValue = newEntryValue.filter((i) => i);
        }
        else {
            newEntryValue = await refrenceToSTring(entryValue, mapping);
        }
        return newEntryValue;
    }
    else if (operation === "ArrayTransformation") {
        return (0, _array_transformation_1.arrayTransformation)({
            value: entryValue,
            mapping,
        });
    }
};
exports.default = transformation;
