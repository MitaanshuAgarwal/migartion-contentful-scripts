import { Entry, KeyValueMap } from "contentful-management";
import { renameObjectKey } from "./helpers";
import { addEntry, getEntries } from "./helpers/contentful";
import checkEntryAgainstJSON from "./json/changes";
import changes from "./json/changes.json";
import { explodeJson } from "./json/operations/utils";
import { filterRecords } from "./json/operations/filter";
import combineEntry from "./json/operations/combine";
import { deleteContentType } from "./helpers/contentful/_delete";

const init = async () => {
  const {
    spaceID,
    environment,
    content_type,
    limit,
    operations,
    rename,
    skip,
    omit,
    filters,
    explode,
    combine,
  } = changes as any;

  const entries = await getEntries({
    spaceID,
    environment,
    content_type,
    limit,
  });

  let entryItems = entries.items || [];
  let updatedEntries: Entry[] = [];

  // const toBeDeleted = [
  //   "mmmContentButton",
  //   "mmmContentAtlTextBanner",
  //   "mmmContentAtlImageBanner",
  //   "mmmContentDivider",
  //   "mmmContentRecipe",
  //   "mmmModule",
  //   "mmmTargetingBox",
  //   "mmmSendDatesAtlBanner",
  //   "mmmCampaignSend",
  // ];

  // for (let i = 0; i < toBeDeleted.length; i++) {
  //   const deletedID = toBeDeleted[i];

  //   await deleteContentType({
  //     spaceID: "45lly9oa9o4c",
  //     environment: "sandbox_testing",
  //     content_type: deletedID,
  //   });
  // }

  for (let entryID = 0; entryID < entryItems.length; entryID++) {
    if (entryID >= skip && entryID < limit) {
      const entry = entryItems[entryID];
      console.log(`processing entry no. ${entryID + 1}`);

      if (Object.keys(entry?.fields).length > 0) {
        const updatedEntry = await checkEntryAgainstJSON({
          entry,
          locale: "en-AU",
        });
        updatedEntries.push(updatedEntry);
      }
    }
  }

  updatedEntries = filterRecords({ entryValues: updatedEntries });

  console.log(
    `Total filtered content ${updatedEntries.length}/${entryItems.length}`
  );

  if (explode) {
    updatedEntries.forEach((i, k) => {
      let fields = i.fields;

      explode.forEach((explodeID) => {
        const toBeExploded = fields[explodeID];
        if (toBeExploded) {
          const explodedData = explodeJson({
            entryValue: toBeExploded,
          });
          delete fields[explodeID];
          fields = {
            ...fields,
            ...explodedData,
          };

          updatedEntries[k].fields = fields;
        }
      });
    });
  }

  if (combine) {
    let _updatedEntries = [];
    for (
      let updatedEntryID = 0;
      updatedEntryID < updatedEntries.length;
      updatedEntryID++
    ) {
      const updatedEntry = updatedEntries[updatedEntryID];
      const groupedEntry = await combineEntry({ entry: updatedEntry });
      _updatedEntries.push(groupedEntry);
    }
    updatedEntries = _updatedEntries;
  }

  if (omit) {
    updatedEntries = updatedEntries.map((entry) => {
      omit.forEach((k) => {
        delete entry.fields[k];
      });
      return entry;
    });
  }

  if (rename) {
    updatedEntries.forEach((i, k) => {
      updatedEntries[k].fields = renameObjectKey({
        entry: updatedEntries[k].fields,
        replacements: rename,
      });
    });
  }

  updatedEntries = updatedEntries.reverse();

  for (let operationID = 0; operationID < operations.length; operationID++) {
    const { name, prefix, ...otherProps } = operations[operationID];

    if (name === "update") {
      for (
        let updateEntryID = 0;
        updateEntryID < updatedEntries.length;
        updateEntryID++
      ) {
        const updateEntry = updatedEntries[updateEntryID];
        await updateEntry?.update();
        console.log("updated entry");
      }
    } else if (name === "move") {
      let allEntriesData = updatedEntries.map((item) => {
        return [item.isPublished(), item.fields];
      });

      for (
        let newEntryID = 0;
        newEntryID < allEntriesData.length;
        newEntryID++
      ) {
        const [isPublished, newEntry] = allEntriesData[newEntryID];
        await addEntry({
          ...otherProps,
          fields: newEntry as KeyValueMap,
          toBePublished: isPublished as boolean,
          prefix,
        });
      }
    }
  }

  console.log("job completed");
};

init();
