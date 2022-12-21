import { getSpace } from "./_get_entries";

interface getSchemaProps {
  spaceID: string;
  environment: string;
  content_type: string;
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

export const deleteContentEntry = async (props: getSchemaProps) => {
  const { spaceID, environment, content_type } = props;
  const space = await getSpace({ spaceID, environment });

  const { items } = await space.getEntries({ content_type, limit: 1000 });

  for (let entryID = 0; entryID < items.length; entryID++) {
    const entry = items[entryID];
    if (entry.isPublished()) await entry.unpublish();
    await entry.delete();
    console.log(
      `Deleted entry ${entryID + 1} of content type:- ${content_type}`
    );
  }
  return true;
};

export const deleteContentType = async (props: getSchemaProps) => {
  const { spaceID, environment, content_type } = props;
  const space = await getSpace({ spaceID, environment });

  await deleteContentEntry(props);
  console.log(`Deleted content type:- ${content_type}`);
  return true;
};
