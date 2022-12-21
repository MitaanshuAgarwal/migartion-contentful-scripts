import { Entry } from "contentful-management";
import applyOperations from "..";

interface IProps {
  entry: Entry;
  fields: {
    name: string;
    value?: string;
    rename?: string;
    operations?: any[];
  }[];
}

const groupFields = async (props: IProps) => {
  const { entry, fields } = props;

  let entryFields = entry.fields;
  let groupedFields = {};
  for (let fieldID = 0; fieldID < fields.length; fieldID++) {
    const { name, value, rename, operations } = fields[fieldID];
    const field = entryFields[name];

    if (field) {
      const fieldValue = field["en-AU"];

      if (operations) {
        let newEntryValue = fieldValue;

        for (
          let operationID = 0;
          operationID < operations.length;
          operationID++
        ) {
          const operation = operations[operationID];
          newEntryValue = await applyOperations({
            entryValue: newEntryValue,
            ...operation,
          });
        }
        groupedFields[rename ? rename : name] = value ? value : newEntryValue;
      } else groupedFields[rename ? rename : name] = value ? value : fieldValue;
    }
  }

  return groupedFields;
};

export default groupFields;
