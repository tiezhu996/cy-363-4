import { useEffect, useState, useCallback } from "react";
import { Button, ConfigProvider, Layout, Typography, theme, Tabs } from "antd";
import { ApiOutlined, DashboardOutlined, ShoppingOutlined, FileTextOutlined } from "@ant-design/icons";
import {
  fetchOverview,
  fetchPropsDashboard,
  fetchPropThemes,
  fetchPropThemesWithItems,
  fetchPropConsumptions,
  fetchPropMaintenances,
} from "./api/client";
import { APP_CODE, APP_NAME, APP_THEME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import {
  createFallbackPropsDashboard,
  createFallbackThemesWithItems,
  createFallbackConsumptions,
  createFallbackMaintenances,
  localPropThemes,
} from "./data/props";
import type {
  OverviewResponse,
  PropDashboardResponse,
  PropThemeWithItems,
  PropConsumption,
  PropMaintenance,
  PropTheme,
} from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { PropsDashboard } from "./components/PropsDashboard";
import { PropsInventory } from "./components/PropsInventory";
import { PropsRecords } from "./components/PropsRecords";

const { Header, Content } = Layout;

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);

  const [propsDashboard, setPropsDashboard] = useState<PropDashboardResponse>(
    createFallbackPropsDashboard()
  );
  const [themesWithItems, setThemesWithItems] = useState<PropThemeWithItems[]>(
    createFallbackThemesWithItems()
  );
  const [themes, setThemes] = useState<PropTheme[]>(localPropThemes);
  const [consumptions, setConsumptions] = useState<PropConsumption[]>(
    createFallbackConsumptions()
  );
  const [maintenances, setMaintenances] = useState<PropMaintenance[]>(
    createFallbackMaintenances()
  );
  const [propsNotice, setPropsNotice] = useState("当前展示本地示例数据，启动后端服务后自动切换。");

  const loadOverview = useCallback(() => {
    fetchOverview()
      .then((payload) => {
        setOverview(payload);
        setNotice("后端服务已联通，当前展示实时接口数据。");
      })
      .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));
  }, []);

  const loadPropsData = useCallback(() => {
    Promise.all([
      fetchPropsDashboard(),
      fetchPropThemes(),
      fetchPropThemesWithItems(),
      fetchPropConsumptions(),
      fetchPropMaintenances(),
    ])
      .then(([dashboard, themesData, themesItemsData, consumptionsData, maintenancesData]) => {
        setPropsDashboard(dashboard);
        setThemes(themesData);
        setThemesWithItems(themesItemsData);
        setConsumptions(consumptionsData);
        setMaintenances(maintenancesData);
        setPropsNotice("后端服务已联通，当前展示实时道具数据。");
      })
      .catch(() => {
        setPropsNotice("当前展示本地示例数据，启动后端服务后自动切换。");
        setPropsDashboard(createFallbackPropsDashboard());
        setThemes(localPropThemes);
        setThemesWithItems(createFallbackThemesWithItems());
        setConsumptions(createFallbackConsumptions());
        setMaintenances(createFallbackMaintenances());
      });
  }, []);

  const handlePropsDataChange = useCallback(() => {
    loadPropsData();
  }, [loadPropsData]);

  useEffect(() => {
    if (activeTab === "overview") {
      loadOverview();
    } else if (activeTab === "props" || activeTab === "inventory" || activeTab === "records") {
      loadPropsData();
    }
  }, [activeTab, loadOverview, loadPropsData]);

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <DashboardOutlined style={{ marginRight: "6px" }} />
          运营总览
        </span>
      ),
      children: (
        <>
          <section className="lead-grid">
            <article className="hero-panel">
              <span className="pill">{notice}</span>
              <Typography.Title level={2}>{overview.appName}</Typography.Title>
              <p>{overview.description}</p>
            </article>
            <MetricGrid items={overview.kpis} />
          </section>
          <FeatureStrip items={overview.features} />
          <section className="work-panel">
            <Typography.Title level={3}>运营任务流</Typography.Title>
            <OperationsTable records={overview.records} />
          </section>
        </>
      ),
    },
    {
      key: "props",
      label: (
        <span>
          <DashboardOutlined style={{ marginRight: "6px" }} />
          道具看板
        </span>
      ),
      children: (
        <div className="props-module">
          <div className="module-notice">
            <span className="pill">{propsNotice}</span>
          </div>
          <PropsDashboard dashboard={propsDashboard} />
        </div>
      ),
    },
    {
      key: "inventory",
      label: (
        <span>
          <ShoppingOutlined style={{ marginRight: "6px" }} />
          道具清单
        </span>
      ),
      children: (
        <div className="props-module">
          <div className="module-notice">
            <span className="pill">{propsNotice}</span>
          </div>
          <PropsInventory
            themesWithItems={themesWithItems}
            themes={themes}
            onDataChange={handlePropsDataChange}
          />
        </div>
      ),
    },
    {
      key: "records",
      label: (
        <span>
          <FileTextOutlined style={{ marginRight: "6px" }} />
          损耗维修记录
        </span>
      ),
      children: (
        <div className="props-module">
          <div className="module-notice">
            <span className="pill">{propsNotice}</span>
          </div>
          <PropsRecords
            consumptions={consumptions}
            maintenances={maintenances}
            onDataChange={handlePropsDataChange}
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_THEME.accent,
          colorText: APP_THEME.ink,
          colorBgBase: APP_THEME.paper,
          borderRadius: 8,
        },
      }}
    >
      <Layout className="app-shell">
        <Header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <Button type="primary" icon={<ApiOutlined />} href={REQUEST_MESSAGES.healthPath}>
            API Health
          </Button>
        </Header>
        <Content className="workspace">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="main-tabs"
            size="large"
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
