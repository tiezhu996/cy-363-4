import { useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  ToolOutlined,
  MinusCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type {
  PropThemeWithItems,
  PropItem,
  PropConsumption,
  PropMaintenance,
  PropTheme,
} from "../types";
import {
  addPropConsumption,
  addPropMaintenance,
  restockPropItem,
  updatePropInspection,
  updatePropMaintenance,
} from "../api/client";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PropsInventoryProps {
  themesWithItems: PropThemeWithItems[];
  themes: PropTheme[];
  onDataChange: () => void;
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

export function PropsInventory({ themesWithItems, themes, onDataChange }: PropsInventoryProps) {
  const [consumptionModalOpen, setConsumptionModalOpen] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PropItem | null>(null);
  const [consumptionForm] = Form.useForm();
  const [maintenanceForm] = Form.useForm();
  const [restockForm] = Form.useForm();
  const [inspectionForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const openConsumptionModal = (item: PropItem) => {
    setCurrentItem(item);
    consumptionForm.resetFields();
    consumptionForm.setFieldsValue({
      prop_item_id: item.id,
      consumption_date: new Date(),
    });
    setConsumptionModalOpen(true);
  };

  const openMaintenanceModal = (item: PropItem) => {
    setCurrentItem(item);
    maintenanceForm.resetFields();
    maintenanceForm.setFieldsValue({
      prop_item_id: item.id,
      maintenance_date: new Date(),
      type: "repair",
      status: "completed",
    });
    setMaintenanceModalOpen(true);
  };

  const openRestockModal = (item: PropItem) => {
    setCurrentItem(item);
    restockForm.resetFields();
    setRestockModalOpen(true);
  };

  const openInspectionModal = (item: PropItem) => {
    setCurrentItem(item);
    inspectionForm.resetFields();
    inspectionForm.setFieldsValue({
      last_check_date: item.last_check_date ? new Date(item.last_check_date) : new Date(),
      next_check_date: item.next_check_date
        ? new Date(item.next_check_date)
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });
    setInspectionModalOpen(true);
  };

  const handleConsumptionSubmit = async (values: any) => {
    if (!currentItem) return;
    setLoading(true);
    try {
      await addPropConsumption({
        ...values,
        consumption_date: values.consumption_date.format("YYYY-MM-DD"),
      });
      message.success("损耗记录已添加");
      setConsumptionModalOpen(false);
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "添加失败");
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceSubmit = async (values: any) => {
    if (!currentItem) return;
    setLoading(true);
    try {
      await addPropMaintenance({
        ...values,
        maintenance_date: values.maintenance_date.format("YYYY-MM-DD"),
      });
      message.success("维修记录已添加");
      setMaintenanceModalOpen(false);
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "添加失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRestockSubmit = async (values: { quantity: number }) => {
    if (!currentItem) return;
    setLoading(true);
    try {
      await restockPropItem(currentItem.id, values.quantity);
      message.success(`已补货 ${values.quantity} ${currentItem.unit}`);
      setRestockModalOpen(false);
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "补货失败");
    } finally {
      setLoading(false);
    }
  };

  const handleInspectionSubmit = async (values: any) => {
    if (!currentItem) return;
    setLoading(true);
    try {
      await updatePropInspection(
        currentItem.id,
        values.last_check_date.format("YYYY-MM-DD"),
        values.next_check_date.format("YYYY-MM-DD")
      );
      message.success("巡检记录已更新");
      setInspectionModalOpen(false);
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "更新失败");
    } finally {
      setLoading(false);
    }
  };

  const completeMaintenance = async (record: PropMaintenance) => {
    try {
      await updatePropMaintenance(record.id, { status: "completed" });
      message.success("维修已完成");
      onDataChange();
    } catch (error: any) {
      message.error(error.message || "操作失败");
    }
  };

  const columns: ColumnsType<PropItem> = [
    {
      title: "道具名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string, record) => (
        <Text strong={record.is_low_stock} style={{ color: record.is_low_stock ? "#ff4d4f" : undefined }}>
          {text}
        </Text>
      ),
    },
    {
      title: "规格说明",
      dataIndex: "specification",
      key: "specification",
      ellipsis: true,
      render: (text: string) => <Text type="secondary">{text || "-"}</Text>,
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      width: 60,
    },
    {
      title: "当前库存",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: 100,
      render: (value: number, record) => {
        const isLow = record.is_low_stock;
        return (
          <Text strong style={{ color: isLow ? "#ff4d4f" : undefined, fontSize: "16px" }}>
            {value}
            {isLow && <span style={{ marginLeft: "4px", fontSize: "12px" }}>⚠️</span>}
          </Text>
        );
      },
    },
    {
      title: "预警值",
      dataIndex: "warning_threshold",
      key: "warning_threshold",
      width: 80,
      render: (value: number) => <Text type="secondary">{value}</Text>,
    },
    {
      title: "状态",
      dataIndex: "inspection_status",
      key: "inspection_status",
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "上次巡检",
      dataIndex: "last_check_date",
      key: "last_check_date",
      width: 110,
      render: (date: string) => <Text type="secondary">{date || "-"}</Text>,
    },
    {
      title: "下次巡检",
      dataIndex: "next_check_date",
      key: "next_check_date",
      width: 110,
      render: (date: string) => {
        if (!date) return "-";
        const isOverdue = new Date(date) < new Date();
        return (
          <Text style={{ color: isOverdue ? "#ff4d4f" : undefined }}>
            {date}
            {isOverdue && " (已过期)"}
          </Text>
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 240,
      fixed: "right",
      render: (_: any, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<ShoppingOutlined />}
            onClick={() => openRestockModal(record)}
          >
            补货
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MinusCircleOutlined />}
            onClick={() => openConsumptionModal(record)}
          >
            损耗
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ToolOutlined />}
            onClick={() => openMaintenanceModal(record)}
          >
            维修
          </Button>
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => openInspectionModal(record)}
          >
            巡检
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = themesWithItems.map((theme) => ({
    key: String(theme.id),
    label: (
      <span>
        {theme.name}
        <Tag color="blue" style={{ marginLeft: "8px" }}>
          {theme.items.length} 种道具
        </Tag>
      </span>
    ),
    children: (
      <Card
        className="theme-card"
        size="small"
        style={{ marginBottom: "16px" }}
        bodyStyle={{ padding: "12px 16px" }}
      >
        <Text type="secondary">{theme.description}</Text>
      </Card>
    ),
  }));

  const renderThemeSection = (theme: PropThemeWithItems) => {
    const lowStockCount = theme.items.filter((item) => item.is_low_stock).length;

    return (
      <div key={theme.id} className="theme-section">
        <div className="theme-header">
          <div className="theme-title">
            <Title level={4} style={{ margin: 0 }}>
              {theme.name}
            </Title>
            <Tag color="blue">{theme.items.length} 种道具</Tag>
            {lowStockCount > 0 && (
              <Tag color="red">
                <span style={{ color: "#ff4d4f" }}>{lowStockCount} 种库存预警</span>
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            {theme.description}
          </Text>
        </div>
        <Table
          columns={columns}
          dataSource={theme.items}
          rowKey="id"
          size="middle"
          pagination={false}
          className="props-table"
          rowClassName={(record) => (record.is_low_stock ? "low-stock-row" : "")}
          scroll={{ x: 1000 }}
        />
      </div>
    );
  };

  return (
    <div className="props-inventory">
      <Title level={3} style={{ marginTop: 0, marginBottom: "20px" }}>
        道具清单管理
      </Title>

      <div className="inventory-actions">
        <Space>
          <Text type="secondary">
            共 {themesWithItems.reduce((sum, t) => sum + t.items.length, 0)} 种道具 ·
            {themesWithItems.reduce((sum, t) => sum + t.items.filter((i) => i.is_low_stock).length, 0)} 种待补货
          </Text>
        </Space>
      </div>

      <div className="themes-container">
        {themesWithItems.map((theme) => renderThemeSection(theme))}
      </div>

      <Modal
        title={
          <span>
            <MinusCircleOutlined style={{ color: "#ff4d4f", marginRight: "8px" }} />
            记录损耗 - {currentItem?.name}
          </span>
        }
        open={consumptionModalOpen}
        onCancel={() => setConsumptionModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={consumptionForm} layout="vertical" onFinish={handleConsumptionSubmit}>
          <Form.Item name="prop_item_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="损耗数量"
            name="quantity"
            rules={[
              { required: true, message: "请输入损耗数量" },
              {
                validator: (_, value) => {
                  if (currentItem && value > currentItem.stock_quantity) {
                    return Promise.reject(
                      new Error(`库存不足，当前库存：${currentItem.stock_quantity} ${currentItem.unit}`)
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={1} max={currentItem?.stock_quantity || 999} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="损耗原因"
            name="reason"
            rules={[{ required: true, message: "请输入损耗原因" }]}
          >
            <Select placeholder="请选择损耗原因">
              <Option value="玩家游戏中丢失">玩家游戏中丢失</Option>
              <Option value="使用损坏">使用损坏</Option>
              <Option value="自然磨损">自然磨损</Option>
              <Option value="维修损耗">维修损耗</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item label="损耗日期" name="consumption_date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="操作人" name="operator">
            <Input placeholder="请输入操作人姓名" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={2} placeholder="可选备注信息" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setConsumptionModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认记录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span>
            <ToolOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
            记录维修 - {currentItem?.name}
          </span>
        }
        open={maintenanceModalOpen}
        onCancel={() => setMaintenanceModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={maintenanceForm} layout="vertical" onFinish={handleMaintenanceSubmit}>
          <Form.Item name="prop_item_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="维修类型" name="type" rules={[{ required: true }]}>
            <Select>
              <Option value="repair">维修</Option>
              <Option value="inspection">巡检</Option>
              <Option value="replacement">更换</Option>
            </Select>
          </Form.Item>
          <Form.Item label="维修日期" name="maintenance_date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="维修描述" name="description">
            <TextArea rows={2} placeholder="请描述维修内容" />
          </Form.Item>
          <Form.Item label="维修费用" name="cost">
            <InputNumber min={0} precision={2} prefix="¥" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select>
              <Option value="pending">待处理</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item label="操作人" name="operator">
            <Input placeholder="请输入操作人姓名" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={2} placeholder="可选备注信息" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setMaintenanceModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认记录
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span>
            <ShoppingOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
            道具补货 - {currentItem?.name}
          </span>
        }
        open={restockModalOpen}
        onCancel={() => setRestockModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div style={{ marginBottom: "16px" }}>
          <Text type="secondary">
            当前库存：{currentItem?.stock_quantity} {currentItem?.unit} · 预警值：
            {currentItem?.warning_threshold} {currentItem?.unit}
          </Text>
        </div>
        <Form form={restockForm} layout="vertical" onFinish={handleRestockSubmit}>
          <Form.Item
            label="补货数量"
            name="quantity"
            rules={[{ required: true, message: "请输入补货数量" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} addonAfter={currentItem?.unit} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setRestockModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认补货
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span>
            <SafetyOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
            巡检登记 - {currentItem?.name}
          </span>
        }
        open={inspectionModalOpen}
        onCancel={() => setInspectionModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={inspectionForm} layout="vertical" onFinish={handleInspectionSubmit}>
          <Form.Item label="上次巡检日期" name="last_check_date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="下次巡检日期" name="next_check_date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setInspectionModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认登记
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
