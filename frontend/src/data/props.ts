import type {
  PropTheme,
  PropItem,
  PropConsumption,
  PropMaintenance,
  PropDashboardResponse,
  PropThemeWithItems,
} from "../types";

export const localPropThemes: PropTheme[] = [
  {
    id: 1,
    name: "古堡惊魂",
    description: "中世纪古堡主题，包含大量复古道具和机关",
    room_count: 3,
    is_active: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "星际迷途",
    description: "科幻太空主题，电子道具和精密机关",
    room_count: 2,
    is_active: 1,
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "古墓探秘",
    description: "古代陵墓主题，仿古文物和神秘机关",
    room_count: 2,
    is_active: 1,
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-06-03T00:00:00.000Z",
  },
];

export const localPropItems: PropItem[] = [
  {
    id: 1,
    theme_id: 1,
    name: "铜制钥匙",
    specification: "古堡大门钥匙，复古样式",
    unit: "把",
    stock_quantity: 12,
    warning_threshold: 5,
    last_check_date: "2026-06-01",
    next_check_date: "2026-06-15",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
    theme_name: "古堡惊魂",
    is_low_stock: false,
  },
  {
    id: 2,
    theme_id: 1,
    name: "密码箱",
    specification: "6位数字密码，带报警装置",
    unit: "个",
    stock_quantity: 3,
    warning_threshold: 2,
    last_check_date: "2026-06-03",
    next_check_date: "2026-06-17",
    inspection_status: "warning",
    remark: "库存偏低，需补货",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-06-03T00:00:00.000Z",
    theme_name: "古堡惊魂",
    is_low_stock: true,
  },
  {
    id: 3,
    theme_id: 1,
    name: "蜡烛台",
    specification: "复古铁艺，电子蜡烛",
    unit: "个",
    stock_quantity: 4,
    warning_threshold: 3,
    last_check_date: "2026-06-02",
    next_check_date: "2026-06-16",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
    theme_name: "古堡惊魂",
    is_low_stock: false,
  },
  {
    id: 4,
    theme_id: 1,
    name: "机关齿轮",
    specification: "精密黄铜齿轮组",
    unit: "套",
    stock_quantity: 2,
    warning_threshold: 3,
    last_check_date: "2026-06-01",
    next_check_date: "2026-06-15",
    inspection_status: "maintenance",
    remark: "齿轮磨损，正在维修",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
    theme_name: "古堡惊魂",
    is_low_stock: true,
  },
  {
    id: 5,
    theme_id: 2,
    name: "指纹识别器",
    specification: "光学指纹模块，USB接口",
    unit: "台",
    stock_quantity: 6,
    warning_threshold: 3,
    last_check_date: "2026-06-04",
    next_check_date: "2026-06-18",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-06-04T00:00:00.000Z",
    theme_name: "星际迷途",
    is_low_stock: false,
  },
  {
    id: 6,
    theme_id: 2,
    name: "LED指示灯条",
    specification: "RGB变色，5米长",
    unit: "条",
    stock_quantity: 1,
    warning_threshold: 5,
    last_check_date: "2026-06-02",
    next_check_date: "2026-06-16",
    inspection_status: "warning",
    remark: "库存严重不足",
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
    theme_name: "星际迷途",
    is_low_stock: true,
  },
  {
    id: 7,
    theme_id: 2,
    name: "宇航头盔道具",
    specification: "带呼吸灯效果",
    unit: "个",
    stock_quantity: 8,
    warning_threshold: 4,
    last_check_date: "2026-06-03",
    next_check_date: "2026-06-17",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-06-03T00:00:00.000Z",
    theme_name: "星际迷途",
    is_low_stock: false,
  },
  {
    id: 8,
    theme_id: 3,
    name: "仿古玉玺",
    specification: "雕刻精细，带印章",
    unit: "方",
    stock_quantity: 5,
    warning_threshold: 2,
    last_check_date: "2026-06-01",
    next_check_date: "2026-06-15",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-06-01T00:00:00.000Z",
    theme_name: "古墓探秘",
    is_low_stock: false,
  },
  {
    id: 9,
    theme_id: 3,
    name: "竹简线索",
    specification: "写有古文，防水处理",
    unit: "卷",
    stock_quantity: 3,
    warning_threshold: 5,
    last_check_date: "2026-06-02",
    next_check_date: "2026-06-16",
    inspection_status: "warning",
    remark: "受潮变形较多，急需补货",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
    theme_name: "古墓探秘",
    is_low_stock: true,
  },
  {
    id: 10,
    theme_id: 3,
    name: "石门机关",
    specification: "电动触发，重量感应",
    unit: "套",
    stock_quantity: 2,
    warning_threshold: 1,
    last_check_date: "2026-06-05",
    next_check_date: "2026-06-19",
    inspection_status: "normal",
    remark: "",
    created_at: "2026-02-01T00:00:00.000Z",
    updated_at: "2026-06-05T00:00:00.000Z",
    theme_name: "古墓探秘",
    is_low_stock: false,
  },
];

