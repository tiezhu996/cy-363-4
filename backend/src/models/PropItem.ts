import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from "sequelize";

interface PropItemModel {
  id: number;
  theme_id: number;
  name: string;
  specification: string | null;
  unit: string;
  stock_quantity: number;
  warning_threshold: number;
  last_check_date: string | null;
  next_check_date: string | null;
  inspection_status: "normal" | "warning" | "maintenance";
  remark: string | null;
  created_at: Date;
  updated_at: Date;
  is_low_stock?: boolean;
  theme_name?: string;
}

type PropItemCreationAttributes = Optional<
  PropItemModel,
  "id" | "created_at" | "updated_at" | "is_low_stock" | "theme_name"
>;

export class PropItem extends Model<PropItemModel, PropItemCreationAttributes> {
  public id!: number;
  public theme_id!: number;
  public name!: string;
  public specification!: string | null;
  public unit!: string;
  public stock_quantity!: number;
  public warning_threshold!: number;
  public last_check_date!: string | null;
  public next_check_date!: string | null;
  public inspection_status!: "normal" | "warning" | "maintenance";
  public remark!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
  public is_low_stock!: boolean;
  public theme_name!: string;
}

export function initPropItem(sequelize: Sequelize) {
  PropItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      theme_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      specification: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      unit: {
        type: DataTypes.STRING(20),
        defaultValue: "个",
      },
      stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      warning_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      last_check_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      next_check_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      inspection_status: {
        type: DataTypes.STRING(20),
        defaultValue: "normal",
      },
      remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      is_low_stock: {
        type: DataTypes.VIRTUAL,
        get(): boolean {
          return this.stock_quantity <= this.warning_threshold;
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
      tableName: "prop_items",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
}
