import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { PropItem } from "./PropItem";

interface PropMaintenanceModel {
  id: number;
  prop_item_id: number;
  maintenance_date: string;
  type: "repair" | "inspection" | "replacement";
  description: string | null;
  cost: number;
  operator: string | null;
  status: "pending" | "in_progress" | "completed";
  remark: string | null;
  created_at: Date;
  prop_name?: string;
  theme_name?: string;
}

type PropMaintenanceCreationAttributes = Optional<
  PropMaintenanceModel,
  "id" | "created_at" | "prop_name" | "theme_name"
>;

export class PropMaintenance extends Model<PropMaintenanceModel, PropMaintenanceCreationAttributes> {
  public id!: number;
  public prop_item_id!: number;
  public maintenance_date!: string;
  public type!: "repair" | "inspection" | "replacement";
  public description!: string | null;
  public cost!: number;
  public operator!: string | null;
  public status!: "pending" | "in_progress" | "completed";
  public remark!: string | null;
  public created_at!: Date;
  public prop_name!: string;
  public theme_name!: string;
}

PropMaintenance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    prop_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PropItem,
        key: "id",
      },
    },
    maintenance_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    operator: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "completed",
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    prop_name: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return this.getDataValue("prop_name") || "";
      },
    },
    theme_name: {
      type: DataTypes.VIRTUAL,
      get(): string {
        return this.getDataValue("theme_name") || "";
      },
    },
  },
  {
    sequelize,
    tableName: "prop_maintenances",
    timestamps: false,
    createdAt: "created_at",
  }
);

PropMaintenance.belongsTo(PropItem, { foreignKey: "prop_item_id", as: "item" });
PropItem.hasMany(PropMaintenance, { foreignKey: "prop_item_id", as: "maintenances" });
