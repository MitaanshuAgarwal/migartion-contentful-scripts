"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnvironment = void 0;
const delete_1 = require("./delete");
const init_1 = require("./init");
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const createEnvironment = async (props) => {
    const { spaceID, id, name, cloneEnvID } = props;
    try {
        const space = await init_1.client.getSpace(spaceID);
        const environment = await space.createEnvironmentWithId(id, { name }, cloneEnvID);
        let contentTypes;
        let isCreated = false;
        while (!isCreated) {
            console.log(`Environemt ${name} creating...`);
            try {
                contentTypes = await (await environment.getContentTypes()).items;
                if (contentTypes)
                    isCreated = true;
            }
            catch (error) {
                isCreated = false;
            }
            finally {
                await delay(5000);
            }
        }
        if (contentTypes)
            console.log(`Environemt ${name} created`);
        console.log(`Environemt ${name} will be emptied....`);
        for (let idx = 0; idx < contentTypes.length; idx++) {
            const contentType = contentTypes[idx];
            const contentTypeID = contentType.sys.id;
            await (0, delete_1.deleteContentType)({
                spaceID,
                environment: id,
                content_type: contentTypeID,
            });
        }
        console.log(`Environemt ${name} emptied`);
        return true;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createEnvironment = createEnvironment;
