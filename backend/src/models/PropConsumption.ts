import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from "sequelize";

interface PropConsumptionModel {
  id: number;
  prop_item_id: number;
  consumption_date: string;
  quantity: number;
  reason: string;
  operator: string | null;
  remark: string | null;
  created_at: Date;
  prop_name?: string;
  theme_name?: string;
}

type PropConsumptionCreationAttributes = Optional<
  PropConsumptionModel,
  "id" | "created_at" | "prop_name" | "theme_name"
>;

export class PropConsumption extends Model<PropConsumptionModel, PropConsumptionCreationAttributes> {
  public id!: number;
  public prop_item_id!: number;
  public consumption_date!: string;
  public quantity!: number;
  public reason!: string;
  public operator!: string | null;
  public remark!: string | null;
  public created_at!: Date;
  public prop_name!: string;
  public theme_name!: string;
}

export function initPropConsumption(sequelize: Sequelize) {
  PropConsumption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prop_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      consumption_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      operator: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
      tableName: "prop_consumptions",
      timestamps: false,
      createdAt: "created_at",
    }
  );
}
