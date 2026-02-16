const plateColliders = item._props.armorPlateColliders;
const armorMaterial = item._props.ArmorMaterial;

// Skip Aramid completely
if (armorMaterial === "Aramid")
{
    continue;
}

if (Array.isArray(plateColliders) && plateColliders.length > 0)
{
    const hasChestOrBack = plateColliders.some(x =>
        typeof x === "string" &&
        (x.toLowerCase().includes("chest") ||
         x.toLowerCase().includes("back"))
    );

    if (hasChestOrBack)
    {
        delete item._props.armorPlateColliders;
        item._props.armorColliders = newColliders;

        modifiedCount++;

        if (config.enableLogging)
        {
            const localizedName = locale?.[`${itemId} Name`] ?? "UNKNOWN";

            logger.info(
                `[${this.modName || "ArmorColliderRewrite"}] Modified -> ID: ${itemId} | Name: ${localizedName}`
            );
        }
    }
}
