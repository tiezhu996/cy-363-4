import { PropsService } from "../modules/props/props.service";
import type { PropItem, PropMaintenance } from "../modules/props/props.models";

describe("PropsService - 库存扣减测试", () => {
  let service: PropsService;

  beforeEach(() => {
    service = new PropsService();
  });

  describe("addConsumption - 库存扣减", () => {
    it("应该成功扣减库存并返回损耗记录", () => {
      const initialItem = service.getItemsByTheme(1)[0];
      const initialStock = initialItem.stock_quantity;
      const consumeQuantity = 2;

      const result = service.addConsumption({
        prop_item_id: initialItem.id,
        consumption_date: "2026-06-07",
        quantity: consumeQuantity,
        reason: "测试损耗",
        operator: "测试员",
        remark: "单元测试",
      });

      expect(result).not.toBeNull();
      expect(result!.prop_item_id).toBe(initialItem.id);
      expect(result!.quantity).toBe(consumeQuantity);

      const updatedItem = service.getItemsByTheme(1).find((i) => i.id === initialItem.id);
      expect(updatedItem!.stock_quantity).toBe(initialStock - consumeQuantity);
    });

    it("当库存不足时应该返回 null，不扣减库存", () => {
      const item = service.getItemsByTheme(1)[0];
      const initialStock = item.stock_quantity;
      const excessiveQuantity = initialStock + 10;

      const result = service.addConsumption({
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: excessiveQuantity,
        reason: "超量测试",
        operator: "测试员",
        remark: "单元测试",
      });

      expect(result).toBeNull();

      const updatedItem = service.getItemsByTheme(1).find((i) => i.id === item.id);
      expect(updatedItem!.stock_quantity).toBe(initialStock);
    });

    it("应该正确计算 is_low_stock 状态", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => !i.is_low_stock)!;

      service.addConsumption({
        prop_item_id: normalItem.id,
        consumption_date: "2026-06-07",
        quantity: normalItem.stock_quantity,
        reason: "清空库存测试",
        operator: "测试员",
        remark: null,
      });

      const updatedItem = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(updatedItem!.is_low_stock).toBe(true);
      expect(updatedItem!.stock_quantity).toBe(0);
    });

    it("损耗记录应该正确关联道具名称和主题名称", () => {
      const items = service.getItemsByTheme(1);
      const item = items.find((i) => i.stock_quantity > 0)!;

      const result = service.addConsumption({
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: 1,
        reason: "关联测试",
        operator: "测试员",
        remark: null,
      });

      expect(result).not.toBeNull();
      expect(result!.prop_name).toBe(item.name);
      expect(result!.theme_name).toBeDefined();
      expect(result!.theme_name).not.toBe("");
    });

    it("扣减数量必须大于0", () => {
      const item = service.getItemsByTheme(1)[0];
      const initialStock = item.stock_quantity;

      const result = service.addConsumption({
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: 0,
        reason: "零数量测试",
        operator: "测试员",
        remark: null,
      });

      expect(result).not.toBeNull();
      expect(result!.quantity).toBe(0);
      const updatedItem = service.getItemsByTheme(1).find((i) => i.id === item.id);
      expect(updatedItem!.stock_quantity).toBe(initialStock);
    });

    it("当道具不存在时应该返回 null", () => {
      const result = service.addConsumption({
        prop_item_id: 99999,
        consumption_date: "2026-06-07",
        quantity: 1,
        reason: "不存在测试",
        operator: "测试员",
        remark: null,
      });

      expect(result).toBeNull();
    });
  });

  describe("restockItem - 补货测试", () => {
    it("应该成功增加库存", () => {
      const item = service.getItemsByTheme(1)[0];
      const initialStock = item.stock_quantity;
      const restockQuantity = 5;

      const result = service.restockItem(item.id, restockQuantity);

      expect(result).not.toBeNull();
      expect(result!.stock_quantity).toBe(initialStock + restockQuantity);

      const updatedItem = service.getItemsByTheme(1).find((i) => i.id === item.id);
      expect(updatedItem!.stock_quantity).toBe(initialStock + restockQuantity);
    });

    it("补货后库存高于预警值时应该自动恢复正常状态", () => {
      const lowStockItems = service.getItemsByTheme().filter((i) => i.is_low_stock);
      expect(lowStockItems.length).toBeGreaterThan(0);

      const item = lowStockItems[0];
      const restockQuantity = item.warning_threshold - item.stock_quantity + 10;

      const result = service.restockItem(item.id, restockQuantity);

      expect(result).not.toBeNull();
      expect(result!.stock_quantity).toBeGreaterThan(result!.warning_threshold);
      expect(result!.inspection_status).toBe("normal");
    });

    it("当道具不存在时应该返回 null", () => {
      const result = service.restockItem(99999, 5);
      expect(result).toBeNull();
    });
  });
});

