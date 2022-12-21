import { KeyValueMap } from "contentful-management";

interface IProps {
  entry: KeyValueMap;
  replacements: KeyValueMap;
}

export const renameObjectKey = (props: IProps) => {
  try {
    const { entry, replacements } = props;
    let replacedItems = Object.keys(entry)
      .map((key) => {
        const newKey = replacements[key] || key;
        return { [newKey]: entry[key] };
      })
      .filter((i) => i);
    const updatedEntry = replacedItems.reduce(
      (a, b) => Object.assign({}, a, b),
      {}
    );

    return updatedEntry;
  } catch (error) {
    console.log(error);
  }
};
