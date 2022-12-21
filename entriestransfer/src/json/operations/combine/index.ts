import { Entry } from "contentful-management";
import { addEntry } from "../../../helpers";
import changes from "../../changes.json";
import { addlocale } from "../utils/_addlocale";
import group from "./_group";

interface IProps {
  entry: Entry;
}

const combineEntry = async (props: IProps) => {
  let { entry } = props;
  const { combine: combineProps } = changes as any;

  let updatedEntry = {};

  for (let operationID = 0; operationID < combineProps.length; operationID++) {
    const { operation }: any = combineProps[operationID];
    const { name, fields, mapping, value } = operation;

    if (name === "groupFields") {
      updatedEntry = await group({ entry, fields });
    } else if (name === "addNewEntry") {
      const { spaceID, environment, content_type } = mapping;
      updatedEntry = await addEntry({
        spaceID,
        environment,
        content_type,
        fields: addlocale({ locale: "en-AU", entry: updatedEntry }),
        toBePublished: true,
      });
    } else if (name === "combineRefrenceAsLink") {
      entry.fields = {
        ...entry.fields,
        [value]: {
          "en-AU": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: (updatedEntry as Entry).sys.id,
              },
            },
          ],
        },
      };
    }
  }

  return entry;
};

export default combineEntry;
