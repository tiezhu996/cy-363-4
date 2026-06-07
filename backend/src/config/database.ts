import { Sequelize } from "sequelize";
import { env } from "./env";
import { PropTheme } from "../models/PropTheme";
import { PropItem } from "../models/PropItem";
import { PropConsumption } from "../models/PropConsumption";
import { PropMaintenance } from "../models/PropMaintenance";
import { localPropThemes, localPropItems, localPropConsumptions, localPropMaintenances } from "../modules/props/props.data";

export const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
  host: env.dbHost,
  port: env.dbPort,
  dialect: "mysql",
  logging: false,
  timezone: "+08:00",
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

export async function initDatabase(forceSync: boolean = false) {
  await connectDatabase();

  await sequelize.sync({ force: forceSync, alter: !forceSync });
  console.log("Database models synchronized.");

  if (forceSync) {
    await seedDatabase();
  }
}

async function seedDatabase() {
  console.log("Seeding initial data...");

  for (const theme of localPropThemes) {
    await PropTheme.create({
      ...theme,
      created_at: new Date(theme.created_at),
      updated_at: new Date(theme.updated_at),
    } as any);
  }

  for (const item of localPropItems) {
    await PropItem.create({
      ...item,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at),
    } as any);
  }

  for (const consumption of localPropConsumptions) {
    await PropConsumption.create({
      ...consumption,
      created_at: new Date(consumption.created_at),
    } as any);
  }

  for (const maintenance of localPropMaintenances) {
    await PropMaintenance.create({
      ...maintenance,
      created_at: new Date(maintenance.created_at),
    } as any);
  }

  console.log("Database seeding completed.");
}