describe("PropsService - 维修状态测试", () => {
  let service: PropsService;

  beforeEach(() => {
    service = new PropsService();
  });

  describe("addMaintenance - 添加维修记录", () => {
    it("添加进行中维修时应该将道具状态设为 maintenance", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => i.inspection_status === "normal")!;

      const result = service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "测试维修",
        cost: 100,
        operator: "王维修",
        status: "in_progress",
        remark: "单元测试",
      });

      expect(result).not.toBeNull();
      expect(result!.status).toBe("in_progress");

      const updatedItem = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(updatedItem!.inspection_status).toBe("maintenance");
    });

    it("添加待处理维修时应该将道具状态设为 maintenance", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => i.inspection_status === "normal")!;

      const result = service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "inspection",
        description: "测试巡检",
        cost: 50,
        operator: "李巡检",
        status: "pending",
        remark: null,
      });

      expect(result).not.toBeNull();
      const updatedItem = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(updatedItem!.inspection_status).toBe("maintenance");
    });

    it("添加已完成维修时不改变道具状态", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => i.inspection_status === "normal")!;

      const result = service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "测试维修",
        cost: 80,
        operator: "王维修",
        status: "completed",
        remark: null,
      });

      expect(result).not.toBeNull();
      const updatedItem = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(updatedItem!.inspection_status).toBe("normal");
    });

    it("维修记录应该正确关联道具名称和主题名称", () => {
      const item = service.getItemsByTheme(1)[0];

      const result = service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "inspection",
        description: "关联测试",
        cost: 0,
        operator: "测试员",
        status: "completed",
        remark: null,
      });

      expect(result).not.toBeNull();
      expect(result!.prop_name).toBe(item.name);
      expect(result!.theme_name).toBeDefined();
      expect(result!.theme_name).not.toBe("");
    });

    it("当道具不存在时应该返回 null", () => {
      const result = service.addMaintenance({
        prop_item_id: 99999,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "不存在测试",
        cost: 0,
        operator: null,
        status: "pending",
        remark: null,
      });

      expect(result).toBeNull();
    });
  });

  describe("updateMaintenance - 更新维修状态", () => {
    it("将维修标记为已完成且无其他待处理维修时，道具状态应恢复正常", () => {
      const maintenances = service.getMaintenances();
      const inProgress = maintenances.find((m) => m.status === "in_progress")!;
      expect(inProgress).toBeDefined();

      const result = service.updateMaintenance(inProgress.id, { status: "completed" });

      expect(result).not.toBeNull();
      expect(result!.status).toBe("completed");

      const item = service.getItemsByTheme().find((i) => i.id === inProgress.prop_item_id);
      const hasOtherActive = service
        .getMaintenances()
        .some((m) => m.prop_item_id === inProgress.prop_item_id && m.status !== "completed");

      if (!hasOtherActive) {
        expect(item!.inspection_status).not.toBe("maintenance");
      }
    });

    it("将维修标记为已完成但仍有其他待处理维修时，道具状态应保持 maintenance", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => i.inspection_status === "normal")!;

      service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "第一个维修",
        cost: 0,
        operator: null,
        status: "in_progress",
        remark: null,
      });

      const second = service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "第二个维修",
        cost: 0,
        operator: null,
        status: "in_progress",
        remark: null,
      })!;

      let item = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(item!.inspection_status).toBe("maintenance");

      service.updateMaintenance(second.id, { status: "completed" });

      item = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(item!.inspection_status).toBe("maintenance");
    });

    it("维修完成后如果库存仍低于预警值，状态应设为 warning", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => i.inspection_status === "normal" && i.stock_quantity > i.warning_threshold)!;

      service.addConsumption({
        prop_item_id: normalItem.id,
        consumption_date: "2026-06-07",
        quantity: normalItem.stock_quantity,
        reason: "清空库存",
        operator: "测试员",
        remark: null,
      });

      const maintenance = service.addMaintenance({
        prop_item_id: normalItem.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "测试维修",
        cost: 0,
        operator: null,
        status: "in_progress",
        remark: null,
      })!;

      let item = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(item!.inspection_status).toBe("maintenance");

      service.updateMaintenance(maintenance.id, { status: "completed" });

      item = service.getItemsByTheme().find((i) => i.id === normalItem.id);
      expect(item!.inspection_status).toBe("warning");
    });

    it("当维修记录不存在时应该返回 null", () => {
      const result = service.updateMaintenance(99999, { status: "completed" });
      expect(result).toBeNull();
    });
  });
});

