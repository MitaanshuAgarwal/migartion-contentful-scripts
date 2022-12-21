import { ContentFields, KeyValueMap } from "contentful-management";
import { getSchemaProps } from "./getCreateModal";
import { getSpace } from "./init";

interface linkEntryProps {
  spaceID: string;
  to: {
    environment: string;
  };
  fields: ContentFields<KeyValueMap>[];
}

export const checkContentTypeExists = async (props: getSchemaProps) => {
  const { spaceID, environment, content_type } = props;

  try {
    const space = await getSpace({ spaceID, environment });
    const contentType = await space.getContentType(content_type);

    if (contentType) {
      console.log(`${content_type} content type exits`);
      return true;
    } else {
      console.log(`${content_type} content type does not exist`);
      return false;
    }
  } catch (error) {
    if (error.name === "NotFound") {
      console.log(`${content_type} content type does not exist`);
      return false;
    } else throw new Error(error);
  }
};

export const checkLinkEntryExist = async (props: {
  fields: ContentFields<KeyValueMap>[];
}) => {
  const { fields } = props;
  let tobeMade = [];

  console.log(`Checking does schema consists refrences to other content types`);

  for (let fieldID = 0; fieldID < fields.length; fieldID++) {
    const field = fields[fieldID];

    if (field?.items?.type === "Link" && field?.items?.linkType === "Entry") {
      const { validations } = field?.items;

      for (
        let validationID = 0;
        validationID < validations.length;
        validationID++
      ) {
        const { linkContentType } = validations[validationID];

        for (
          let linkContentTypeID = 0;
          linkContentTypeID < linkContentType.length;
          linkContentTypeID++
        ) {
          const contentTypeID = linkContentType[linkContentTypeID];
          tobeMade.push(contentTypeID);
        }
      }
    }
  }
  return tobeMade;
};
