export const addlocale = (props: {
  locale: string;
  entry: { [key: string]: any };
}) => {
  const { locale, entry } = props;
  let updatedEntry = {};

  Object.keys(entry).forEach((i) => {
    updatedEntry[i] = {
      [locale]: entry[i],
    };
  });

  return updatedEntry;
};
