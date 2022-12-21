interface typeCastingProps {
  operation: "array" | "string" | "number" | string;
  entryValue: any;
}

const toArray = (value: any) => {
  return [value];
};

const toString = (value: any) => {
  return String(value);
};

const toNumber = (value: any) => {
  return Number(value);
};

const typeCasting = (props: typeCastingProps) => {
  const { operation, entryValue } = props;
  if (operation === "array") return toArray(entryValue);
  else if (operation === "number") return toNumber(entryValue);
  else if (operation === "string") return toString(entryValue);
  else entryValue;
};

export default typeCasting;
