"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypesChecked = void 0;
const helpers_1 = require("./helpers");
const changes_json_1 = __importDefault(require("./json/changes.json"));
const init = async () => {
    const { spaceID, from, to, rename } = changes_json_1.default;
    exports.contentTypesChecked = [];
    let { editorInterface, ...contentTypeSchema } = await (0, helpers_1.getSchema)({
        spaceID,
        environment: from.environment,
        content_type: from.content_type,
    });
    const schemasToBeCreated = await (0, helpers_1.checkLinkEntryExist)({
        fields: contentTypeSchema.fields,
    });
    if (schemasToBeCreated.length > 0) {
        await (0, helpers_1.findDependencies)(schemasToBeCreated);
    }
    console.log(`\n\n Dependencies found for ${from.content_type}\n`);
    console.log(exports.contentTypesChecked);
    exports.contentTypesChecked = exports.contentTypesChecked.reverse();
    for (let i = 0; i < exports.contentTypesChecked.length; i++) {
        const contentType = exports.contentTypesChecked[i];
        await (0, helpers_1.preprocess)({ contentType });
    }
    console.log(`---> Creating content type ${to.content_type} in env ${to.environment}`);
    //renaming all the changed names inside schema before creating the final content type
    contentTypeSchema.fields = (0, helpers_1.renameRefrences)({
        fields: contentTypeSchema.fields,
    });
    await (0, helpers_1.createContentType)({
        spaceID,
        environment: to.environment,
        id: to.content_type,
        schema: { ...contentTypeSchema, name: to.name },
        editorInterface,
    });
    console.log("done...");
};
init();
