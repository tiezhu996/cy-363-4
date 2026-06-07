import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from "sequelize";

interface PropThemeModel {
  id: number;
  name: string;
  description: string | null;
  room_count: number;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

type PropThemeCreationAttributes = Optional<PropThemeModel, "id" | "created_at" | "updated_at">;

export class PropTheme extends Model<PropThemeModel, PropThemeCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public room_count!: number;
  public is_active!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

export function initPropTheme(sequelize: Sequelize) {
  PropTheme.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      room_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "prop_themes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
}
