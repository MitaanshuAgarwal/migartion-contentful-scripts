"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEntry = void 0;
const _get_entries_1 = require("./_get_entries");
const addEntry = async (props) => {
    const { spaceID, environment, content_type, fields, toBePublished, prefix } = props;
    const space = await (0, _get_entries_1.getSpace)({
        spaceID,
        environment,
    });
    try {
        const entry = await space.createEntry(content_type, {
            fields: {
                ...fields,
                name: {
                    "en-AU": prefix
                        ? `${prefix}${fields?.name?.["en-AU"] || ""}`
                        : fields?.name?.["en-AU"],
                },
            },
        });
        if (toBePublished)
            await entry
                .publish()
                .catch((e) => console.log(`Error found:- ${e.name}`));
        console.log("added new entry");
        return entry;
    }
    catch (error) {
        console.log(fields);
        throw new Error(error);
    }
};
exports.addEntry = addEntry;
