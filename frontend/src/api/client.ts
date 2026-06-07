import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  PropDashboardResponse,
  PropTheme,
  PropThemeWithItems,
  PropItem,
  PropConsumption,
  PropMaintenance,
} from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchPropsDashboard(): Promise<PropDashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/props/dashboard`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Props dashboard request failed: ${response.status}`);
  }

  return response.json() as Promise<PropDashboardResponse>;
}

export async function fetchPropThemes(): Promise<PropTheme[]> {
  const response = await fetch(`${API_BASE_URL}/props/themes`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Prop themes request failed: ${response.status}`);
  }

  return response.json() as Promise<PropTheme[]>;
}

export async function fetchPropThemesWithItems(): Promise<PropThemeWithItems[]> {
  const response = await fetch(`${API_BASE_URL}/props/themes/items`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Prop themes with items request failed: ${response.status}`);
  }

  return response.json() as Promise<PropThemeWithItems[]>;
}

export async function fetchPropItems(themeId?: number): Promise<PropItem[]> {
  const url = themeId
    ? `${API_BASE_URL}/props/items?themeId=${themeId}`
    : `${API_BASE_URL}/props/items`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Prop items request failed: ${response.status}`);
  }

  return response.json() as Promise<PropItem[]>;
}

export async function addPropItem(data: Partial<PropItem>): Promise<PropItem> {
  const response = await fetch(`${API_BASE_URL}/props/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Add prop item failed: ${response.status}`);
  }

  return response.json() as Promise<PropItem>;
}

export async function updatePropItem(id: number, data: Partial<PropItem>): Promise<PropItem> {
  const response = await fetch(`${API_BASE_URL}/props/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Update prop item failed: ${response.status}`);
  }

  return response.json() as Promise<PropItem>;
}

export async function deletePropItem(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/props/items/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Delete prop item failed: ${response.status}`);
  }

  return response.json() as Promise<{ success: boolean }>;
}

export async function restockPropItem(id: number, quantity: number): Promise<PropItem> {
  const response = await fetch(`${API_BASE_URL}/props/items/${id}/restock`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error(`Restock prop item failed: ${response.status}`);
  }

  return response.json() as Promise<PropItem>;
}

export async function updatePropInspection(
  id: number,
  lastCheckDate: string,
  nextCheckDate: string
): Promise<PropItem> {
  const response = await fetch(`${API_BASE_URL}/props/items/${id}/inspection`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ last_check_date: lastCheckDate, next_check_date: nextCheckDate }),
  });

  if (!response.ok) {
    throw new Error(`Update inspection failed: ${response.status}`);
  }

  return response.json() as Promise<PropItem>;
}

export async function addPropConsumption(
  data: Partial<PropConsumption>
): Promise<PropConsumption> {
  const response = await fetch(`${API_BASE_URL}/props/consumptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Add consumption failed: ${response.status}`);
  }

  return response.json() as Promise<PropConsumption>;
}

export async function fetchPropConsumptions(propItemId?: number): Promise<PropConsumption[]> {
  const url = propItemId
    ? `${API_BASE_URL}/props/consumptions?propItemId=${propItemId}`
    : `${API_BASE_URL}/props/consumptions`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Fetch consumptions failed: ${response.status}`);
  }

  return response.json() as Promise<PropConsumption[]>;
}

export async function addPropMaintenance(
  data: Partial<PropMaintenance>
): Promise<PropMaintenance> {
  const response = await fetch(`${API_BASE_URL}/props/maintenances`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Add maintenance failed: ${response.status}`);
  }

  return response.json() as Promise<PropMaintenance>;
}

export async function updatePropMaintenance(
  id: number,
  data: Partial<PropMaintenance>
): Promise<PropMaintenance> {
  const response = await fetch(`${API_BASE_URL}/props/maintenances/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Update maintenance failed: ${response.status}`);
  }

  return response.json() as Promise<PropMaintenance>;
}

export async function fetchPropMaintenances(propItemId?: number): Promise<PropMaintenance[]> {
  const url = propItemId
    ? `${API_BASE_URL}/props/maintenances?propItemId=${propItemId}`
    : `${API_BASE_URL}/props/maintenances`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Fetch maintenances failed: ${response.status}`);
  }

  return response.json() as Promise<PropMaintenance[]>;
}
