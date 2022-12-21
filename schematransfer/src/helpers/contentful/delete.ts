import { checkContentTypeExists } from "./exists";
import { getSchemaProps } from "./getCreateModal";
import { getSpace } from "./init";

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
  const contentTypeExist = await checkContentTypeExists({
    spaceID,
    environment,
    content_type,
  });
  if (contentTypeExist) {
    const contentType = await space.getContentType(content_type);
    await contentType.unpublish();
    await contentType.delete();
    console.log(`Deleted content type:- ${content_type}`);
  } else {
    console.log(
      `Could not delete content type:- ${content_type} as it does not exist`
    );
  }
  return true;
};
