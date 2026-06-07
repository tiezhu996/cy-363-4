import { Card, Statistic, Row, Col, List, Tag, Typography } from "antd";
import {
  WarningOutlined,
  ToolOutlined,
  ShoppingCartOutlined,
  AlertOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { PropDashboardResponse, PropItem, PropMaintenance } from "../types";

const { Title, Text } = Typography;

interface PropsDashboardProps {
  dashboard: PropDashboardResponse;
}

function getStatusTag(status: string) {
  const statusMap: Record<string, { color: string; text: string }> = {
    normal: { color: "green", text: "正常" },
    warning: { color: "orange", text: "预警" },
    maintenance: { color: "red", text: "维修中" },
  };
  const cfg = statusMap[status] || { color: "default", text: status };
  return <Tag color={cfg.color}>{cfg.text}</Tag>;
}

function getMaintenanceStatusTag(status: string) {
  const statusMap: Record<string, { color: string; text: string }> = {
    pending: { color: "default", text: "待处理" },
    in_progress: { color: "processing", text: "进行中" },
    completed: { color: "success", text: "已完成" },
  };
  const cfg = statusMap[status] || { color: "default", text: status };
  return <Tag color={cfg.color}>{cfg.text}</Tag>;
}

function LowStockItem({ item }: { item: PropItem }) {
  const shortfall = item.warning_threshold - item.stock_quantity + 1;
  return (
    <List.Item
      className="low-stock-item"
      style={{
        borderLeft: "3px solid #ff4d4f",
        paddingLeft: "12px",
        marginBottom: "8px",
        background: "rgba(255, 77, 79, 0.06)",
        borderRadius: "4px",
      }}
    >
      <List.Item.Meta
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#ff4d4f", fontWeight: 600 }}>{item.name}</span>
            {getStatusTag(item.inspection_status)}
          </div>
        }
        description={
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {item.theme_name} · {item.specification}
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text style={{ color: "#ff4d4f", fontWeight: 600 }}>
                当前库存：{item.stock_quantity} {item.unit}
              </Text>
              <Text type="secondary" style={{ marginLeft: "12px", fontSize: "12px" }}>
                预警值：{item.warning_threshold} {item.unit}
              </Text>
              <Tag color="red" style={{ marginLeft: "12px" }}>
                待补货：{shortfall} {item.unit}
              </Tag>
            </div>
          </div>
        }
      />
    </List.Item>
  );
}

function MaintenanceItem({ record }: { record: PropMaintenance }) {
  const typeMap: Record<string, string> = {
    repair: "维修",
    inspection: "巡检",
    replacement: "更换",
  };
  return (
    <List.Item style={{ marginBottom: "8px" }}>
      <List.Item.Meta
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 500 }}>{record.prop_name}</span>
            {getMaintenanceStatusTag(record.status)}
          </div>
        }
        description={
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.theme_name} · {typeMap[record.type] || record.type} · {record.operator}
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <ClockCircleOutlined style={{ marginRight: "4px" }} />
                {record.maintenance_date}
              </Text>
              {record.cost > 0 && (
                <Text style={{ marginLeft: "12px", fontSize: "12px", color: "#9b3357" }}>
                  ¥{record.cost.toFixed(2)}
                </Text>
              )}
            </div>
            {record.description && (
              <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                {record.description}
              </Text>
            )}
          </div>
        }
      />
    </List.Item>
  );
}

export function PropsDashboard({ dashboard }: PropsDashboardProps) {
  const { stats, low_stock_items, recent_maintenances } = dashboard;

  const pendingReplenish = low_stock_items.reduce(
    (sum, item) => sum + Math.max(0, item.warning_threshold - item.stock_quantity + 1),
    0
  );

  return (
    <div className="props-dashboard">
      <Title level={3} style={{ marginTop: 0, marginBottom: "20px" }}>
        道具库存看板
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={12} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="道具种类"
              value={stats.total_items}
              prefix={<ShoppingCartOutlined style={{ color: "#2d7c88" }} />}
              valueStyle={{ color: "#2d7c88" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card low-stock-card">
            <Statistic
              title="库存预警"
              value={stats.low_stock_count}
              prefix={<WarningOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
              suffix={<span style={{ fontSize: "14px", color: "#999" }}>种</span>}
            />
            <div style={{ marginTop: "8px", color: "#ff4d4f", fontSize: "12px" }}>
              <AlertOutlined /> 待补货总量：{pendingReplenish} 件
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="待处理维修"
              value={stats.pending_maintenance}
              prefix={<ToolOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card className="stat-card">
            <Statistic
              title="本月维修成本"
              value={stats.this_month_cost}
              precision={2}
              prefix="¥"
              valueStyle={{ color: "#9b3357" }}
            />
            <div style={{ marginTop: "8px", color: "#666", fontSize: "12px" }}>
              本月损耗：{stats.this_month_consumption} 件
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <WarningOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
                库存预警列表
              </span>
            }
            className="dashboard-card"
            extra={<Tag color="red">{low_stock_items.length} 项待补货</Tag>}
          >
            {low_stock_items.length > 0 ? (
              <List
                dataSource={low_stock_items}
                renderItem={(item) => <LowStockItem key={item.id} item={item} />}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                所有道具库存充足
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <ToolOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                近期维修记录
              </span>
            }
            className="dashboard-card"
          >
            {recent_maintenances.length > 0 ? (
              <List
                dataSource={recent_maintenances}
                renderItem={(record) => <MaintenanceItem key={record.id} record={record} />}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                暂无维修记录
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
