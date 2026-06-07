import type { Request, Response } from "express";
import { PropsDbService } from "./props.db.service";

const service = new PropsDbService();

export async function getDashboard(_request: Request, response: Response) {
  response.json(await service.getDashboard());
}

export async function getThemes(_request: Request, response: Response) {
  response.json(await service.getThemes());
}

export async function getThemesWithItems(_request: Request, response: Response) {
  response.json(await service.getThemesWithItems());
}

export async function getItems(request: Request, response: Response) {
  const themeId = request.query.themeId ? Number(request.query.themeId) : undefined;
  response.json(await service.getItemsByTheme(themeId));
}

export async function addItem(request: Request, response: Response) {
  const data = request.body;
  if (!data.theme_id || !data.name) {
    return response.status(400).json({ error: "theme_id and name are required" });
  }
  const result = await service.addItem({
    theme_id: data.theme_id,
    name: data.name,
    specification: data.specification || "",
    unit: data.unit || "个",
    stock_quantity: data.stock_quantity || 0,
    warning_threshold: data.warning_threshold || 5,
    last_check_date: data.last_check_date || null,
    next_check_date: data.next_check_date || null,
    inspection_status: data.inspection_status || "normal",
    remark: data.remark || "",
  });
  response.json(result);
}

export async function updateItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const data = request.body;
  const result = await service.updateItem(id, data);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export async function deleteItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const success = await service.deleteItem(id);
  if (!success) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json({ success: true });
}

export async function restockItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { quantity } = request.body;
  if (!quantity || quantity <= 0) {
    return response.status(400).json({ error: "Invalid quantity" });
  }
  const result = await service.restockItem(id, quantity);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export async function updateInspection(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { last_check_date, next_check_date } = request.body;
  if (!last_check_date || !next_check_date) {
    return response.status(400).json({ error: "last_check_date and next_check_date are required" });
  }
  const result = await service.updateInspection(id, last_check_date, next_check_date);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export async function addConsumption(request: Request, response: Response) {
  const data = request.body;
  if (!data.prop_item_id || !data.quantity || !data.reason) {
    return response.status(400).json({ error: "prop_item_id, quantity, and reason are required" });
  }
  const result = await service.addConsumption({
    prop_item_id: data.prop_item_id,
    consumption_date: data.consumption_date || new Date().toISOString().split("T")[0],
    quantity: data.quantity,
    reason: data.reason,
    operator: data.operator || "",
    remark: data.remark || "",
  });
  if (!result) {
    return response.status(400).json({ error: "Insufficient stock or item not found" });
  }
  response.json(result);
}

export async function getConsumptions(request: Request, response: Response) {
  const propItemId = request.query.propItemId ? Number(request.query.propItemId) : undefined;
  response.json(await service.getConsumptions(propItemId));
}

export async function addMaintenance(request: Request, response: Response) {
  const data = request.body;
  if (!data.prop_item_id || !data.type) {
    return response.status(400).json({ error: "prop_item_id and type are required" });
  }
  const result = await service.addMaintenance({
    prop_item_id: data.prop_item_id,
    maintenance_date: data.maintenance_date || new Date().toISOString().split("T")[0],
    type: data.type,
    description: data.description || "",
    cost: data.cost || 0,
    operator: data.operator || "",
    status: data.status || "completed",
    remark: data.remark || "",
  });
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export async function updateMaintenance(request: Request, response: Response) {
  const id = Number(request.params.id);
  const data = request.body;
  const result = await service.updateMaintenance(id, data);
  if (!result) {
    return response.status(404).json({ error: "Maintenance record not found" });
  }
  response.json(result);
}

export async function getMaintenances(request: Request, response: Response) {
  const propItemId = request.query.propItemId ? Number(request.query.propItemId) : undefined;
  response.json(await service.getMaintenances(propItemId));
}