export const localPropConsumptions: PropConsumption[] = [
  {
    id: 1,
    prop_item_id: 1,
    consumption_date: "2026-05-28",
    quantity: 2,
    reason: "玩家游戏中丢失",
    operator: "张服务",
    remark: "",
    created_at: "2026-05-28T10:00:00.000Z",
    prop_name: "铜制钥匙",
    theme_name: "古堡惊魂",
  },
  {
    id: 2,
    prop_item_id: 2,
    consumption_date: "2026-05-30",
    quantity: 1,
    reason: "密码输入错误次数过多损坏",
    operator: "李前台",
    remark: "已送修",
    created_at: "2026-05-30T14:30:00.000Z",
    prop_name: "密码箱",
    theme_name: "古堡惊魂",
  },
  {
    id: 3,
    prop_item_id: 4,
    consumption_date: "2026-06-02",
    quantity: 1,
    reason: "齿轮磨损卡顿",
    operator: "王维护",
    remark: "维修中",
    created_at: "2026-06-02T09:15:00.000Z",
    prop_name: "机关齿轮",
    theme_name: "古堡惊魂",
  },
  {
    id: 4,
    prop_item_id: 6,
    consumption_date: "2026-06-03",
    quantity: 3,
    reason: "LED灯珠烧坏",
    operator: "赵技术",
    remark: "已订购新灯条",
    created_at: "2026-06-03T11:45:00.000Z",
    prop_name: "LED指示灯条",
    theme_name: "星际迷途",
  },
  {
    id: 5,
    prop_item_id: 9,
    consumption_date: "2026-06-04",
    quantity: 2,
    reason: "竹简受潮变形",
    operator: "张服务",
    remark: "梅雨季节需注意防潮",
    created_at: "2026-06-04T16:20:00.000Z",
    prop_name: "竹简线索",
    theme_name: "古墓探秘",
  },
];

export const localPropMaintenances: PropMaintenance[] = [
  {
    id: 1,
    prop_item_id: 2,
    maintenance_date: "2026-05-25",
    type: "repair",
    description: "更换密码锁内部电路板",
    cost: 150.0,
    operator: "王维护",
    status: "completed",
    remark: "维修后功能正常",
    created_at: "2026-05-25T00:00:00.000Z",
    prop_name: "密码箱",
    theme_name: "古堡惊魂",
  },
  {
    id: 2,
    prop_item_id: 4,
    maintenance_date: "2026-06-02",
    type: "repair",
    description: "齿轮组清洗润滑，更换磨损齿轮",
    cost: 80.0,
    operator: "王维护",
    status: "completed",
    remark: "运转顺畅",
    created_at: "2026-06-02T00:00:00.000Z",
    prop_name: "机关齿轮",
    theme_name: "古堡惊魂",
  },
  {
    id: 3,
    prop_item_id: 6,
    maintenance_date: "2026-06-04",
    type: "inspection",
    description: "全面检查电路，更换烧坏灯珠",
    cost: 200.0,
    operator: "赵技术",
    status: "in_progress",
    remark: "等待新灯条到货",
    created_at: "2026-06-04T00:00:00.000Z",
    prop_name: "LED指示灯条",
    theme_name: "星际迷途",
  },
  {
    id: 4,
    prop_item_id: 10,
    maintenance_date: "2026-06-01",
    type: "inspection",
    description: "电机润滑，感应传感器校准",
    cost: 120.0,
    operator: "赵技术",
    status: "completed",
    remark: "感应灵敏度正常",
    created_at: "2026-06-01T00:00:00.000Z",
    prop_name: "石门机关",
    theme_name: "古墓探秘",
  },
];

export function createFallbackPropsDashboard(): PropDashboardResponse {
  const lowStockItems = localPropItems.filter((item) => item.is_low_stock);
  const now = new Date();
  const inspectionOverdue = localPropItems.filter((item) => {
    if (!item.next_check_date) return false;
    return new Date(item.next_check_date) < now;
  });

  const thisMonth = new Date();
  const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  const thisMonthConsumptions = localPropConsumptions.filter(
    (c) => new Date(c.consumption_date) >= thisMonthStart
  );
  const thisMonthMaintenances = localPropMaintenances.filter(
    (m) => new Date(m.maintenance_date) >= thisMonthStart
  );

  return {
    stats: {
      total_items: localPropItems.length,
      low_stock_count: lowStockItems.length,
      pending_maintenance: localPropMaintenances.filter((m) => m.status !== "completed").length,
      maintenance_count: localPropMaintenances.length,
      this_month_consumption: thisMonthConsumptions.reduce((sum, c) => sum + c.quantity, 0),
      this_month_cost: thisMonthMaintenances.reduce((sum, m) => sum + m.cost, 0),
    },
    low_stock_items: lowStockItems,
    recent_maintenances: [...localPropMaintenances].sort(
      (a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime()
    ).slice(0, 5),
    inspection_overdue: inspectionOverdue,
  };
}

export function createFallbackThemesWithItems(): PropThemeWithItems[] {
  return localPropThemes
    .filter((t) => t.is_active === 1)
    .map((theme) => ({
      ...theme,
      items: localPropItems
        .filter((item) => item.theme_id === theme.id)
        .map((item) => ({
          ...item,
          is_low_stock: item.stock_quantity <= item.warning_threshold,
          theme_name: theme.name,
        })),
    }));
}

export function createFallbackConsumptions(): PropConsumption[] {
  return [...localPropConsumptions].sort(
    (a, b) => new Date(b.consumption_date).getTime() - new Date(a.consumption_date).getTime()
  );
}

export function createFallbackMaintenances(): PropMaintenance[] {
  return [...localPropMaintenances].sort(
    (a, b) => new Date(b.maintenance_date).getTime() - new Date(a.maintenance_date).getTime()
  );
}
