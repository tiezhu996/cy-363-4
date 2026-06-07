import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import type { PropItem, PropConsumption, PropMaintenance, PropTheme } from "../modules/props/props.models";

const mockSequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
});

jest.mock("../config/database", () => ({
  sequelize: mockSequelize,
  connectDatabase: jest.fn().mockResolvedValue(undefined),
  initDatabase: jest.fn().mockResolvedValue(undefined),
}));

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
class TestPropTheme extends Model<PropThemeModel, PropThemeCreationAttributes> {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public room_count!: number;
  public is_active!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

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
}
type PropItemCreationAttributes = Optional<
  PropItemModel,
  "id" | "created_at" | "updated_at"
>;
class TestPropItem extends Model<PropItemModel, PropItemCreationAttributes> {
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
}

interface PropConsumptionModel {
  id: number;
  prop_item_id: number;
  consumption_date: string;
  quantity: number;
  reason: string;
  operator: string | null;
  remark: string | null;
  created_at: Date;
}
type PropConsumptionCreationAttributes = Optional<
  PropConsumptionModel,
  "id" | "created_at"
>;
class TestPropConsumption extends Model<PropConsumptionModel, PropConsumptionCreationAttributes> {
  public id!: number;
  public prop_item_id!: number;
  public consumption_date!: string;
  public quantity!: number;
  public reason!: string;
  public operator!: string | null;
  public remark!: string | null;
  public created_at!: Date;
}

interface PropMaintenanceModel {
  id: number;
  prop_item_id: number;
  maintenance_date: string;
  type: "repair" | "inspection" | "replacement";
  description: string | null;
  cost: number;
  operator: string | null;
  status: "pending" | "in_progress" | "completed";
  remark: string | null;
  created_at: Date;
}
type PropMaintenanceCreationAttributes = Optional<
  PropMaintenanceModel,
  "id" | "created_at"
>;
class TestPropMaintenance extends Model<PropMaintenanceModel, PropMaintenanceCreationAttributes> {
  public id!: number;
  public prop_item_id!: number;
  public maintenance_date!: string;
  public type!: "repair" | "inspection" | "replacement";
  public description!: string | null;
  public cost!: number;
  public operator!: string | null;
  public status!: "pending" | "in_progress" | "completed";
  public remark!: string | null;
  public created_at!: Date;
}

function initModels(seq: Sequelize) {
  TestPropTheme.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      room_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize: seq, tableName: "prop_themes", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
  );

  TestPropItem.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      theme_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      specification: { type: DataTypes.STRING(200), allowNull: true },
      unit: { type: DataTypes.STRING(20), defaultValue: "个" },
      stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      warning_threshold: { type: DataTypes.INTEGER, defaultValue: 5 },
      last_check_date: { type: DataTypes.DATEONLY, allowNull: true },
      next_check_date: { type: DataTypes.DATEONLY, allowNull: true },
      inspection_status: { type: DataTypes.STRING(20), defaultValue: "normal" },
      remark: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize: seq, tableName: "prop_items", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
  );

  TestPropConsumption.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      prop_item_id: { type: DataTypes.INTEGER, allowNull: false },
      consumption_date: { type: DataTypes.DATEONLY, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      reason: { type: DataTypes.STRING(200), allowNull: false },
      operator: { type: DataTypes.STRING(50), allowNull: true },
      remark: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize: seq, tableName: "prop_consumptions", timestamps: false, createdAt: "created_at" }
  );

  TestPropMaintenance.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      prop_item_id: { type: DataTypes.INTEGER, allowNull: false },
      maintenance_date: { type: DataTypes.DATEONLY, allowNull: false },
      type: { type: DataTypes.STRING(20), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      operator: { type: DataTypes.STRING(50), allowNull: true },
      status: { type: DataTypes.STRING(20), defaultValue: "completed" },
      remark: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize: seq, tableName: "prop_maintenances", timestamps: false, createdAt: "created_at" }
  );

  TestPropItem.belongsTo(TestPropTheme, { foreignKey: "theme_id", as: "theme" });
  TestPropTheme.hasMany(TestPropItem, { foreignKey: "theme_id", as: "items" });
  TestPropConsumption.belongsTo(TestPropItem, { foreignKey: "prop_item_id", as: "item" });
  TestPropItem.hasMany(TestPropConsumption, { foreignKey: "prop_item_id", as: "consumptions" });
  TestPropMaintenance.belongsTo(TestPropItem, { foreignKey: "prop_item_id", as: "item" });
  TestPropItem.hasMany(TestPropMaintenance, { foreignKey: "prop_item_id", as: "maintenances" });
}

