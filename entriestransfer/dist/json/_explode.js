"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explodeJson = void 0;
const explodeJson = (props) => {
    let payload = {};
    const { entryValue } = props;
    const data = entryValue["en-AU"];
    Object.keys(data).forEach((i) => (payload[i] = { "en-AU": data[i] }));
    return payload;
};
exports.explodeJson = explodeJson;
