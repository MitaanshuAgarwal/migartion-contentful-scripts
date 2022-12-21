interface IProps {
  entryValue: { [key: string]: any };
}

export const explodeJson = (props: IProps) => {
  let payload = {};

  const { entryValue } = props;
  const data = entryValue["en-AU"];

  Object.keys(data).forEach((i) => (payload[i] = { "en-AU": data[i] }));

  return payload;
};
