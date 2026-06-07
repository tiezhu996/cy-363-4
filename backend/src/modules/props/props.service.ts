import { localPropThemes, localPropItems, localPropConsumptions, localPropMaintenances } from "./props.data";
import type {
  PropTheme,
  PropItem,
  PropConsumption,
  PropMaintenance,
  PropDashboardResponse,
  PropDashboardStats,
  PropThemeWithItems,
} from "./props.models";

export class PropsService {
  private themes: PropTheme[] = [...localPropThemes];
  private items: PropItem[] = [...localPropItems];
  private consumptions: PropConsumption[] = [...localPropConsumptions];
  private maintenances: PropMaintenance[] = [...localPropMaintenances];
  private nextItemId = 11;
  private nextConsumptionId = 6;
  private nextMaintenanceId = 5;

  getThemes(): PropTheme[] {
    return this.themes.filter((t) => t.is_active === 1);
  }

  getItemsByTheme(themeId?: number): PropItem[] {
    let result = this.items.map((item) => ({
      ...item,
      is_low_stock: item.stock_quantity <= item.warning_threshold,
      theme_name: this.themes.find((t) => t.id === item.theme_id)?.name,
    }));

    if (themeId) {
      result = result.filter((item) => item.theme_id === themeId);
    }

    return result;
  }

  getThemesWithItems(): PropThemeWithItems[] {
    return this.themes
      .filter((t) => t.is_active === 1)
      .map((theme) => ({
        ...theme,
        items: this.items
          .filter((item) => item.theme_id === theme.id)
          .map((item) => ({
            ...item,
            is_low_stock: item.stock_quantity <= item.warning_threshold,
            theme_name: theme.name,
          })),
      }));
  }

  addItem(item: Omit<PropItem, "id" | "created_at" | "updated_at" | "is_low_stock" | "theme_name">): PropItem {
    const newItem: PropItem = {
      ...item,
      id: this.nextItemId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_low_stock: item.stock_quantity <= item.warning_threshold,
      theme_name: this.themes.find((t) => t.id === item.theme_id)?.name,
    };
    this.items.push(newItem);
    return newItem;
  }

