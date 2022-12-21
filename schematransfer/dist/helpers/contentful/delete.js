"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentType = exports.deleteContentEntry = void 0;
const exists_1 = require("./exists");
const init_1 = require("./init");
const deleteContentEntry = async (props) => {
    const { spaceID, environment, content_type } = props;
    const space = await (0, init_1.getSpace)({ spaceID, environment });
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
    const space = await (0, init_1.getSpace)({ spaceID, environment });
    await (0, exports.deleteContentEntry)(props);
    const contentTypeExist = await (0, exists_1.checkContentTypeExists)({
        spaceID,
        environment,
        content_type,
    });
    if (contentTypeExist) {
        const contentType = await space.getContentType(content_type);
        await contentType.unpublish();
        await contentType.delete();
        console.log(`Deleted content type:- ${content_type}`);
    }
    else {
        console.log(`Could not delete content type:- ${content_type} as it does not exist`);
    }
    return true;
};
exports.deleteContentType = deleteContentType;
