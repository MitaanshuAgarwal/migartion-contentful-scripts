import { createClient, Environment } from "contentful-management";

interface spaceProps {
  spaceID: string;
  environment: string;
}

export const client = createClient({
  accessToken: "kMFWMaFeNrvmltPF9YHyt8A7KMmmFy8D0LmoE-TDp84",
});

export const getSpace = async (props: spaceProps): Promise<Environment> => {
  const { spaceID, environment } = props;
  const space = await client.getSpace(spaceID);
  const env = await space.getEnvironment(environment);
  return env;
};
