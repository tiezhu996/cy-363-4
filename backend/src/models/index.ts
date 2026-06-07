import type { Sequelize } from "sequelize";
import { PropTheme, initPropTheme } from "./PropTheme";
import { PropItem, initPropItem } from "./PropItem";
import { PropConsumption, initPropConsumption } from "./PropConsumption";
import { PropMaintenance, initPropMaintenance } from "./PropMaintenance";

export { PropTheme, PropItem, PropConsumption, PropMaintenance };

let initialized = false;

export function initModels(sequelize: Sequelize) {
  if (initialized) return;

  initPropTheme(sequelize);
  initPropItem(sequelize);
  initPropConsumption(sequelize);
  initPropMaintenance(sequelize);

  PropItem.belongsTo(PropTheme, { foreignKey: "theme_id", as: "theme" });
  PropTheme.hasMany(PropItem, { foreignKey: "theme_id", as: "items" });

  PropConsumption.belongsTo(PropItem, { foreignKey: "prop_item_id", as: "item" });
  PropItem.hasMany(PropConsumption, { foreignKey: "prop_item_id", as: "consumptions" });

  PropMaintenance.belongsTo(PropItem, { foreignKey: "prop_item_id", as: "item" });
  PropItem.hasMany(PropMaintenance, { foreignKey: "prop_item_id", as: "maintenances" });

  initialized = true;
}