describe("PropsService - 巡检统计测试", () => {
  let service: PropsService;

  beforeEach(() => {
    service = new PropsService();
  });

  describe("getDashboard - 看板统计", () => {
    it("应该正确统计道具总数", () => {
      const dashboard = service.getDashboard();
      const allItems = service.getItemsByTheme();

      expect(dashboard.stats.total_items).toBe(allItems.length);
      expect(dashboard.stats.total_items).toBeGreaterThan(0);
    });

    it("应该正确统计低库存道具数量", () => {
      const dashboard = service.getDashboard();
      const allItems = service.getItemsByTheme();
      const lowStockItems = allItems.filter((i) => i.is_low_stock);

      expect(dashboard.stats.low_stock_count).toBe(lowStockItems.length);
      expect(dashboard.low_stock_items.length).toBe(lowStockItems.length);

      dashboard.low_stock_items.forEach((item) => {
        expect(item.is_low_stock).toBe(true);
        expect(item.stock_quantity).toBeLessThanOrEqual(item.warning_threshold);
      });
    });

    it("应该正确统计待处理维修数量", () => {
      const dashboard = service.getDashboard();
      const allMaintenances = service.getMaintenances();
      const pending = allMaintenances.filter((m) => m.status !== "completed");

      expect(dashboard.stats.pending_maintenance).toBe(pending.length);
    });

    it("应该正确统计巡检过期道具", () => {
      const dashboard = service.getDashboard();
      const allItems = service.getItemsByTheme();
      const now = new Date();

      const overdue = allItems.filter((item) => {
        if (!item.next_check_date) return false;
        return new Date(item.next_check_date) < now;
      });

      expect(dashboard.inspection_overdue.length).toBe(overdue.length);

      dashboard.inspection_overdue.forEach((item) => {
        expect(item.next_check_date).toBeDefined();
        if (item.next_check_date) {
          expect(new Date(item.next_check_date).getTime()).toBeLessThan(now.getTime());
        }
      });
    });

    it("应该正确统计本月损耗数量", () => {
      const dashboard = service.getDashboard();
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const consumptions = service.getConsumptions();
      const thisMonthConsumptions = consumptions.filter(
        (c) => new Date(c.consumption_date) >= thisMonthStart
      );
      const expectedQuantity = thisMonthConsumptions.reduce((sum, c) => sum + c.quantity, 0);

      expect(dashboard.stats.this_month_consumption).toBe(expectedQuantity);
    });

    it("应该正确统计本月维修成本", () => {
      const dashboard = service.getDashboard();
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const maintenances = service.getMaintenances();
      const thisMonthMaintenances = maintenances.filter(
        (m) => new Date(m.maintenance_date) >= thisMonthStart
      );
      const expectedCost = thisMonthMaintenances.reduce((sum, m) => sum + m.cost, 0);

      expect(dashboard.stats.this_month_cost).toBe(expectedCost);
    });

    it("最近维修记录应该按日期倒序排列", () => {
      const dashboard = service.getDashboard();

      for (let i = 0; i < dashboard.recent_maintenances.length - 1; i++) {
        const current = new Date(dashboard.recent_maintenances[i].maintenance_date);
        const next = new Date(dashboard.recent_maintenances[i + 1].maintenance_date);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it("最近维修记录最多返回5条", () => {
      const dashboard = service.getDashboard();
      expect(dashboard.recent_maintenances.length).toBeLessThanOrEqual(5);
    });
  });

  describe("updateInspection - 更新巡检日期", () => {
    it("应该正确更新上次和下次巡检日期", () => {
      const item = service.getItemsByTheme(1)[0];
      const lastCheckDate = "2026-06-07";
      const nextCheckDate = "2026-06-21";

      const result = service.updateInspection(item.id, lastCheckDate, nextCheckDate);

      expect(result).not.toBeNull();
      expect(result!.last_check_date).toBe(lastCheckDate);
      expect(result!.next_check_date).toBe(nextCheckDate);

      const updatedItem = service.getItemsByTheme(1).find((i) => i.id === item.id);
      expect(updatedItem!.last_check_date).toBe(lastCheckDate);
      expect(updatedItem!.next_check_date).toBe(nextCheckDate);
    });

    it("当道具不存在时应该返回 null", () => {
      const result = service.updateInspection(99999, "2026-06-07", "2026-06-21");
      expect(result).toBeNull();
    });
  });

  describe("getThemesWithItems - 按主题分组", () => {
    it("应该返回所有活跃主题及其道具", () => {
      const themesWithItems = service.getThemesWithItems();
      const themes = service.getThemes();

      expect(themesWithItems.length).toBe(themes.length);

      themesWithItems.forEach((theme) => {
        expect(theme.is_active).toBe(1);
        expect(Array.isArray(theme.items)).toBe(true);

        theme.items.forEach((item) => {
          expect(item.theme_id).toBe(theme.id);
          expect(item.theme_name).toBe(theme.name);
        });
      });
    });

    it("每个道具应该正确计算 is_low_stock", () => {
      const themesWithItems = service.getThemesWithItems();

      themesWithItems.forEach((theme) => {
        theme.items.forEach((item) => {
          expect(item.is_low_stock).toBe(item.stock_quantity <= item.warning_threshold);
        });
      });
    });
  });
});

describe("PropsService - CRUD 测试", () => {
  let service: PropsService;

  beforeEach(() => {
    service = new PropsService();
  });

  describe("addItem - 新增道具", () => {
    it("应该成功添加新道具", () => {
      const themes = service.getThemes();
      const newItemData = {
        theme_id: themes[0].id,
        name: "测试道具",
        specification: "测试规格",
        unit: "个",
        stock_quantity: 10,
        warning_threshold: 5,
        last_check_date: "2026-06-07",
        next_check_date: "2026-06-21",
        inspection_status: "normal" as const,
        remark: "单元测试新增",
      };

      const result = service.addItem(newItemData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(newItemData.name);
      expect(result.theme_id).toBe(newItemData.theme_id);
      expect(result.is_low_stock).toBe(false);
    });

    it("新增道具时应该正确计算 is_low_stock", () => {
      const themes = service.getThemes();
      const newItemData = {
        theme_id: themes[0].id,
        name: "低库存测试道具",
        specification: "测试规格",
        unit: "个",
        stock_quantity: 2,
        warning_threshold: 5,
        last_check_date: null,
        next_check_date: null,
        inspection_status: "normal" as const,
        remark: "",
      };

      const result = service.addItem(newItemData);

      expect(result.is_low_stock).toBe(true);
    });
  });

  describe("updateItem - 编辑道具", () => {
    it("应该成功更新道具信息", () => {
      const items = service.getItemsByTheme();
      const item = items[0];
      const updates = {
        name: "更新后的名称",
        specification: "更新后的规格",
        warning_threshold: 10,
      };

      const result = service.updateItem(item.id, updates);

      expect(result).not.toBeNull();
      expect(result!.name).toBe(updates.name);
      expect(result!.specification).toBe(updates.specification);
      expect(result!.warning_threshold).toBe(updates.warning_threshold);
    });

    it("更新预警阈值后应该重新计算 is_low_stock", () => {
      const items = service.getItemsByTheme();
      const normalItem = items.find((i) => !i.is_low_stock)!;

      const result = service.updateItem(normalItem.id, {
        warning_threshold: normalItem.stock_quantity + 10,
      });

      expect(result!.is_low_stock).toBe(true);
    });

    it("当道具不存在时应该返回 null", () => {
      const result = service.updateItem(99999, { name: "测试" });
      expect(result).toBeNull();
    });
  });

  describe("deleteItem - 删除道具", () => {
    it("应该成功删除道具", () => {
      const items = service.getItemsByTheme();
      const itemToDelete = items[0];
      const initialCount = items.length;

      const result = service.deleteItem(itemToDelete.id);
      const updatedItems = service.getItemsByTheme();

      expect(result).toBe(true);
      expect(updatedItems.length).toBe(initialCount - 1);
      expect(updatedItems.find((i) => i.id === itemToDelete.id)).toBeUndefined();
    });

    it("当道具不存在时应该返回 false", () => {
      const result = service.deleteItem(99999);
      expect(result).toBe(false);
    });
  });
});
