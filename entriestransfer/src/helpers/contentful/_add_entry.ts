import { KeyValueMap } from "contentful-management";
import { getSpace } from "./_get_entries";

interface addEntryProps {
  spaceID: string;
  environment: string;
  content_type: string;
  fields: KeyValueMap;
  toBePublished?: boolean;
  prefix?: string;
}

export const addEntry = async (props: addEntryProps) => {
  const { spaceID, environment, content_type, fields, toBePublished, prefix } =
    props;
  const space = await getSpace({
    spaceID,
    environment,
  });

  try {
    const entry = await space.createEntry(content_type, {
      fields: {
        ...fields,
        name: {
          "en-AU": prefix
            ? `${prefix}${fields?.name?.["en-AU"] || ""}`
            : fields?.name?.["en-AU"],
        },
      },
    });
    if (toBePublished)
      await entry
        .publish()
        .catch((e) => console.log(`Error found:- ${e.name}`));
    console.log("added new entry");

    return entry;
  } catch (error) {
    console.log(fields);
    throw new Error(error);
  }
};
