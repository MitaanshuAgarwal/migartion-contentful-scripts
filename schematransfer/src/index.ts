import {
  checkLinkEntryExist,
  createContentType,
  findDependencies,
  getSchema,
  preprocess,
  renameRefrences,
} from "./helpers";
import changes from "./json/changes.json";

export let contentTypesChecked: string[];

const init = async () => {
  const { spaceID, from, to, rename } = changes as any;
  contentTypesChecked = [];

  let { editorInterface, ...contentTypeSchema } = await getSchema({
    spaceID,
    environment: from.environment,
    content_type: from.content_type,
  });

  const schemasToBeCreated = await checkLinkEntryExist({
    fields: contentTypeSchema.fields,
  });

  if (schemasToBeCreated.length > 0) {
    await findDependencies(schemasToBeCreated);
  }

  console.log(`\n\n Dependencies found for ${from.content_type}\n`);
  console.log(contentTypesChecked);

  contentTypesChecked = contentTypesChecked.reverse();
  for (let i = 0; i < contentTypesChecked.length; i++) {
    const contentType = contentTypesChecked[i];
    await preprocess({ contentType });
  }

  console.log(
    `---> Creating content type ${to.content_type} in env ${to.environment}`
  );
  //renaming all the changed names inside schema before creating the final content type
  contentTypeSchema.fields = renameRefrences({
    fields: contentTypeSchema.fields,
  });

  await createContentType({
    spaceID,
    environment: to.environment,
    id: to.content_type,
    schema: { ...contentTypeSchema, name: to.name },
    editorInterface,
  });
  console.log("done...");
};

init();
