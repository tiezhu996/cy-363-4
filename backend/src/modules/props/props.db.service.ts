import { Op, QueryTypes } from "sequelize";
import { PropTheme } from "../../models/PropTheme";
import { PropItem } from "../../models/PropItem";
import { PropConsumption } from "../../models/PropConsumption";
import { PropMaintenance } from "../../models/PropMaintenance";
import type {
  PropTheme as PropThemeType,
  PropItem as PropItemType,
  PropConsumption as PropConsumptionType,
  PropMaintenance as PropMaintenanceType,
  PropDashboardResponse,
  PropDashboardStats,
  PropThemeWithItems,
} from "./props.models";
import { PropsService as MemoryPropsService } from "./props.service";

export class PropsDbService {
  private memoryService: MemoryPropsService | null = null;
  private useDatabase: boolean = true;

  constructor() {
    this.checkDatabaseConnection();
  }

  private async checkDatabaseConnection(): Promise<void> {
    try {
      await PropTheme.count();
      this.useDatabase = true;
      console.log("[PropsDbService] Using database persistence");
    } catch (error) {
      console.warn("[PropsDbService] Database not available, falling back to memory storage");
      this.useDatabase = false;
      this.memoryService = new MemoryPropsService();
    }
  }

  private async ensureDatabase(): Promise<boolean> {
    if (!this.useDatabase) {
      await this.checkDatabaseConnection();
    }
    return this.useDatabase;
  }

