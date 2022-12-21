import { createClient, Environment } from "contentful-management";
import { type } from "os";

interface spaceProps {
  spaceID: string;
  environment: string;
}

interface entriesProps {
  content_type: string;
  limit?: number;
  select?: string;
}

const client = createClient({
  accessToken: "kMFWMaFeNrvmltPF9YHyt8A7KMmmFy8D0LmoE-TDp84",
});

export const getSpace = async (props: spaceProps): Promise<Environment> => {
  const { spaceID, environment } = props;
  const space = await client.getSpace(spaceID);
  const env = await space.getEnvironment(environment);
  return env;
};

export const getEntryByID = async (props: spaceProps & { entryID: string }) => {
  const { spaceID, environment, entryID } = props;
  try {
    const space = await getSpace({
      spaceID,
      environment,
    });
    const entry = await space.getEntry(entryID);
    return entry;
  } catch (error) {
    return undefined;
  }
};

export const getEntryByField = async (
  props: spaceProps & { contentTypeID: string; slug: string; q: string }
) => {
  const { spaceID, environment, contentTypeID, slug, q } = props;
  const space = await getSpace({
    spaceID,
    environment,
  });

  const query = { content_type: contentTypeID, [`fields.${slug}`]: q };

  const entry = await space.getEntries({
    ...query,
  });
  return entry;
};

export const getEntries = async (props: spaceProps & entriesProps) => {
  const { spaceID, environment, ...otherProps } = props;
  const space = await getSpace({
    spaceID,
    environment,
  });
  const entries = await space.getEntries(otherProps);
  return entries;
};
