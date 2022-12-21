"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContentType = exports.getSchema = void 0;
const init_1 = require("./init");
const getSchema = async (props) => {
    const { spaceID, environment, content_type } = props;
    const space = await (0, init_1.getSpace)({ spaceID, environment });
    const contentType = await space.getContentType(content_type);
    const editorInterface = await contentType.getEditorInterface();
    const { displayField, name, fields } = contentType;
    console.log(`Getting schema for content type:- ${content_type}`);
    return {
        displayField,
        name,
        fields,
        editorInterface,
    };
};
exports.getSchema = getSchema;
const createContentType = async (props) => {
    const { spaceID, environment, id, schema, editorInterface } = props;
    const space = await (0, init_1.getSpace)({ spaceID, environment });
    const contentType = await (await space.createContentTypeWithId(id, schema)).publish();
    const contentEditorInterface = await contentType.getEditorInterface();
    contentEditorInterface.editor = editorInterface.editor;
    contentEditorInterface.controls = editorInterface.controls;
    contentEditorInterface.sidebar = editorInterface.sidebar;
    contentEditorInterface.groupControls = editorInterface.groupControls;
    contentEditorInterface.editorLayout = editorInterface.editorLayout;
    await contentEditorInterface.update();
    return true;
};
exports.createContentType = createContentType;
