/**
 * Settings API service.
 * GET /api/settings, PUT /api/settings
 */

import { api } from "@/lib/api/client";

export interface Settings {
  id?: number;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyWebsite?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  theme?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  securityAlerts?: boolean;
  twoFactorAuth?: boolean;
  sessionTimeout?: string;
  autoAssignApprover?: boolean;
  dailyBackup?: boolean;
  softDelete?: boolean;
  compactMode?: boolean;
  defaultApprovalFlow?: string;
  escalationSla?: string;
  retentionPeriod?: string;
  billingEmail?: string;
  currentPlan?: string;
  config?: Record<string, unknown>;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export async function getSettings(): Promise<Settings> {
  try {
    return await api.get<Settings>("/api/settings");
  } catch {
    return {};
  }
}

export async function updateSettings(input: Partial<Settings>): Promise<Settings> {
  return api.put<Settings>("/api/settings", input);
}
