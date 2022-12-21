"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentType = exports.deleteContentEntry = exports.checkContentTypeExists = void 0;
const _get_entries_1 = require("./_get_entries");
const checkContentTypeExists = async (props) => {
    const { spaceID, environment, content_type } = props;
    try {
        const space = await (0, _get_entries_1.getSpace)({ spaceID, environment });
        const contentType = await space.getContentType(content_type);
        if (contentType) {
            console.log(`${content_type} content type exits`);
            return true;
        }
        else {
            console.log(`${content_type} content type does not exist`);
            return false;
        }
    }
    catch (error) {
        if (error.name === "NotFound") {
            console.log(`${content_type} content type does not exist`);
            return false;
        }
        else
            throw new Error(error);
    }
};
exports.checkContentTypeExists = checkContentTypeExists;
const deleteContentEntry = async (props) => {
    const { spaceID, environment, content_type } = props;
    const space = await (0, _get_entries_1.getSpace)({ spaceID, environment });
    const { items } = await space.getEntries({ content_type, limit: 1000 });
    for (let entryID = 0; entryID < items.length; entryID++) {
        const entry = items[entryID];
        if (entry.isPublished())
            await entry.unpublish();
        await entry.delete();
        console.log(`Deleted entry ${entryID + 1} of content type:- ${content_type}`);
    }
    return true;
};
exports.deleteContentEntry = deleteContentEntry;
const deleteContentType = async (props) => {
    const { spaceID, environment, content_type } = props;
    const space = await (0, _get_entries_1.getSpace)({ spaceID, environment });
    await (0, exports.deleteContentEntry)(props);
    console.log(`Deleted content type:- ${content_type}`);
    return true;
};
exports.deleteContentType = deleteContentType;
