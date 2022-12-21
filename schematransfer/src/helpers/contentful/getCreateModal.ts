import {
  ContentFields,
  EditorInterface,
  KeyValueMap,
} from "contentful-management";
import { getSpace } from "./init";

export interface getSchemaProps {
  spaceID: string;
  environment: string;
  content_type: string;
}

interface createContentTypeProps {
  id: string;
  spaceID: string;
  environment: string;
  editorInterface: EditorInterface;
  schema: {
    name?: string;
    displayField?: string;
    fields: ContentFields<KeyValueMap>[];
  };
}

export const getSchema = async (props: getSchemaProps) => {
  const { spaceID, environment, content_type } = props;
  const space = await getSpace({ spaceID, environment });
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

export const createContentType = async (props: createContentTypeProps) => {
  const { spaceID, environment, id, schema, editorInterface } = props;
  const space = await getSpace({ spaceID, environment });
  const contentType = await (
    await space.createContentTypeWithId(id, schema)
  ).publish();
  const contentEditorInterface = await contentType.getEditorInterface();
  contentEditorInterface.editor = editorInterface.editor;
  contentEditorInterface.controls = editorInterface.controls;
  contentEditorInterface.sidebar = editorInterface.sidebar;
  contentEditorInterface.groupControls = editorInterface.groupControls;
  contentEditorInterface.editorLayout = editorInterface.editorLayout;

  await contentEditorInterface.update();

  return true;
};
