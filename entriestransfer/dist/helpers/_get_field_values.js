"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _get_entries_1 = require("./contentful/_get_entries");
const changes_json_1 = __importDefault(require("../json/changes.json"));
const _json_to_file_1 = require("./_json_to_file");
const getFieldValues = async (props) => {
    const { fieldID } = props;
    const { spaceID, environment, content_type } = changes_json_1.default;
    const entries = await (0, _get_entries_1.getEntries)({ spaceID, environment, content_type });
    // let items = entries.items
    //   .map((i) => i.fields?.[fieldID]?.["en-AU"])
    //   .filter((i) => i);
    // let data = flatten(items);
    let updatedData = [];
    // data = [...new Set(data)];
    entries.items.forEach((i) => {
        const { name, ruleId } = i.fields;
        if (name && ruleId) {
            updatedData.push({ name: name["en-AU"], ruleId: ruleId["en-AU"] });
        }
    });
    // for (let i = 0; i < data.length; i++) {
    //   const {
    //     sys: { id },
    //   } = data[i];
    //   const entry = await getEntryByID({
    //     spaceID,
    //     environment,
    //     entryID: id,
    //   });
    //   if (entry.sys.contentType.sys.id === "mmmExclusion") {
    //     const fields = entry.fields;
    //     if (fields["ruleId"]) {
    //       updatedData.push({
    //         name: fields?.["name"]?.["en-AU"],
    //         ruleId: fields["ruleId"]["en-AU"],
    //       });
    //       console.log(updatedData);
    //     }
    //   }
    // }
    let map = new Map();
    updatedData.forEach((p) => map.set(p.ruleId, p));
    updatedData = [...map.values()];
    await (0, _json_to_file_1.writeJSON)({
        outputFileName: "Exclusion Rules.json",
        jsonContent: JSON.stringify(updatedData),
    });
};
exports.default = getFieldValues;
