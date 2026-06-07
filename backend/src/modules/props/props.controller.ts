import type { Request, Response } from "express";
import { PropsService } from "./props.service";

const service = new PropsService();

export function getDashboard(_request: Request, response: Response) {
  response.json(service.getDashboard());
}

export function getThemes(_request: Request, response: Response) {
  response.json(service.getThemes());
}

export function getThemesWithItems(_request: Request, response: Response) {
  response.json(service.getThemesWithItems());
}

export function getItems(request: Request, response: Response) {
  const themeId = request.query.themeId ? Number(request.query.themeId) : undefined;
  response.json(service.getItemsByTheme(themeId));
}

export function addItem(request: Request, response: Response) {
  const data = request.body;
  if (!data.theme_id || !data.name) {
    return response.status(400).json({ error: "theme_id and name are required" });
  }
  const result = service.addItem({
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

export function updateItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const data = request.body;
  const result = service.updateItem(id, data);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export function deleteItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const success = service.deleteItem(id);
  if (!success) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json({ success: true });
}

export function restockItem(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { quantity } = request.body;
  if (!quantity || quantity <= 0) {
    return response.status(400).json({ error: "Invalid quantity" });
  }
  const result = service.restockItem(id, quantity);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export function updateInspection(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { last_check_date, next_check_date } = request.body;
  if (!last_check_date || !next_check_date) {
    return response.status(400).json({ error: "last_check_date and next_check_date are required" });
  }
  const result = service.updateInspection(id, last_check_date, next_check_date);
  if (!result) {
    return response.status(404).json({ error: "Item not found" });
  }
  response.json(result);
}

export function addConsumption(request: Request, response: Response) {
  const data = request.body;
  if (!data.prop_item_id || !data.quantity || !data.reason) {
    return response.status(400).json({ error: "prop_item_id, quantity, and reason are required" });
  }
  const result = service.addConsumption({
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

export function getConsumptions(request: Request, response: Response) {
  const propItemId = request.query.propItemId ? Number(request.query.propItemId) : undefined;
  response.json(service.getConsumptions(propItemId));
}

export function addMaintenance(request: Request, response: Response) {
  const data = request.body;
  if (!data.prop_item_id || !data.type) {
    return response.status(400).json({ error: "prop_item_id and type are required" });
  }
  const result = service.addMaintenance({
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

export function updateMaintenance(request: Request, response: Response) {
  const id = Number(request.params.id);
  const data = request.body;
  const result = service.updateMaintenance(id, data);
  if (!result) {
    return response.status(404).json({ error: "Maintenance record not found" });
  }
  response.json(result);
}

export function getMaintenances(request: Request, response: Response) {
  const propItemId = request.query.propItemId ? Number(request.query.propItemId) : undefined;
  response.json(service.getMaintenances(propItemId));
}
