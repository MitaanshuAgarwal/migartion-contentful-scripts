import fs from "fs/promises";

interface writeJSONProps {
  outputFileName: string;
  jsonContent: string;
}

export const writeJSON = async (props: writeJSONProps) => {
  const { outputFileName, jsonContent } = props;

  try {
    await fs.writeFile(outputFileName, jsonContent, "utf-8");
  } catch (error) {
    console.log(error);
  }
};
