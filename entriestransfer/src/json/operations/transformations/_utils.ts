import { Entry } from "contentful-management";
import moment from "moment";
import {
  getEntryByField,
  getEntryByID,
} from "../../../helpers/contentful/_get_entries";
import changes from "../../changes.json";

export const toRichText = (value: any) => {
  let richText = {
    content: [
      {
        content: [
          {
            data: {},
            marks: [],
            nodeType: "text",
            value: value || "",
          },
        ],
        data: {},
        nodeType: "paragraph",
      },
    ],
    data: {},
    nodeType: "document",
  };

  return richText;
};

export const refrenceToJson = async (value: any, mapping: any) => {
  const { spaceID, environment } = changes;
  const {
    sys: { id },
  } = value;
  const locale = "en-AU";
  const entry: Entry = await getEntryByID({
    spaceID,
    environment,
    entryID: id,
  });
  const fields = entry?.fields;
  let updatedFields = {};
  const mappingKeys = Object.keys(mapping);
  Object.keys(mapping).forEach((i) => {
    if (fields?.[i]) {
      updatedFields[mapping[i]] = fields[i][locale];
    }
  });
  console.log("converted refrence to json");
  return updatedFields;
};

export const refrenceMapping = async (value: any, mapping: any) => {
  const { spaceID, environment } = changes;

  if (mapping["fieldID"]) {
    const fieldID = mapping["fieldID"];
    const fieldValue = value[fieldID] || [];
    let mappings = [];

    for (let i = 0; i < fieldValue.length; i++) {
      const entry = fieldValue[i];
      if (entry) {
        const refrence = await refrenceMapping(entry, {
          ...mapping,
          fieldID: undefined,
        });
        if (refrence) mappings.push(refrence);
      }
    }

    return { ...value, [fieldID]: mappings };
  } else {
    const {
      sys: { id },
    } = value;
    const entry: Entry = await getEntryByID({
      spaceID,
      environment,
      entryID: id,
    });

    if (entry) {
      const destContentTypeID = mapping?.content_type;
      const q = entry?.fields?.["name"]?.["en-AU"];
      const prefix = mapping?.prefix;
      const queryString =
        prefix && String(q).trim().length > 0 ? `${mapping?.prefix}${q}` : q;
      let entryFromOtherEnv;

      let entryProps = {
        spaceID: mapping?.spaceID,
        environment: mapping?.environment,
        slug: "name",
        q: queryString,
        contentTypeID: destContentTypeID || entry.sys.contentType.sys.id,
      };

      if (destContentTypeID) {
        if (Array.isArray(destContentTypeID)) {
          for (let cidx = 0; cidx < destContentTypeID.length; cidx++) {
            const contentIDToCheck = destContentTypeID[cidx];

            console.log(
              `Looking entry for ${queryString} in ${contentIDToCheck}`
            );

            const destinationEntry = await getEntryByField({
              ...entryProps,
              contentTypeID: contentIDToCheck,
            });

            if (destinationEntry && destinationEntry?.items?.length > 0) {
              entryFromOtherEnv = destinationEntry;
              console.log("found.... exiting from the loop");
              break;
            }
          }
        } else {
          entryFromOtherEnv = await getEntryByField(entryProps);
        }
      }

      console.log("converted refrence to another refrence");
      if (entryFromOtherEnv && entryFromOtherEnv?.items?.length > 0) {
        const newEntry = entryFromOtherEnv?.items[0];
        return {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: newEntry?.sys?.id,
          },
        };
      } else return undefined;
    } else return undefined;
  }
};

export const refrenceToSTring = async (value: any, mapping: any) => {
  const { spaceID, environment } = changes;
  const {
    sys: { id },
  } = value;
  const locale = "en-AU";
  const entry: Entry = await getEntryByID({
    spaceID,
    environment,
    entryID: id,
  });
  if (entry) {
    const fields = entry.fields;
    if (fields?.[mapping]) return fields[mapping]?.["en-AU"];
  }
  return undefined;
};

export const dateToEupropeanFormat = (props) => {
  const { value } = props;
  const convertedDate = moment(String(value)).format("DD/MM/YYYY").toString();
  return convertedDate;
};

export const valueMapping = (props) => {
  const { mapping } = props;
  return mapping?.value;
};
