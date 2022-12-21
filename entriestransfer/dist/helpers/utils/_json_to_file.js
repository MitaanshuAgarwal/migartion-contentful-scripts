"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJSON = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const writeJSON = async (props) => {
    const { outputFileName, jsonContent } = props;
    try {
        await promises_1.default.writeFile(outputFileName, jsonContent, "utf-8");
    }
    catch (error) {
        console.log(error);
    }
};
exports.writeJSON = writeJSON;
