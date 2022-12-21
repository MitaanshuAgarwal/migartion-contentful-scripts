import { ContentType } from "contentful-management";
import { deleteContentType } from "./delete";
import { client } from "./init";

interface envronmentProps {
  spaceID: string;
  id: string;
  name: string;
  cloneEnvID: string;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const createEnvironment = async (props: envronmentProps) => {
  const { spaceID, id, name, cloneEnvID } = props;

  try {
    const space = await client.getSpace(spaceID);

    const environment = await space.createEnvironmentWithId(
      id,
      { name },
      cloneEnvID
    );

    let contentTypes: ContentType[];
    let isCreated = false;

    while (!isCreated) {
      console.log(`Environemt ${name} creating...`);
      try {
        contentTypes = await (await environment.getContentTypes()).items;
        if (contentTypes) isCreated = true;
      } catch (error) {
        isCreated = false;
      } finally {
        await delay(5000);
      }
    }

    if (contentTypes) console.log(`Environemt ${name} created`);

    console.log(`Environemt ${name} will be emptied....`);

    for (let idx = 0; idx < contentTypes.length; idx++) {
      const contentType = contentTypes[idx];
      const contentTypeID = contentType.sys.id;

      await deleteContentType({
        spaceID,
        environment: id,
        content_type: contentTypeID,
      });
    }
    console.log(`Environemt ${name} emptied`);

    return true;
  } catch (error) {
    console.log(error);
  }
};
