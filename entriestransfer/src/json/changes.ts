import { Entry } from "contentful-management";
import changesJSON from "./changes.json";
import validations from "./operations/validations";
import applyOperations from "./operations";

interface Iprops {
  entry: Entry;
  locale: "en-AU";
}

const checkEntryAgainstJSON = async (props: Iprops) => {
  let { entry, locale } = props;
  const { fields } = changesJSON;

  for (let fieldID = 0; fieldID < fields.length; fieldID++) {
    const {
      fieldID: fieldName,
      skipUndefinedCheck,
      replacingOtherFieldValue,
      replacingFieldID,
      change: { where, operations },
    } = fields[fieldID] as any;

    const toBeUpdated = where
      ?.map((condition) =>
        validations({
          ...condition,
          entryValue: entry.fields[fieldName]?.[locale],
        })
      )
      .includes(true);

    if (toBeUpdated) {
      let updatedEntry = entry.fields[fieldName]?.[locale];

      if (replacingOtherFieldValue) {
        updatedEntry = entry.fields[replacingFieldID]?.[locale];

        if (typeof updatedEntry !== "undefined" || skipUndefinedCheck) {
          for (
            let operationID = 0;
            operationID < operations.length;
            operationID++
          ) {
            const operation = operations[operationID];
            updatedEntry = await applyOperations({
              ...operation,
              entryValue: updatedEntry,
            });
          }

          if (!entry.fields[replacingFieldID]?.[locale]) {
            entry.fields[replacingFieldID] = {
              [locale]: {},
            };
          }

          entry.fields[replacingFieldID][locale] = updatedEntry;
        }
      } else if (typeof updatedEntry !== "undefined" || skipUndefinedCheck) {
        for (
          let operationID = 0;
          operationID < operations.length;
          operationID++
        ) {
          const operation = operations[operationID];
          updatedEntry = await applyOperations({
            ...operation,
            entryValue: updatedEntry,
          });
        }

        if (!entry.fields[fieldName]?.[locale]) {
          entry.fields[fieldName] = {
            [locale]: {},
          };
        }

        entry.fields[fieldName][locale] = updatedEntry;
      }
    }
  }

  return entry;
};

export default checkEntryAgainstJSON;
