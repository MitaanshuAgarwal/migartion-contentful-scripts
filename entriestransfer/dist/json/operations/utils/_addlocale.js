"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addlocale = void 0;
const addlocale = (props) => {
    const { locale, entry } = props;
    let updatedEntry = {};
    Object.keys(entry).forEach((i) => {
        updatedEntry[i] = {
            [locale]: entry[i],
        };
    });
    return updatedEntry;
};
exports.addlocale = addlocale;
