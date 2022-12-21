"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _transformation_1 = __importDefault(require("./_transformation"));
const _type_casting_1 = __importDefault(require("./_type_casting"));
const applyOperations = async (props) => {
    const { entryValue, name, value, mapping } = props;
    let updatedValue = entryValue;
    if (name === "typeCasting") {
        updatedValue = (0, _type_casting_1.default)({
            operation: value,
            entryValue: entryValue,
        });
    }
    else if (name === "transformation") {
        updatedValue = await (0, _transformation_1.default)({
            operation: value,
            entryValue: entryValue,
            mapping,
        });
    }
    return updatedValue;
};
exports.default = applyOperations;
