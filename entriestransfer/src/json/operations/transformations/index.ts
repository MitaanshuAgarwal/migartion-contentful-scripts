import {
  toRichText,
  dateToEupropeanFormat,
  refrenceMapping,
  refrenceToJson,
  refrenceToSTring,
  valueMapping,
} from "./_utils";
import { arrayTransformation } from "./_array_transformation";

interface transformationProps {
  operation:
    | "textToRichText"
    | "referenceToJson"
    | "referenceToString"
    | "referenceMapping"
    | "dateStringToEuropeanDateFormat"
    | "ArrayTransformation"
    | "valueMapping";
  entryValue: any;
  mapping?: any;
}

const transformation = async (props: transformationProps) => {
  const { operation, entryValue, mapping } = props;
  if (operation === "textToRichText") return toRichText(entryValue);
  else if (operation === "referenceToJson")
    return await refrenceToJson(entryValue, mapping);
  else if (operation === "referenceMapping") {
    let newEntryValue;
    if (Array.isArray(entryValue)) {
      newEntryValue = [];
      for (let refrenceID = 0; refrenceID < entryValue.length; refrenceID++) {
        const reference = await refrenceMapping(
          entryValue[refrenceID],
          mapping
        );
        newEntryValue.push(reference);
      }
      newEntryValue = newEntryValue.filter((i) => i);
    } else {
      newEntryValue = await refrenceMapping(entryValue, mapping);
    }
    return newEntryValue;
  } else if (operation === "referenceToString") {
    let newEntryValue;
    if (Array.isArray(entryValue)) {
      newEntryValue = await Promise.all(
        entryValue.map(async (i) => await refrenceToSTring(i, mapping))
      );
      newEntryValue = newEntryValue.filter((i) => i);
    } else {
      newEntryValue = await refrenceToSTring(entryValue, mapping);
    }
    return newEntryValue;
  } else if (operation === "ArrayTransformation") {
    return arrayTransformation({
      value: entryValue,
      mapping,
    });
  } else if (operation === "valueMapping") {
    return valueMapping({
      value: entryValue,
      mapping: mapping,
    });
  } else if (operation === "dateStringToEuropeanDateFormat") {
    return dateToEupropeanFormat({
      value: entryValue,
    });
  }
};

export default transformation;
