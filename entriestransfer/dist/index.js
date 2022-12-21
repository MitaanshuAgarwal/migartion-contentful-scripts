"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const contentful_1 = require("./helpers/contentful");
const changes_1 = __importDefault(require("./json/changes"));
const changes_json_1 = __importDefault(require("./json/changes.json"));
const utils_1 = require("./json/operations/utils");
const filter_1 = require("./json/operations/filter");
const combine_1 = __importDefault(require("./json/operations/combine"));
const init = async () => {
    const { spaceID, environment, content_type, limit, operations, rename, skip, omit, filters, explode, combine, } = changes_json_1.default;
    const entries = await (0, contentful_1.getEntries)({
        spaceID,
        environment,
        content_type,
        limit,
    });
    let entryItems = entries.items || [];
    let updatedEntries = [];
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
                const updatedEntry = await (0, changes_1.default)({
                    entry,
                    locale: "en-AU",
                });
                updatedEntries.push(updatedEntry);
            }
        }
    }
    updatedEntries = (0, filter_1.filterRecords)({ entryValues: updatedEntries });
    console.log(`Total filtered content ${updatedEntries.length}/${entryItems.length}`);
    if (explode) {
        updatedEntries.forEach((i, k) => {
            let fields = i.fields;
            explode.forEach((explodeID) => {
                const toBeExploded = fields[explodeID];
                if (toBeExploded) {
                    const explodedData = (0, utils_1.explodeJson)({
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
        for (let updatedEntryID = 0; updatedEntryID < updatedEntries.length; updatedEntryID++) {
            const updatedEntry = updatedEntries[updatedEntryID];
            const groupedEntry = await (0, combine_1.default)({ entry: updatedEntry });
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
            updatedEntries[k].fields = (0, helpers_1.renameObjectKey)({
                entry: updatedEntries[k].fields,
                replacements: rename,
            });
        });
    }
    updatedEntries = updatedEntries.reverse();
    for (let operationID = 0; operationID < operations.length; operationID++) {
        const { name, prefix, ...otherProps } = operations[operationID];
        if (name === "update") {
            for (let updateEntryID = 0; updateEntryID < updatedEntries.length; updateEntryID++) {
                const updateEntry = updatedEntries[updateEntryID];
                await updateEntry?.update();
                console.log("updated entry");
            }
        }
        else if (name === "move") {
            let allEntriesData = updatedEntries.map((item) => {
                return [item.isPublished(), item.fields];
            });
            for (let newEntryID = 0; newEntryID < allEntriesData.length; newEntryID++) {
                const [isPublished, newEntry] = allEntriesData[newEntryID];
                await (0, contentful_1.addEntry)({
                    ...otherProps,
                    fields: newEntry,
                    toBePublished: isPublished,
                    prefix,
                });
            }
        }
    }
    console.log("job completed");
};
init();
