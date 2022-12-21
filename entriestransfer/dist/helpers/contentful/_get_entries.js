"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntries = exports.getEntryByField = exports.getEntryByID = exports.getSpace = void 0;
const contentful_management_1 = require("contentful-management");
const client = (0, contentful_management_1.createClient)({
    accessToken: "kMFWMaFeNrvmltPF9YHyt8A7KMmmFy8D0LmoE-TDp84",
});
const getSpace = async (props) => {
    const { spaceID, environment } = props;
    const space = await client.getSpace(spaceID);
    const env = await space.getEnvironment(environment);
    return env;
};
exports.getSpace = getSpace;
const getEntryByID = async (props) => {
    const { spaceID, environment, entryID } = props;
    try {
        const space = await (0, exports.getSpace)({
            spaceID,
            environment,
        });
        const entry = await space.getEntry(entryID);
        return entry;
    }
    catch (error) {
        return undefined;
    }
};
exports.getEntryByID = getEntryByID;
const getEntryByField = async (props) => {
    const { spaceID, environment, contentTypeID, slug, q } = props;
    const space = await (0, exports.getSpace)({
        spaceID,
        environment,
    });
    const query = { content_type: contentTypeID, [`fields.${slug}`]: q };
    const entry = await space.getEntries({
        ...query,
    });
    return entry;
};
exports.getEntryByField = getEntryByField;
const getEntries = async (props) => {
    const { spaceID, environment, ...otherProps } = props;
    const space = await (0, exports.getSpace)({
        spaceID,
        environment,
    });
    const entries = await space.getEntries(otherProps);
    return entries;
};
exports.getEntries = getEntries;