  updateItem(id: number, updates: Partial<PropItem>): PropItem | null {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated = {
      ...this.items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    updated.is_low_stock = updated.stock_quantity <= updated.warning_threshold;
    updated.theme_name = this.themes.find((t) => t.id === updated.theme_id)?.name;

    this.items[index] = updated;
    return updated;
  }

  deleteItem(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  addConsumption(
    data: Omit<PropConsumption, "id" | "created_at" | "prop_name" | "theme_name">
  ): PropConsumption | null {
    const item = this.items.find((i) => i.id === data.prop_item_id);
    if (!item) return null;

    if (item.stock_quantity < data.quantity) {
      return null;
    }

    item.stock_quantity -= data.quantity;
    item.updated_at = new Date().toISOString();
    item.is_low_stock = item.stock_quantity <= item.warning_threshold;

    const newConsumption: PropConsumption = {
      ...data,
      id: this.nextConsumptionId++,
      created_at: new Date().toISOString(),
      prop_name: item.name,
      theme_name: this.themes.find((t) => t.id === item.theme_id)?.name,
    };
    this.consumptions.push(newConsumption);
    return newConsumption;
  }

  getConsumptions(propItemId?: number): PropConsumption[] {
    let result = this.consumptions.map((c) => ({
      ...c,
      prop_name: this.items.find((i) => i.id === c.prop_item_id)?.name,
      theme_name: this.themes.find((t) => t.id === this.items.find((i) => i.id === c.prop_item_id)?.theme_id)?.name,
    }));

    if (propItemId) {
      result = result.filter((c) => c.prop_item_id === propItemId);
    }

    return result.sort((a, b) => new Date(b.consumption_date).getTime() - new Date(a.consumption_date).getTime());
  }

  addMaintenance(
    data: Omit<PropMaintenance, "id" | "created_at" | "prop_name" | "theme_name">
  ): PropMaintenance | null {
    const item = this.items.find((i) => i.id === data.prop_item_id);
    if (!item) return null;

    if (data.status === "in_progress" || data.status === "pending") {
      item.inspection_status = "maintenance";
      item.updated_at = new Date().toISOString();
    }

    const newMaintenance: PropMaintenance = {
      ...data,
      id: this.nextMaintenanceId++,
      created_at: new Date().toISOString(),
      prop_name: item.name,
      theme_name: this.themes.find((t) => t.id === item.theme_id)?.name,
    };
    this.maintenances.push(newMaintenance);
    return newMaintenance;
  }

  updateMaintenance(id: number, updates: Partial<PropMaintenance>): PropMaintenance | null {
    const index = this.maintenances.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated = {
      ...this.maintenances[index],
      ...updates,
    };

    if (updates.status === "completed") {
      const item = this.items.find((i) => i.id === updated.prop_item_id);
      if (item) {
        const hasActiveMaintenance = this.maintenances.some(
          (m) => m.id !== id && m.prop_item_id === item.id && m.status !== "completed"
        );
        if (!hasActiveMaintenance) {
          item.inspection_status = item.stock_quantity <= item.warning_threshold ? "warning" : "normal";
        }
      }
    }

    this.maintenances[index] = updated;
    return updated;
  }

  getMaintenances(propItemId?: number): PropMaintenance[] {
    let result = this.maintenances.map((m) => ({
      ...m,
      prop_name: this.items.find((i) => i.id === m.prop_item_id)?.name,
      theme_name: this.themes.find((t) => t.id === this.items.find((i) => i.id === m.prop_item_id)?.theme_id)?.name,
    }));

    if (propItemId) {
      result = result.filter((m) => m.prop_item_id === propItemId);
    }

    return result.sort(
      (a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime()
    );
  }

  getDashboard(): PropDashboardResponse {
    const allItems = this.items.map((item) => ({
      ...item,
      is_low_stock: item.stock_quantity <= item.warning_threshold,
      theme_name: this.themes.find((t) => t.id === item.theme_id)?.name,
    }));

    const lowStockItems = allItems.filter((item) => item.is_low_stock);

    const now = new Date();
    const inspectionOverdue = allItems.filter((item) => {
      if (!item.next_check_date) return false;
      return new Date(item.next_check_date) < now;
    });

    const recentMaintenances = this.maintenances
      .map((m) => ({
        ...m,
        prop_name: this.items.find((i) => i.id === m.prop_item_id)?.name,
        theme_name: this.themes.find((t) => t.id === this.items.find((i) => i.id === m.prop_item_id)?.theme_id)?.name,
      }))
      .sort((a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime())
      .slice(0, 5);

    const thisMonth = new Date();
    const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const thisMonthConsumptions = this.consumptions.filter(
      (c) => new Date(c.consumption_date) >= thisMonthStart
    );

    const thisMonthMaintenances = this.maintenances.filter(
      (m) => new Date(m.maintenance_date) >= thisMonthStart
    );

    const stats: PropDashboardStats = {
      total_items: allItems.length,
      low_stock_count: lowStockItems.length,
      pending_maintenance: this.maintenances.filter((m) => m.status !== "completed").length,
      maintenance_count: this.maintenances.length,
      this_month_consumption: thisMonthConsumptions.reduce((sum, c) => sum + c.quantity, 0),
      this_month_cost: thisMonthMaintenances.reduce((sum, m) => sum + m.cost, 0),
    };

    return {
      stats,
      low_stock_items: lowStockItems,
      recent_maintenances: recentMaintenances,
      inspection_overdue: inspectionOverdue,
    };
  }

  restockItem(id: number, quantity: number): PropItem | null {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;

    item.stock_quantity += quantity;
    item.updated_at = new Date().toISOString();
    item.is_low_stock = item.stock_quantity <= item.warning_threshold;
    if (item.inspection_status === "warning" && !item.is_low_stock) {
      item.inspection_status = "normal";
    }
    item.theme_name = this.themes.find((t) => t.id === item.theme_id)?.name;

    return { ...item };
  }

  updateInspection(id: number, lastCheckDate: string, nextCheckDate: string): PropItem | null {
    const item = this.items.find((i) => i.id === id);
    if (!item) return null;

    item.last_check_date = lastCheckDate;
    item.next_check_date = nextCheckDate;
    item.updated_at = new Date().toISOString();
    item.theme_name = this.themes.find((t) => t.id === item.theme_id)?.name;

    return { ...item };
  }
}