  private formatItem(item: PropItem, themeName?: string): PropItemType {
    const plain = item.get({ plain: true });
    return {
      ...plain,
      is_low_stock: plain.stock_quantity <= plain.warning_threshold,
      theme_name: themeName || plain.theme_name || "",
      created_at: plain.created_at ? new Date(plain.created_at).toISOString() : new Date().toISOString(),
      updated_at: plain.updated_at ? new Date(plain.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  private formatConsumption(
    c: PropConsumption,
    propName?: string,
    themeName?: string
  ): PropConsumptionType {
    const plain = c.get({ plain: true });
    return {
      ...plain,
      prop_name: propName || plain.prop_name || "",
      theme_name: themeName || plain.theme_name || "",
      created_at: plain.created_at ? new Date(plain.created_at).toISOString() : new Date().toISOString(),
    };
  }

  private formatMaintenance(
    m: PropMaintenance,
    propName?: string,
    themeName?: string
  ): PropMaintenanceType {
    const plain = m.get({ plain: true });
    return {
      ...plain,
      prop_name: propName || plain.prop_name || "",
      theme_name: themeName || plain.theme_name || "",
      created_at: plain.created_at ? new Date(plain.created_at).toISOString() : new Date().toISOString(),
    };
  }

  async getThemes(): Promise<PropThemeType[]> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getThemes();
    }
    const themes = await PropTheme.findAll({ where: { is_active: 1 } });
    return themes.map((t) => {
      const plain = t.get({ plain: true });
      return {
        ...plain,
        created_at: plain.created_at ? new Date(plain.created_at).toISOString() : new Date().toISOString(),
        updated_at: plain.updated_at ? new Date(plain.updated_at).toISOString() : new Date().toISOString(),
      };
    });
  }

  async getItemsByTheme(themeId?: number): Promise<PropItemType[]> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getItemsByTheme(themeId);
    }
    const where: any = {};
    if (themeId) {
      where.theme_id = themeId;
    }
    const items = await PropItem.findAll({
      where,
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    return items.map((item) => {
      const theme = item.get("theme") as PropTheme | undefined;
      return this.formatItem(item, theme?.name);
    });
  }

  async getThemesWithItems(): Promise<PropThemeWithItems[]> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getThemesWithItems();
    }
    const themes = await PropTheme.findAll({
      where: { is_active: 1 },
      include: [
        {
          model: PropItem,
          as: "items",
          include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
        },
      ],
    });
    return themes.map((theme) => {
      const plainTheme = theme.get({ plain: true });
      const items = theme.get("items") as PropItem[];
      return {
        ...plainTheme,
        created_at: plainTheme.created_at ? new Date(plainTheme.created_at).toISOString() : new Date().toISOString(),
        updated_at: plainTheme.updated_at ? new Date(plainTheme.updated_at).toISOString() : new Date().toISOString(),
        items: items.map((item) => {
          const themeRel = item.get("theme") as PropTheme | undefined;
          return this.formatItem(item, themeRel?.name || plainTheme.name);
        }),
      };
    });
  }

  async addItem(
    item: Omit<PropItemType, "id" | "created_at" | "updated_at" | "is_low_stock" | "theme_name">
  ): Promise<PropItemType> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.addItem(item);
    }
    const newItem = await PropItem.create(item as any);
    const theme = await PropTheme.findByPk(item.theme_id);
    return this.formatItem(newItem, theme?.name);
  }

  async updateItem(id: number, updates: Partial<PropItemType>): Promise<PropItemType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.updateItem(id, updates);
    }
    const item = await PropItem.findByPk(id, {
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    if (!item) return null;

    const { created_at, updated_at, ...safeUpdates } = updates as any;
    await item.update(safeUpdates);
    const theme = item.get("theme") as PropTheme | undefined;
    return this.formatItem(item, theme?.name);
  }

  async deleteItem(id: number): Promise<boolean> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.deleteItem(id);
    }
    const result = await PropItem.destroy({ where: { id } });
    return result > 0;
  }

  async addConsumption(
    data: Omit<PropConsumptionType, "id" | "created_at" | "prop_name" | "theme_name">
  ): Promise<PropConsumptionType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.addConsumption(data);
    }
    const item = await PropItem.findByPk(data.prop_item_id, {
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    if (!item) return null;

    if (item.stock_quantity < data.quantity) {
      return null;
    }

    item.stock_quantity -= data.quantity;
    await item.save();

    const newConsumption = await PropConsumption.create(data as any);
    const theme = item.get("theme") as PropTheme | undefined;
    return this.formatConsumption(newConsumption, item.name, theme?.name);
  }

  async getConsumptions(propItemId?: number): Promise<PropConsumptionType[]> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getConsumptions(propItemId);
    }
    const where: any = {};
    if (propItemId) {
      where.prop_item_id = propItemId;
    }
    const consumptions = await PropConsumption.findAll({
      where,
      include: [
        {
          model: PropItem,
          as: "item",
          include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
        },
      ],
      order: [["consumption_date", "DESC"]],
    });
    return consumptions.map((c) => {
      const item = c.get("item") as PropItem | undefined;
      const theme = item?.get("theme") as PropTheme | undefined;
      return this.formatConsumption(c, item?.name, theme?.name);
    });
  }

  async addMaintenance(
    data: Omit<PropMaintenanceType, "id" | "created_at" | "prop_name" | "theme_name">
  ): Promise<PropMaintenanceType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.addMaintenance(data);
    }
    const item = await PropItem.findByPk(data.prop_item_id, {
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    if (!item) return null;

    if (data.status === "in_progress" || data.status === "pending") {
      item.inspection_status = "maintenance";
      await item.save();
    }

    const newMaintenance = await PropMaintenance.create(data as any);
    const theme = item.get("theme") as PropTheme | undefined;
    return this.formatMaintenance(newMaintenance, item.name, theme?.name);
  }

  async updateMaintenance(
    id: number,
    updates: Partial<PropMaintenanceType>
  ): Promise<PropMaintenanceType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.updateMaintenance(id, updates);
    }
    const maintenance = await PropMaintenance.findByPk(id, {
      include: [
        {
          model: PropItem,
          as: "item",
          include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
        },
      ],
    });
    if (!maintenance) return null;

    const { created_at, ...safeUpdates } = updates as any;
    await maintenance.update(safeUpdates);

    if (updates.status === "completed") {
      const item = maintenance.get("item") as PropItem | undefined;
      if (item) {
        const hasActiveMaintenance = await PropMaintenance.count({
          where: {
            prop_item_id: item.id,
            id: { [Op.ne]: id },
            status: { [Op.ne]: "completed" },
          },
        });
        if (!hasActiveMaintenance) {
          item.inspection_status =
            item.stock_quantity <= item.warning_threshold ? "warning" : "normal";
          await item.save();
        }
      }
    }

    const item = maintenance.get("item") as PropItem | undefined;
    const theme = item?.get("theme") as PropTheme | undefined;
    return this.formatMaintenance(maintenance, item?.name, theme?.name);
  }

  async getMaintenances(propItemId?: number): Promise<PropMaintenanceType[]> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getMaintenances(propItemId);
    }
    const where: any = {};
    if (propItemId) {
      where.prop_item_id = propItemId;
    }
    const maintenances = await PropMaintenance.findAll({
      where,
      include: [
        {
          model: PropItem,
          as: "item",
          include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
        },
      ],
      order: [["maintenance_date", "DESC"]],
    });
    return maintenances.map((m) => {
      const item = m.get("item") as PropItem | undefined;
      const theme = item?.get("theme") as PropTheme | undefined;
      return this.formatMaintenance(m, item?.name, theme?.name);
    });
  }

  async getDashboard(): Promise<PropDashboardResponse> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.getDashboard();
    }
    const allItems = await PropItem.findAll({
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });

    const formattedItems = allItems.map((item) => {
      const theme = item.get("theme") as PropTheme | undefined;
      return this.formatItem(item, theme?.name);
    });

    const lowStockItems = formattedItems.filter((item) => item.is_low_stock);

    const now = new Date();
    const inspectionOverdue = formattedItems.filter((item) => {
      if (!item.next_check_date) return false;
      return new Date(item.next_check_date) < now;
    });

    const recentMaintenances = await PropMaintenance.findAll({
      include: [
        {
          model: PropItem,
          as: "item",
          include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
        },
      ],
      order: [["maintenance_date", "DESC"]],
      limit: 5,
    });

    const formattedRecent = recentMaintenances.map((m) => {
      const item = m.get("item") as PropItem | undefined;
      const theme = item?.get("theme") as PropTheme | undefined;
      return this.formatMaintenance(m, item?.name, theme?.name);
    });

    const thisMonth = new Date();
    const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const thisMonthConsumptions = await PropConsumption.findAll({
      where: {
        consumption_date: { [Op.gte]: thisMonthStart.toISOString().split("T")[0] },
      },
    });

    const thisMonthMaintenances = await PropMaintenance.findAll({
      where: {
        maintenance_date: { [Op.gte]: thisMonthStart.toISOString().split("T")[0] },
      },
    });

    const pendingMaintenance = await PropMaintenance.count({
      where: { status: { [Op.ne]: "completed" } },
    });

    const stats: PropDashboardStats = {
      total_items: allItems.length,
      low_stock_count: lowStockItems.length,
      pending_maintenance: pendingMaintenance,
      maintenance_count: await PropMaintenance.count(),
      this_month_consumption: thisMonthConsumptions.reduce((sum, c) => sum + c.quantity, 0),
      this_month_cost: thisMonthMaintenances.reduce((sum, m) => sum + Number(m.cost), 0),
    };

    return {
      stats,
      low_stock_items: lowStockItems,
      recent_maintenances: formattedRecent,
      inspection_overdue: inspectionOverdue,
    };
  }

  async restockItem(id: number, quantity: number): Promise<PropItemType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.restockItem(id, quantity);
    }
    const item = await PropItem.findByPk(id, {
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    if (!item) return null;

    item.stock_quantity += quantity;
    if (item.inspection_status === "warning" && item.stock_quantity > item.warning_threshold) {
      item.inspection_status = "normal";
    }
    await item.save();

    const theme = item.get("theme") as PropTheme | undefined;
    return this.formatItem(item, theme?.name);
  }

  async updateInspection(
    id: number,
    lastCheckDate: string,
    nextCheckDate: string
  ): Promise<PropItemType | null> {
    if (!(await this.ensureDatabase())) {
      return this.memoryService!.updateInspection(id, lastCheckDate, nextCheckDate);
    }
    const item = await PropItem.findByPk(id, {
      include: [{ model: PropTheme, as: "theme", attributes: ["name"] }],
    });
    if (!item) return null;

    item.last_check_date = lastCheckDate;
    item.next_check_date = nextCheckDate;
    await item.save();

    const theme = item.get("theme") as PropTheme | undefined;
    return this.formatItem(item, theme?.name);
  }
}
