/**
 * Dashboard API service.
 * Tries GET /api/analytics/dashboard first; falls back to aggregating from module APIs.
 */

import { api } from "@/lib/api/client";
import { getProjects } from "./projects";
import { getInvoices } from "./invoices";
import { getPurchaseOrders } from "./purchase-orders";
import { getProposals } from "./proposal-penawaran";
import { getBasts } from "./bast";
import { getEmployees } from "./employees";
import { getTaxTypes } from "./tax-types";
import type { Project } from "@/project/types";

export interface DashboardMetrics {
  projects: { total: number; onProgress: number; completed: number; cancelled: number };
  invoices: { count: number; totalRevenue: number };
  purchaseOrders: { count: number };
  proposals: { total: number; draft: number; sent: number; accepted: number; rejected: number };
  basts: { count: number };
  employees: { count: number };
  taxTypes: { count: number };
}

export interface DashboardActivity {
  id: string;
  type: string;
  details: string;
  timestamp: string;
  entityType: "invoice" | "purchase_order" | "proposal" | "bast" | "project";
}

export interface DashboardSummary {
  metrics: DashboardMetrics;
  recentActivities: DashboardActivity[];
  activeProjects: Project[];
  revenueByProject: { projectId: string; projectName: string; income: number }[];
}

function getInvoiceTotal(invoice: { lineItems?: { priceAfterTax?: number; subtotal?: number }[] }): number {
  const items = invoice.lineItems ?? [];
  return items.reduce(
    (sum, item) => sum + (item.priceAfterTax ?? item.subtotal ?? 0),
    0
  );
}

const DEFAULT_METRICS: DashboardSummary["metrics"] = {
  projects: { total: 0, onProgress: 0, completed: 0, cancelled: 0 },
  invoices: { count: 0, totalRevenue: 0 },
  purchaseOrders: { count: 0 },
  proposals: { total: 0, draft: 0, sent: 0, accepted: 0, rejected: 0 },
  basts: { count: 0 },
  employees: { count: 0 },
  taxTypes: { count: 0 },
};

export async function getDashboardData(): Promise<DashboardSummary> {
  try {
    const res = await api.get<DashboardSummary>("/api/analytics/dashboard");
    if (res?.metrics) return res;
  } catch {
    // Fall through to aggregation
  }

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let invoices: Awaited<ReturnType<typeof getInvoices>> = [];
  let purchaseOrders: Awaited<ReturnType<typeof getPurchaseOrders>> = [];
  let proposals: Awaited<ReturnType<typeof getProposals>> = [];
  let basts: Awaited<ReturnType<typeof getBasts>> = [];
  let employees: Awaited<ReturnType<typeof getEmployees>> = [];
  let taxTypes: Awaited<ReturnType<typeof getTaxTypes>> = [];

  try {
    [projects, invoices, purchaseOrders, proposals, basts, employees, taxTypes] =
      await Promise.all([
        getProjects().catch(() => []),
        getInvoices().catch(() => []),
        getPurchaseOrders().catch(() => []),
        getProposals().catch(() => []),
        getBasts().catch(() => []),
        getEmployees().catch(() => []),
        getTaxTypes().catch(() => []),
      ]);
  } catch {
    return {
      metrics: DEFAULT_METRICS,
      recentActivities: [],
      activeProjects: [],
      revenueByProject: [],
    };
  }

  return aggregateDashboardFromRawData({
    projects,
    invoices,
    purchaseOrders,
    proposals,
    basts,
    employees,
    taxTypes,
  });
}

/** Aggregation logic for dashboard fallback. Exported for useDashboard hook cache population. */
export function aggregateDashboardFromRawData(data: {
  projects: Awaited<ReturnType<typeof getProjects>>;
  invoices: Awaited<ReturnType<typeof getInvoices>>;
  purchaseOrders: Awaited<ReturnType<typeof getPurchaseOrders>>;
  proposals: Awaited<ReturnType<typeof getProposals>>;
  basts: Awaited<ReturnType<typeof getBasts>>;
  employees: Awaited<ReturnType<typeof getEmployees>>;
  taxTypes: Awaited<ReturnType<typeof getTaxTypes>>;
}): DashboardSummary {
  const { projects, invoices, purchaseOrders, proposals, basts, employees, taxTypes } = data;

  const projectCounts = {
    total: projects.length,
    onProgress: projects.filter((p) => p?.identity?.status === "on_progress").length,
    completed: projects.filter((p) => p?.identity?.status === "completed").length,
    cancelled: projects.filter((p) => p?.identity?.status === "cancelled").length,
  };

  const invoiceTotal = invoices.reduce((sum, inv) => sum + getInvoiceTotal(inv), 0);

  const proposalCounts = {
    total: proposals.length,
    draft: proposals.filter((p) => p?.status === "draft").length,
    sent: proposals.filter((p) => p?.status === "sent").length,
    accepted: proposals.filter((p) => p?.status === "accepted").length,
    rejected: proposals.filter((p) => p?.status === "rejected").length,
  };

  const activities: DashboardActivity[] = [];

  invoices.forEach((inv) => {
    if (inv?.createdAt) {
      activities.push({
        id: `inv-${inv.id}`,
        type: "Invoice Created",
        details: `${inv.invoiceInfo?.invoiceNumber ?? ""} for ${inv.billingInfo?.companyName ?? ""}`,
        timestamp: inv.createdAt,
        entityType: "invoice",
      });
    }
  });

  purchaseOrders.forEach((po) => {
    if (po?.createdAt) {
      activities.push({
        id: `po-${po.id}`,
        type: "PO Added",
        details: `${po.orderInfo?.poNumber ?? ""} - ${po.vendorInfo?.vendorName ?? ""}`,
        timestamp: po.createdAt,
        entityType: "purchase_order",
      });
    }
  });

  proposals.forEach((p) => {
    if (p?.createdAt) {
      activities.push({
        id: `pp-${p.id}`,
        type: "Proposal Sent",
        details: `${p.proposalNumber ?? ""} - ${p.clientInfo?.clientName ?? ""}`,
        timestamp: p.createdAt,
        entityType: "proposal",
      });
    }
  });

  basts.forEach((b) => {
    if (b?.createdAt) {
      activities.push({
        id: `bast-${b.id}`,
        type: "BAST Created",
        details: `${b.documentInfo?.bastNumber ?? ""} - ${b.coverInfo?.companyName ?? ""}`,
        timestamp: b.createdAt,
        entityType: "bast",
      });
    }
  });

  projects.forEach((p) => {
    if (p?.createdAt) {
      activities.push({
        id: `prj-${p.id}`,
        type: "Project Started",
        details: `${p.identity?.namaProject ?? ""} - ${p.identity?.clientName ?? ""}`,
        timestamp: p.createdAt,
        entityType: "project",
      });
    }
  });

  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivities = activities.slice(0, 15);

  const activeProjects = projects.filter((p) => p?.identity?.status === "on_progress");

  const revenueByProject = projects
    .filter((p) => (p?.finance?.income ?? 0) > 0)
    .map((p) => ({
      projectId: p.id,
      projectName: p?.identity?.namaProject ?? "",
      income: p?.finance?.income ?? 0,
    }))
    .sort((a, b) => b.income - a.income);

  return {
    metrics: {
      projects: projectCounts,
      invoices: { count: invoices.length, totalRevenue: invoiceTotal },
      purchaseOrders: { count: purchaseOrders.length },
      proposals: proposalCounts,
      basts: { count: basts.length },
      employees: { count: employees.length },
      taxTypes: { count: taxTypes.length },
    },
    recentActivities,
    activeProjects,
    revenueByProject,
  };
}
