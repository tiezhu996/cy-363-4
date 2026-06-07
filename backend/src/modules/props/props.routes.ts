import { Router } from "express";
import {
  getDashboard,
  getThemes,
  getThemesWithItems,
  getItems,
  addItem,
  updateItem,
  deleteItem,
  restockItem,
  updateInspection,
  addConsumption,
  getConsumptions,
  addMaintenance,
  updateMaintenance,
  getMaintenances,
} from "./props.controller";

export const propsRouter = Router();

propsRouter.get("/props/dashboard", getDashboard);
propsRouter.get("/props/themes", getThemes);
propsRouter.get("/props/themes/items", getThemesWithItems);
propsRouter.get("/props/items", getItems);
propsRouter.post("/props/items", addItem);
propsRouter.put("/props/items/:id", updateItem);
propsRouter.delete("/props/items/:id", deleteItem);
propsRouter.post("/props/items/:id/restock", restockItem);
propsRouter.post("/props/items/:id/inspection", updateInspection);

propsRouter.get("/props/consumptions", getConsumptions);
propsRouter.post("/props/consumptions", addConsumption);

propsRouter.get("/props/maintenances", getMaintenances);
propsRouter.post("/props/maintenances", addMaintenance);
propsRouter.put("/props/maintenances/:id", updateMaintenance);
