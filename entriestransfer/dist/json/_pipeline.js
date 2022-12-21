"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeline = void 0;
const pipeline = async (props) => {
    const { opertaionType, mapping } = props;
    if (opertaionType === "referenceToString") {
        const { spaceID, environment, operations } = mapping;
        console.log(spaceID, environment, operations);
    }
};
exports.pipeline = pipeline;
