"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameRefrences = exports.preprocess = exports.findDependencies = void 0;
const changes_json_1 = __importDefault(require("../json/changes.json"));
const _1 = require(".");
const __1 = require("..");
/*
  checking if the content type is linked with other content types recursively
*/
const findDependencies = async (contentTypes) => {
    const { spaceID, from } = changes_json_1.default;
    // getting schema for content type to be created
    for (let i = 0; i < contentTypes.length; i++) {
        const contentType = contentTypes[i];
        if (!__1.contentTypesChecked.includes(contentType)) {
            __1.contentTypesChecked.push(contentType);
            console.log(`Found ${contentType}, now checking if this also contains refrences to other content types`);
            const schema = await (0, _1.getSchema)({
                spaceID,
                environment: from.environment,
                content_type: contentType,
            });
            const schemasToBeCreated = await (0, _1.checkLinkEntryExist)({
                fields: schema.fields,
            });
            if (schemasToBeCreated.length > 0) {
                console.log(`content types refrences found: ${schemasToBeCreated.join(", ")} \n`);
                await (0, exports.findDependencies)(schemasToBeCreated);
            }
            else
                console.log(`content type refrences not found \n`);
        }
    }
};
exports.findDependencies = findDependencies;
/*
    if that entry's content type does not exist
    in the destination environment it creates it
    and if the content type exist it will delete it
    and will recreate it with new schema
  */
const preprocess = async (props) => {
    const { spaceID, from, to, rename } = changes_json_1.default;
    let { contentType } = props;
    const hasToBeRenamed = rename[contentType];
    let name = "";
    let id = contentType;
    if (hasToBeRenamed) {
        id = hasToBeRenamed.id;
        name = hasToBeRenamed.name;
    }
    let { editorInterface: editorInterfaceInSourceEnv, ...schemaInSourceEnv } = await (0, _1.getSchema)({
        spaceID,
        environment: from.environment,
        content_type: contentType,
    });
    schemaInSourceEnv.fields = (0, exports.renameRefrences)({
        fields: schemaInSourceEnv.fields,
    });
    const contentTypeExist = await (0, _1.checkContentTypeExists)({
        spaceID,
        environment: to.environment,
        content_type: id,
    });
    if (!contentTypeExist) {
        console.log(`---> Creating content type ${id} in env ${to.environment}`);
        await (0, _1.createContentType)({
            spaceID,
            environment: to.environment,
            id,
            schema: {
                ...schemaInSourceEnv,
                name: hasToBeRenamed ? name : schemaInSourceEnv.name,
            },
            editorInterface: editorInterfaceInSourceEnv,
        });
    }
};
exports.preprocess = preprocess;
const renameRefrences = (props) => {
    let { fields } = props;
    const { rename } = changes_json_1.default;
    for (let fieldID = 0; fieldID < fields.length; fieldID++) {
        const field = fields[fieldID];
        if (field?.items?.type === "Link" && field?.items?.linkType === "Entry") {
            const { validations } = field?.items;
            for (let validationID = 0; validationID < validations.length; validationID++) {
                fields[fieldID].items.validations[validationID].linkContentType =
                    fields[fieldID].items.validations[validationID].linkContentType.map((i) => {
                        const hasToBeRenamed = rename[i];
                        return hasToBeRenamed ? hasToBeRenamed.id : i;
                    });
            }
        }
    }
    return fields;
};
exports.renameRefrences = renameRefrences;
