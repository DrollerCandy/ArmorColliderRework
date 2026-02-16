import { DependencyContainer } from "tsyringe";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import * as fs from "fs";
import * as path from "path";

class ArmorPlateColliderRewrite
{
    private modName = "ArmorPlateColliderRewrite";

    public postDBLoad(container: DependencyContainer): void
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables: IDatabaseTables = databaseServer.getTables();

        const configPath = path.join(__dirname, "..", "config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

        const locale = tables.locales.global["en"];

        let modifiedCount = 0;

        const newPlateColliders: string[] = [
            "Pelvis",
            "RibcageLow",
            "RibcageUp",
            "RightSideChestUp",
            "LeftSideChestUp",
            "SpineTop",
            "SpineDown",
            "PelvisBack",
            "RightSideChestDown",
            "LeftSideChestDown"
        ];

        for (const itemId in tables.templates.items)
        {
            const item = tables.templates.items[itemId];
            if (!item || !item._props)
                continue;

            const plateColliders = item._props.armorPlateColliders;
            const armorMaterial = item._props.ArmorMaterial;

            // Skip Aramid
            if (armorMaterial === "Aramid")
                continue;

            if (Array.isArray(plateColliders) && plateColliders.length > 0)
            {
                const hasChestOrBack = plateColliders.some((x: string) =>
                    typeof x === "string" &&
                    (x.toLowerCase().includes("chest") ||
                     x.toLowerCase().includes("back"))
                );

                if (hasChestOrBack)
                {
                    item._props.armorPlateColliders = newPlateColliders;
                    modifiedCount++;

                    if (config.enableLogging)
                    {
                        const localizedName = locale?.[`${itemId} Name`] ?? "UNKNOWN";

                        logger.info(
                            `[${this.modName}] Modified -> ID: ${itemId} | Name: ${localizedName}`
                        );
                    }
                }
            }
        }

        if (config.enableLogging)
        {
            logger.info(`[${this.modName}] Total modified: ${modifiedCount}`);
        }
    }
}

module.exports = { mod: new ArmorPlateColliderRewrite() };