jest.mock("../models/PropTheme", () => ({ PropTheme: TestPropTheme }));
jest.mock("../models/PropItem", () => ({ PropItem: TestPropItem }));
jest.mock("../models/PropConsumption", () => ({ PropConsumption: TestPropConsumption }));
jest.mock("../models/PropMaintenance", () => ({ PropMaintenance: TestPropMaintenance }));
jest.mock("../models", () => ({
  PropTheme: TestPropTheme,
  PropItem: TestPropItem,
  PropConsumption: TestPropConsumption,
  PropMaintenance: TestPropMaintenance,
}));

import { PropsDbService } from "../modules/props/props.db.service";

async function setupTestDatabase(): Promise<Sequelize> {
  initModels(mockSequelize);
  await mockSequelize.sync({ force: true });
  return mockSequelize;
}

async function seedTestData(): Promise<{ theme: any; item: any }> {
  const theme = await TestPropTheme.create({
    name: "测试主题",
    description: "测试主题描述",
    room_count: 3,
    is_active: 1,
  });

  const item = await TestPropItem.create({
    theme_id: theme.id,
    name: "测试道具",
    specification: "测试规格",
    unit: "个",
    stock_quantity: 10,
    warning_threshold: 5,
    inspection_status: "normal",
    remark: null,
  });

  return { theme, item };
}

