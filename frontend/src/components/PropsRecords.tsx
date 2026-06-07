import { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Tabs,
  Card,
  Button,
  Space,
  Modal,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { PropConsumption, PropMaintenance } from "../types";
import { updatePropMaintenance } from "../api/client";

const { Title, Text } = Typography;

interface PropsRecordsProps {
  consumptions: PropConsumption[];
  maintenances: PropMaintenance[];
  onDataChange: () => void;
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

function getMaintenanceTypeTag(type: string) {
  const typeMap: Record<string, { color: string; text: string }> = {
    repair: { color: "orange", text: "维修" },
    inspection: { color: "blue", text: "巡检" },
    replacement: { color: "purple", text: "更换" },
  };
  const cfg = typeMap[type] || { color: "default", text: type };
  return <Tag color={cfg.color}>{cfg.text}</Tag>;
}

export function PropsRecords({ consumptions, maintenances, onDataChange }: PropsRecordsProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [currentMaintenance, setCurrentMaintenance] = useState<PropMaintenance | null>(null);

  const openCompleteModal = (record: PropMaintenance) => {
    setCurrentMaintenance(record);
    setConfirmModalOpen(true);
  };

  const handleComplete = async () => {
    if (!currentMaintenance) return;
    try {
      await updatePropMaintenance(currentMaintenance.id, { status: "completed" });
      message.success("维修已完成");
      setConfirmModalOpen(false);
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "操作失败");
    }
  };

  const consumptionColumns: ColumnsType<PropConsumption> = [
    {
      title: "日期",
      dataIndex: "consumption_date",
      key: "consumption_date",
      width: 120,
      fixed: "left",
    },
    {
      title: "所属主题",
      dataIndex: "theme_name",
      key: "theme_name",
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "道具名称",
      dataIndex: "prop_name",
      key: "prop_name",
      width: 140,
    },
    {
      title: "损耗数量",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (value: number, record) => (
        <Text strong style={{ color: "#ff4d4f" }}>
          -{value} {record.prop_name?.includes("钥匙") ? "把" : record.prop_name?.includes("条") ? "条" : "个"}
        </Text>
      ),
    },
    {
      title: "损耗原因",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "操作人",
      dataIndex: "operator",
      key: "operator",
      width: 100,
      render: (text: string) => <Text type="secondary">{text || "-"}</Text>,
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      render: (text: string) => <Text type="secondary">{text || "-"}</Text>,
    },
  ];

  const maintenanceColumns: ColumnsType<PropMaintenance> = [
    {
      title: "日期",
      dataIndex: "maintenance_date",
      key: "maintenance_date",
      width: 120,
      fixed: "left",
    },
    {
      title: "所属主题",
      dataIndex: "theme_name",
      key: "theme_name",
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "道具名称",
      dataIndex: "prop_name",
      key: "prop_name",
      width: 140,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type: string) => getMaintenanceTypeTag(type),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => <Text>{text || "-"}</Text>,
    },
    {
      title: "费用",
      dataIndex: "cost",
      key: "cost",
      width: 100,
      render: (value: number) => (
        <Text style={{ color: "#9b3357", fontWeight: 500 }}>
          {value > 0 ? `¥${value.toFixed(2)}` : "-"}
        </Text>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => getMaintenanceStatusTag(status),
    },
    {
      title: "操作人",
      dataIndex: "operator",
      key: "operator",
      width: 100,
      render: (text: string) => <Text type="secondary">{text || "-"}</Text>,
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_: any, record) =>
        record.status !== "completed" ? (
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => openCompleteModal(record)}
          >
            完成
          </Button>
        ) : null,
    },
  ];

  const tabItems = [
    {
      key: "consumptions",
      label: (
        <span>
          <MinusCircleOutlined style={{ color: "#ff4d4f", marginRight: "6px" }} />
          损耗记录
          <Tag color="red" style={{ marginLeft: "8px" }}>
            {consumptions.length}
          </Tag>
        </span>
      ),
      children: (
        <div>
          <Card
            className="summary-card"
            size="small"
            style={{ marginBottom: "16px" }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Space>
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: "4px" }} />
                共 {consumptions.length} 条损耗记录
              </Text>
              <Text type="secondary">·</Text>
              <Text type="secondary">
                总损耗数量：
                <Text strong style={{ color: "#ff4d4f" }}>
                  {consumptions.reduce((sum, c) => sum + c.quantity, 0)} 件
                </Text>
              </Text>
            </Space>
          </Card>
          <Table
            columns={consumptionColumns}
            dataSource={consumptions}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 900 }}
          />
        </div>
      ),
    },
    {
      key: "maintenances",
      label: (
        <span>
          <ToolOutlined style={{ color: "#fa8c16", marginRight: "6px" }} />
          维修记录
          <Tag color="orange" style={{ marginLeft: "8px" }}>
            {maintenances.length}
          </Tag>
          {maintenances.filter((m) => m.status !== "completed").length > 0 && (
            <Tag color="processing" style={{ marginLeft: "4px" }}>
              {maintenances.filter((m) => m.status !== "completed").length} 进行中
            </Tag>
          )}
        </span>
      ),
      children: (
        <div>
          <Card
            className="summary-card"
            size="small"
            style={{ marginBottom: "16px" }}
            bodyStyle={{ padding: "12px 16px" }}
          >
            <Space>
              <Text type="secondary">
                <ClockCircleOutlined style={{ marginRight: "4px" }} />
                共 {maintenances.length} 条维修记录
              </Text>
              <Text type="secondary">·</Text>
              <Text type="secondary">
                待处理：
                <Text strong style={{ color: "#fa8c16" }}>
                  {maintenances.filter((m) => m.status === "pending").length} 件
                </Text>
              </Text>
              <Text type="secondary">·</Text>
              <Text type="secondary">
                进行中：
                <Text strong style={{ color: "#1890ff" }}>
                  {maintenances.filter((m) => m.status === "in_progress").length} 件
                </Text>
              </Text>
              <Text type="secondary">·</Text>
              <Text type="secondary">
                总费用：
                <Text strong style={{ color: "#9b3357" }}>
                  ¥{maintenances.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}
                </Text>
              </Text>
            </Space>
          </Card>
          <Table
            columns={maintenanceColumns}
            dataSource={maintenances}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1000 }}
            rowClassName={(record) =>
              record.status === "completed" ? "completed-row" : ""
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className="props-records">
      <Title level={3} style={{ marginTop: 0, marginBottom: "20px" }}>
        损耗与维修记录
      </Title>

      <Tabs defaultActiveKey="consumptions" items={tabItems} />

      <Modal
        title="确认完成维修"
        open={confirmModalOpen}
        onOk={handleComplete}
        onCancel={() => setConfirmModalOpen(false)}
        okText="确认完成"
        cancelText="取消"
      >
        {currentMaintenance && (
          <div>
            <p>
              <Text strong>道具：</Text>
              {currentMaintenance.prop_name}
            </p>
            <p>
              <Text strong>类型：</Text>
              {getMaintenanceTypeTag(currentMaintenance.type)}
            </p>
            <p>
              <Text strong>描述：</Text>
              {currentMaintenance.description || "-"}
            </p>
            <p>
              <Text strong>费用：</Text>
              {currentMaintenance.cost > 0
                ? `¥${currentMaintenance.cost.toFixed(2)}`
                : "-"}
            </p>
            <p style={{ color: "#fa8c16" }}>
              确认将此维修记录标记为已完成？
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
