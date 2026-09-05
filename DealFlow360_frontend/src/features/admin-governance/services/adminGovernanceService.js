/**
 * Phase 19 — Admin Governance & System Management Service Layer
 * Centralized service for Admin dashboard metrics, approval rules, tax configs, currency settings,
 * typed system settings, immutable audit logs, and security governance events.
 */

import { apiClient } from '../../../services/api/apiClient';
import { userService } from '../../users/services/userService';
import { roleService } from '../../roles/services/roleService';

// Fallback preview store for approval rules
let mockApprovalRules = [
  {
    id: 'rule_01',
    organizationId: 'org_main',
    name: 'Standard Discount Threshold',
    description: 'Discounts up to 10% auto-approved by salesperson.',
    ruleType: 'DISCOUNT_PERCENT',
    threshold: 10,
    approvalLevel: 1,
    approverRole: 'SALESPERSON',
    status: 'ACTIVE',
    priority: 1,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'rule_02',
    organizationId: 'org_main',
    name: 'Manager Approval Discount Tier',
    description: 'Discounts between 10% and 20% require Sales Manager approval.',
    ruleType: 'DISCOUNT_PERCENT',
    threshold: 20,
    approvalLevel: 2,
    approverRole: 'SALES_MANAGER',
    status: 'ACTIVE',
    priority: 2,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rule_03',
    organizationId: 'org_main',
    name: 'High Value Proposal Sign-off',
    description: 'Quotations exceeding $100,000 require Executive Finance approval.',
    ruleType: 'QUOTATION_VALUE',
    threshold: 100000,
    approvalLevel: 3,
    approverRole: 'FINANCE',
    status: 'ACTIVE',
    priority: 3,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

// Fallback preview store for tax configurations
let mockTaxConfigs = [
  {
    id: 'tax_01',
    name: 'Standard GST / VAT',
    code: 'GST-18',
    rate: 18.0,
    country: 'IN',
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
  },
  {
    id: 'tax_02',
    name: 'US State Sales Tax (Avg)',
    code: 'US-SALES-7',
    rate: 7.5,
    country: 'US',
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
  },
  {
    id: 'tax_03',
    name: 'EU Standard VAT',
    code: 'EU-VAT-20',
    rate: 20.0,
    country: 'EU',
    status: 'ACTIVE',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
  },
];

// Fallback preview store for system settings
let mockSystemSettings = [
  { key: 'orgName', value: 'DealFlow360 Enterprise', type: 'STRING', description: 'Legal Organization Name', scope: 'ORGANIZATION' },
  { key: 'baseCurrency', value: 'USD', type: 'ENUM', description: 'Default Base Currency', scope: 'ORGANIZATION' },
  { key: 'quotationValidityDays', value: 30, type: 'NUMBER', description: 'Default Quotation Expiration Days', scope: 'SALES' },
  { key: 'maxDiscountPercent', value: 25, type: 'NUMBER', description: 'Hard Maximum Permitted Discount %', scope: 'GOVERNANCE' },
  { key: 'mfaEnforced', value: true, type: 'BOOLEAN', description: 'Require MFA for Staff Sign-in', scope: 'SECURITY' },
  { key: 'autoLockInactivityMinutes', value: 15, type: 'NUMBER', description: 'Inactivity Lockout Duration (Minutes)', scope: 'SECURITY' },
  { key: 'notificationEmail', value: 'governance@dealflow360.com', type: 'STRING', description: 'Governance Alert Notification Recipient', scope: 'NOTIFICATION' },
];

// Fallback preview store for immutable audit logs
let mockAuditLogs = [
  {
    id: 'audit_101',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    user: 'System Administrator (admin@dealflow360.com)',
    action: 'APPROVAL_RULE_UPDATED',
    entity: 'ApprovalRule',
    entityId: 'rule_02',
    result: 'SUCCESS',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit_102',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    user: 'Sarah Jenkins (sarah.jenkins@dealflow360.com)',
    action: 'ROLE_ASSIGNED',
    entity: 'User',
    entityId: 'usr_rep_01',
    result: 'SUCCESS',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'audit_103',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    user: 'System Administrator (admin@dealflow360.com)',
    action: 'TAX_CONFIGURATION_UPDATED',
    entity: 'TaxConfig',
    entityId: 'tax_01',
    result: 'SUCCESS',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit_104',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    user: 'System Administrator (admin@dealflow360.com)',
    action: 'SYSTEM_SETTING_UPDATED',
    entity: 'SystemSetting',
    entityId: 'quotationValidityDays',
    result: 'SUCCESS',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'audit_105',
    timestamp: new Date(Date.now() - 1440 * 60000).toISOString(),
    user: 'Unknown Attacker',
    action: 'FAILED_LOGIN_ATTEMPT',
    entity: 'Auth',
    entityId: 'admin@dealflow360.com',
    result: 'DENIED',
    ipAddress: '203.0.113.42',
  },
];

export const adminGovernanceService = {
  /**
   * Fetch overview statistics for Admin Governance Dashboard
   */
  async getGovernanceDashboard() {
    try {
      const res = await apiClient.get('/admin/governance');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Synthesizing governance dashboard metrics.');
    }

    const usersRes = await userService.getUsers();
    const rolesRes = await roleService.getRoles();

    const users = usersRes?.data || [];
    const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;

    return {
      totalUsers: users.length || 42,
      activeUsers: activeUsers || 38,
      rolesCount: rolesRes?.data?.length || 7,
      permissionsCount: 24,
      activePriceLists: 5,
      approvalRulesCount: mockApprovalRules.length,
      warehousesCount: 3,
      pendingGovernanceIssues: 0,
      systemStatus: 'OPERATIONAL',
      recentAuditEvents: mockAuditLogs.slice(0, 5),
    };
  },

  /**
   * Approval Rules Management Methods
   */
  async getApprovalRules() {
    try {
      const res = await apiClient.get('/admin/approval-rules');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Returning approval rules.');
    }
    return mockApprovalRules;
  },

  async createApprovalRule(data) {
    try {
      return await apiClient.post('/admin/approval-rules', data);
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Adding to mock approval rules.');
      const newRule = {
        id: `rule_${Date.now()}`,
        organizationId: 'org_main',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      };
      mockApprovalRules.push(newRule);
      return newRule;
    }
  },

  async updateApprovalRuleStatus(id, status) {
    try {
      return await apiClient.patch(`/admin/approval-rules/${id}/status`, { status });
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Updating rule status.');
      const rule = mockApprovalRules.find((r) => r.id === id);
      if (rule) rule.status = status;
      return rule;
    }
  },

  /**
   * Tax Configuration Methods
   */
  async getTaxConfigurations() {
    try {
      const res = await apiClient.get('/admin/taxes');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Returning tax configurations.');
    }
    return mockTaxConfigs;
  },

  async createTaxConfiguration(data) {
    try {
      return await apiClient.post('/admin/taxes', data);
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Creating tax configuration.');
      const newTax = {
        id: `tax_${Date.now()}`,
        status: 'ACTIVE',
        ...data,
      };
      mockTaxConfigs.push(newTax);
      return newTax;
    }
  },

  /**
   * System Settings Methods
   */
  async getSystemSettings() {
    try {
      const res = await apiClient.get('/admin/settings');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Returning system settings.');
    }
    return mockSystemSettings;
  },

  async updateSystemSettings(newSettingsArray) {
    try {
      return await apiClient.patch('/admin/settings', { settings: newSettingsArray });
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Updating system settings preview store.');
      mockSystemSettings = newSettingsArray;
      return mockSystemSettings;
    }
  },

  /**
   * Immutable Audit Log Methods
   */
  async getAuditLogs(params = {}) {
    try {
      const res = await apiClient.get('/admin/audit-logs', { params });
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Returning audit log stream.');
    }

    let filtered = [...mockAuditLogs];
    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.user.toLowerCase().includes(term) ||
          a.action.toLowerCase().includes(term) ||
          a.entityId.toLowerCase().includes(term)
      );
    }
    if (params.result && params.result !== 'ALL') {
      filtered = filtered.filter((a) => a.result === params.result);
    }

    return {
      data: filtered,
      total: filtered.length,
    };
  },

  /**
   * Security Governance Methods
   */
  async getSecurityEvents() {
    try {
      const res = await apiClient.get('/admin/security/events');
      if (res && res.data) return res.data;
    } catch (e) {
      console.warn('[adminGovernanceService] Offline. Returning security events.');
    }

    return {
      activeSessionsCount: 4,
      failedLoginsToday: 1,
      mfaEnforcementStatus: 'ENFORCED',
      lockedAccounts: [
        { email: 'suspicious.login@external.com', attempts: 5, lockedAt: new Date(Date.now() - 7200000).toISOString() },
      ],
      recentSecurityLogs: mockAuditLogs.filter((a) => a.action.includes('FAILED') || a.action.includes('ROLE')),
    };
  },
};

export default adminGovernanceService;
