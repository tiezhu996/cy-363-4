export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface PropTheme {
  id: number;
  name: string;
  description: string | null;
  room_count: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface PropItem {
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
  created_at: string;
  updated_at: string;
  theme_name?: string;
  is_low_stock?: boolean;
}

export interface PropConsumption {
  id: number;
  prop_item_id: number;
  consumption_date: string;
  quantity: number;
  reason: string;
  operator: string | null;
  remark: string | null;
  created_at: string;
  prop_name?: string;
  theme_name?: string;
}

export interface PropMaintenance {
  id: number;
  prop_item_id: number;
  maintenance_date: string;
  type: "repair" | "inspection" | "replacement";
  description: string | null;
  cost: number;
  operator: string | null;
  status: "pending" | "in_progress" | "completed";
  remark: string | null;
  created_at: string;
  prop_name?: string;
  theme_name?: string;
}

export interface PropDashboardStats {
  total_items: number;
  low_stock_count: number;
  pending_maintenance: number;
  maintenance_count: number;
  this_month_consumption: number;
  this_month_cost: number;
}

export interface PropDashboardResponse {
  stats: PropDashboardStats;
  low_stock_items: PropItem[];
  recent_maintenances: PropMaintenance[];
  inspection_overdue: PropItem[];
}

export interface PropThemeWithItems extends PropTheme {
  items: PropItem[];
}