describe("PropsDbService - 数据库持久化测试", () => {
  let service: PropsDbService;

  beforeEach(async () => {
    await setupTestDatabase();
    service = new PropsDbService();
  });

  describe("CRUD 持久化测试", () => {
    it("addItem - 应该成功新增道具并持久化到数据库", async () => {
      const { theme } = await seedTestData();

      const newItemData: Omit<PropItem, "id" | "created_at" | "updated_at" | "is_low_stock" | "theme_name"> = {
        theme_id: theme.id,
        name: "新增测试道具",
        specification: "新增规格",
        unit: "个",
        stock_quantity: 20,
        warning_threshold: 5,
        last_check_date: "2026-06-07",
        next_check_date: "2026-06-21",
        inspection_status: "normal",
        remark: "持久化测试",
      };

      const result = await service.addItem(newItemData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(newItemData.name);
      expect(result.is_low_stock).toBe(false);

      const items = await service.getItemsByTheme(theme.id);
      expect(items.length).toBe(2);
      expect(items.find((i: any) => i.name === "新增测试道具")).toBeDefined();
    });

    it("updateItem - 应该成功更新道具并持久化到数据库", async () => {
      const { item } = await seedTestData();

      const updates = {
        name: "更新后的道具名称",
        stock_quantity: 15,
        warning_threshold: 8,
      };

      const result = await service.updateItem(item.id, updates);

      expect(result).not.toBeNull();
      expect(result!.name).toBe(updates.name);
      expect(result!.stock_quantity).toBe(updates.stock_quantity);
      expect(result!.warning_threshold).toBe(updates.warning_threshold);

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.name).toBe(updates.name);
      expect(updatedItem.stock_quantity).toBe(updates.stock_quantity);
    });

    it("deleteItem - 应该成功删除道具并从数据库移除", async () => {
      const { item } = await seedTestData();

      const initialItems = await service.getItemsByTheme();
      expect(initialItems.length).toBe(1);

      const result = await service.deleteItem(item.id);

      expect(result).toBe(true);

      const itemsAfterDelete = await service.getItemsByTheme();
      expect(itemsAfterDelete.length).toBe(0);
    });

    it("deleteItem - 删除不存在的道具应该返回 false", async () => {
      const result = await service.deleteItem(99999);
      expect(result).toBe(false);
    });
  });

  describe("库存扣减持久化测试", () => {
    it("addConsumption - 扣减库存应该持久化到数据库", async () => {
      const { item } = await seedTestData();
      const initialStock = item.stock_quantity;
      const consumeQuantity = 3;

      const consumptionData: Omit<PropConsumption, "id" | "created_at" | "prop_name" | "theme_name"> = {
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: consumeQuantity,
        reason: "持久化测试损耗",
        operator: "测试员",
        remark: null,
      };

      const result = await service.addConsumption(consumptionData);

      expect(result).not.toBeNull();
      expect(result!.prop_item_id).toBe(item.id);
      expect(result!.quantity).toBe(consumeQuantity);

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.stock_quantity).toBe(initialStock - consumeQuantity);

      const consumptions = await service.getConsumptions(item.id);
      expect(consumptions.length).toBe(1);
      expect(consumptions[0].reason).toBe("持久化测试损耗");
    });

    it("addConsumption - 库存不足时不扣减也不持久化", async () => {
      const { item } = await seedTestData();
      const initialStock = item.stock_quantity;

      const result = await service.addConsumption({
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: initialStock + 10,
        reason: "超量测试",
        operator: "测试员",
        remark: null,
      });

      expect(result).toBeNull();

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.stock_quantity).toBe(initialStock);

      const consumptions = await service.getConsumptions(item.id);
      expect(consumptions.length).toBe(0);
    });

    it("restockItem - 补货应该持久化到数据库", async () => {
      const { item } = await seedTestData();
      const initialStock = item.stock_quantity;
      const restockQuantity = 5;

      const result = await service.restockItem(item.id, restockQuantity);

      expect(result).not.toBeNull();
      expect(result!.stock_quantity).toBe(initialStock + restockQuantity);

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.stock_quantity).toBe(initialStock + restockQuantity);
    });
  });

  describe("维修状态持久化测试", () => {
    it("addMaintenance - 添加进行中维修应该持久化并更新道具状态", async () => {
      const { item } = await seedTestData();

      const maintenanceData: Omit<PropMaintenance, "id" | "created_at" | "prop_name" | "theme_name"> = {
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "测试维修",
        cost: 100,
        operator: "王维修",
        status: "in_progress",
        remark: null,
      };

      const result = await service.addMaintenance(maintenanceData);

      expect(result).not.toBeNull();
      expect(result!.status).toBe("in_progress");

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.inspection_status).toBe("maintenance");

      const maintenances = await service.getMaintenances(item.id);
      expect(maintenances.length).toBe(1);
      expect(maintenances[0].description).toBe("测试维修");
    });

    it("updateMaintenance - 标记维修完成应该持久化并更新道具状态", async () => {
      const { item } = await seedTestData();

      const maintenance = await service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "待完成维修",
        cost: 80,
        operator: "王维修",
        status: "in_progress",
        remark: null,
      });

      let updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.inspection_status).toBe("maintenance");

      const result = await service.updateMaintenance(maintenance!.id, { status: "completed" });

      expect(result).not.toBeNull();
      expect(result!.status).toBe("completed");

      updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.inspection_status).toBe("normal");
    });

    it("addMaintenance - 添加多个维修时，完成一个后状态保持 maintenance", async () => {
      const { item } = await seedTestData();

      const m1 = await service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "维修1",
        cost: 50,
        operator: "王维修",
        status: "in_progress",
        remark: null,
      });

      await service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "维修2",
        cost: 60,
        operator: "王维修",
        status: "in_progress",
        remark: null,
      });

      await service.updateMaintenance(m1!.id, { status: "completed" });

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.inspection_status).toBe("maintenance");

      const maintenances = await service.getMaintenances(item.id);
      expect(maintenances.length).toBe(2);
    });
  });

  describe("巡检统计持久化测试", () => {
    it("getDashboard - 应该从数据库正确统计所有数据", async () => {
      const { theme, item } = await seedTestData();

      await service.addItem({
        theme_id: theme.id,
        name: "低库存道具",
        specification: "规格",
        unit: "个",
        stock_quantity: 2,
        warning_threshold: 5,
        last_check_date: null,
        next_check_date: "2026-06-01",
        inspection_status: "warning",
        remark: null,
      });

      await service.addConsumption({
        prop_item_id: item.id,
        consumption_date: "2026-06-07",
        quantity: 2,
        reason: "本月消耗",
        operator: "测试员",
        remark: null,
      });

      await service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "inspection",
        description: "本月巡检",
        cost: 200,
        operator: "李巡检",
        status: "completed",
        remark: null,
      });

      await service.addMaintenance({
        prop_item_id: item.id,
        maintenance_date: "2026-06-07",
        type: "repair",
        description: "待处理维修",
        cost: 150,
        operator: "王维修",
        status: "pending",
        remark: null,
      });

      const dashboard = await service.getDashboard();

      expect(dashboard.stats.total_items).toBe(2);
      expect(dashboard.stats.low_stock_count).toBe(1);
      expect(dashboard.stats.pending_maintenance).toBe(1);
      expect(dashboard.stats.this_month_consumption).toBe(2);
      expect(dashboard.stats.this_month_cost).toBe(350);
      expect(dashboard.low_stock_items.length).toBe(1);
      expect(dashboard.inspection_overdue.length).toBe(1);
      expect(dashboard.recent_maintenances.length).toBe(2);
    });

    it("updateInspection - 巡检日期更新应该持久化", async () => {
      const { item } = await seedTestData();
      const lastCheckDate = "2026-06-07";
      const nextCheckDate = "2026-06-21";

      const result = await service.updateInspection(item.id, lastCheckDate, nextCheckDate);

      expect(result).not.toBeNull();
      expect(result!.last_check_date).toBe(lastCheckDate);
      expect(result!.next_check_date).toBe(nextCheckDate);

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.last_check_date).toBe(lastCheckDate);
      expect(updatedItem.next_check_date).toBe(nextCheckDate);
    });

    it("getThemesWithItems - 应该从数据库正确关联查询", async () => {
      const { theme } = await seedTestData();

      await service.addItem({
        theme_id: theme.id,
        name: "第二个道具",
        specification: "规格2",
        unit: "个",
        stock_quantity: 8,
        warning_threshold: 3,
        last_check_date: null,
        next_check_date: null,
        inspection_status: "normal",
        remark: null,
      });

      const themesWithItems = await service.getThemesWithItems();

      expect(themesWithItems.length).toBe(1);
      expect(themesWithItems[0].items.length).toBe(2);
      themesWithItems[0].items.forEach((item: any) => {
        expect(item.theme_id).toBe(theme.id);
        expect(item.theme_name).toBe(theme.name);
      });
    });
  });

  describe("is_low_stock 持久化计算测试", () => {
    it("新增道具时应该正确计算 is_low_stock", async () => {
      const { theme } = await seedTestData();

      const lowStockItem = await service.addItem({
        theme_id: theme.id,
        name: "低库存",
        specification: "test",
        unit: "个",
        stock_quantity: 2,
        warning_threshold: 5,
        last_check_date: null,
        next_check_date: null,
        inspection_status: "normal",
        remark: null,
      });

      const normalItem = await service.addItem({
        theme_id: theme.id,
        name: "正常库存",
        specification: "test",
        unit: "个",
        stock_quantity: 10,
        warning_threshold: 5,
        last_check_date: null,
        next_check_date: null,
        inspection_status: "normal",
        remark: null,
      });

      expect(lowStockItem.is_low_stock).toBe(true);
      expect(normalItem.is_low_stock).toBe(false);

      const items = await service.getItemsByTheme(theme.id);
      expect(items.find((i: any) => i.name === "低库存")!.is_low_stock).toBe(true);
      expect(items.find((i: any) => i.name === "正常库存")!.is_low_stock).toBe(false);
    });

    it("更新预警阈值后应该重新计算 is_low_stock", async () => {
      const { item } = await seedTestData();

      await service.updateItem(item.id, { warning_threshold: 20 });

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === item.id)!;
      expect(updatedItem.is_low_stock).toBe(true);
    });

    it("补货后库存高于预警值时应该恢复正常状态", async () => {
      const { theme } = await seedTestData();

      const lowItem = await service.addItem({
        theme_id: theme.id,
        name: "待补货",
        specification: "test",
        unit: "个",
        stock_quantity: 2,
        warning_threshold: 5,
        last_check_date: null,
        next_check_date: null,
        inspection_status: "warning",
        remark: null,
      });

      expect(lowItem.is_low_stock).toBe(true);
      expect(lowItem.inspection_status).toBe("warning");

      await service.restockItem(lowItem.id, 10);

      const updatedItem = (await service.getItemsByTheme()).find((i: any) => i.id === lowItem.id)!;
      expect(updatedItem.is_low_stock).toBe(false);
      expect(updatedItem.inspection_status).toBe("normal");
    });
  });
});
