"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transformations_1 = __importDefault(require("./transformations"));
const typeCasting_1 = __importDefault(require("./typeCasting"));
const applyOperations = async (props) => {
    const { entryValue, name, value, mapping } = props;
    let updatedValue = entryValue;
    if (name === "typeCasting") {
        updatedValue = (0, typeCasting_1.default)({
            operation: value,
            entryValue: entryValue,
        });
    }
    else if (name === "transformation") {
        updatedValue = await (0, transformations_1.default)({
            operation: value,
            entryValue: entryValue,
            mapping,
        });
    }
    return updatedValue;
};
exports.default = applyOperations;
