interface IProps {
  value: any;
  mapping: {
    from: string;
    to: string;
    key: any | string;
  };
}

export const arrayTransformation = (props: IProps) => {
  const {
    value,
    mapping: { from, to, key },
  } = props;
  let updatedEntryValue = [];

  if (from === "string" && to === "object") {
    updatedEntryValue = value.map((i) => {
      return {
        [key]: i,
      };
    });
  } else {
    updatedEntryValue = value;
  }

  return updatedEntryValue;
};
