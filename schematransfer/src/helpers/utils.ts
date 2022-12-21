import changes from "../json/changes.json";
import { ContentFields, KeyValueMap } from "contentful-management";
import equal from "deep-equal";
import {
  checkContentTypeExists,
  checkLinkEntryExist,
  createContentType,
  deleteContentType,
  getSchema,
} from ".";
import { contentTypesChecked } from "..";

/* 
  checking if the content type is linked with other content types recursively
*/
export const findDependencies = async (contentTypes: string[]) => {
  const { spaceID, from } = changes as any;

  // getting schema for content type to be created
  for (let i = 0; i < contentTypes.length; i++) {
    const contentType = contentTypes[i];

    if (!contentTypesChecked.includes(contentType)) {
      contentTypesChecked.push(contentType);

      console.log(
        `Found ${contentType}, now checking if this also contains refrences to other content types`
      );

      const schema = await getSchema({
        spaceID,
        environment: from.environment,
        content_type: contentType,
      });
      const schemasToBeCreated = await checkLinkEntryExist({
        fields: schema.fields,
      });

      if (schemasToBeCreated.length > 0) {
        console.log(
          `content types refrences found: ${schemasToBeCreated.join(", ")} \n`
        );
        await findDependencies(schemasToBeCreated);
      } else console.log(`content type refrences not found \n`);
    }
  }
};

/*
    if that entry's content type does not exist 
    in the destination environment it creates it
    and if the content type exist it will delete it 
    and will recreate it with new schema
  */
export const preprocess = async (props: { contentType: string }) => {
  const { spaceID, from, to, rename } = changes as any;
  let { contentType } = props;
  const hasToBeRenamed = rename[contentType];
  let name = "";
  let id = contentType;

  if (hasToBeRenamed) {
    id = hasToBeRenamed.id;
    name = hasToBeRenamed.name;
  }

  let { editorInterface: editorInterfaceInSourceEnv, ...schemaInSourceEnv } =
    await getSchema({
      spaceID,
      environment: from.environment,
      content_type: contentType,
    });
  schemaInSourceEnv.fields = renameRefrences({
    fields: schemaInSourceEnv.fields,
  });

  const contentTypeExist = await checkContentTypeExists({
    spaceID,
    environment: to.environment,
    content_type: id,
  });
  if (!contentTypeExist) {
    console.log(`---> Creating content type ${id} in env ${to.environment}`);
    await createContentType({
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

export const renameRefrences = (props: {
  fields: ContentFields<KeyValueMap>[];
}) => {
  let { fields } = props;
  const { rename } = changes as any;

  for (let fieldID = 0; fieldID < fields.length; fieldID++) {
    const field = fields[fieldID];

    if (field?.items?.type === "Link" && field?.items?.linkType === "Entry") {
      const { validations } = field?.items;

      for (
        let validationID = 0;
        validationID < validations.length;
        validationID++
      ) {
        fields[fieldID].items.validations[validationID].linkContentType =
          fields[fieldID].items.validations[validationID].linkContentType.map(
            (i) => {
              const hasToBeRenamed = rename[i];
              return hasToBeRenamed ? hasToBeRenamed.id : i;
            }
          );
      }
    }
  }

  return fields;
};
