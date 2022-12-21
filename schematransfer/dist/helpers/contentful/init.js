"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpace = exports.client = void 0;
const contentful_management_1 = require("contentful-management");
exports.client = (0, contentful_management_1.createClient)({
    accessToken: "kMFWMaFeNrvmltPF9YHyt8A7KMmmFy8D0LmoE-TDp84",
});
const getSpace = async (props) => {
    const { spaceID, environment } = props;
    const space = await exports.client.getSpace(spaceID);
    const env = await space.getEnvironment(environment);
    return env;
};
exports.getSpace = getSpace;
