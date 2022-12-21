import transformation from "./transformations";
import typeCasting from "./typeCasting";

interface operationProps {
  name: "typeCasting" | "transformation" | string;
  entryValue: any;
  value: any;
  mapping?: any;
}

const applyOperations = async (props: operationProps) => {
  const { entryValue, name, value, mapping } = props;

  let updatedValue = entryValue;
  if (name === "typeCasting") {
    updatedValue = typeCasting({
      operation: value,
      entryValue: entryValue,
    });
  } else if (name === "transformation") {
    updatedValue = await transformation({
      operation: value,
      entryValue: entryValue,
      mapping,
    });
  }

  return updatedValue;
};

export default applyOperations;
