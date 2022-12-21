import { getSpace } from "./_get_entries";

const getAssets = async (env: string) => {
  const space = await getSpace({
    spaceID: "45lly9oa9o4c",
    environment: env,
  });

  const { items } = await space.getAssets();
  const fields = items
    .map((i) => i.fields)
    .filter((i) => i.title?.["en-AU"] !== "");

  return fields;
};

(async function () {
  const devAssets = await getAssets("dev");
  const destinationAssets = await getAssets("sandbox_testing");

  const space = await getSpace({
    spaceID: "45lly9oa9o4c",
    environment: "sandbox_testing",
  });

  const _diff = devAssets.filter(
    (i) =>
      !destinationAssets.find((j) => j.title?.["en-AU"] === i.title?.["en-AU"])
  );

  for (let assetID = 0; assetID < _diff.length; assetID++) {
    const asset = _diff[assetID];

    await space.createAsset({
      fields: asset,
    });
    console.log(
      `${asset.title?.["en-AU"]} added to sandbox_testing successfully!`
    );
  }
})();
