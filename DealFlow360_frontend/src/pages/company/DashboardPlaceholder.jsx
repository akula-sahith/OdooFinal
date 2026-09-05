import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/auth/useAuth';
import { usePermissions } from '../../hooks/auth/usePermissions';
import {
  Users,
  FileText,
  ShoppingCart,
  Package,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sliders,
  Zap,
  Building,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DashboardPlaceholder = () => {
  const { user, role, switchRole } = useAuth();
  const { permissions } = usePermissions();

  // Retrieve live local state counts (0 by default if no user items exist)
  const savedCustomers = JSON.parse(localStorage.getItem('dealflow360_customers') || '[]');
  const savedQuotations = JSON.parse(localStorage.getItem('dealflow360_quotations') || '[]');
  const savedProducts = JSON.parse(localStorage.getItem('dealflow360_products') || '[]');
  const savedOrders = JSON.parse(localStorage.getItem('dealflow360_orders') || '[]');

  const businessSteps = [
    { num: '1', title: 'Admin Configuration', desc: 'Products, Price Lists, Warehouses & Settings' },
    { num: '2', title: 'Sales Rep Quotation', desc: 'Add items, apply discounts, view deal margin' },
    { num: '3', title: 'Discount & Risk Check', desc: 'Automated threshold check (>15% escalates)' },
    { num: '4', title: 'Manager Approval', desc: 'Manager & Finance approval workflow' },
    { num: '5', title: 'Customer Negotiation', desc: 'Customer portal view, negotiation & confirmation' },
    { num: '6', title: 'Order Fulfillment', desc: 'Confirmed order fulfillment & billing' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title={`${role || 'Staff'} Executive Command Center`}
        subtitle="Smarter Quotes. Faster Approvals. Happier Customers."
        badgeText={`Role: ${role || 'Staff'}`}
        badgeVariant="plum"
      />

      {/* Brand Hero Banner with Large Handwritten Accent Tagline */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
                DealFlow<span className="text-[#714B67]">360</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/20">
                Sales Operations Platform
              </span>
            </div>

            {/* Handwritten Accent Script Font — Large Prominent Size */}
            <div className="pt-1">
              <span className="font-handwritten text-2xl sm:text-3xl font-bold text-[#714B67] block">
                From Quote to Growth — People | Process | Possibilities
              </span>
            </div>
          </div>

          <Link
            to="/company/profile"
            className="px-4 py-2.5 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4 text-white" /> View Worker Profile
          </Link>
        </div>
      </div>

      {/* End-to-End Business Flow Pipeline Architecture */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#714B67]" /> End-to-End Sales Operations Flow
          </h3>
          <span className="text-xs font-bold text-slate-500">Automated Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {businessSteps.map((step) => (
            <div
              key={step.num}
              className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2 hover:border-[#714B67]/40 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#714B67] text-white text-xs font-bold flex items-center justify-center">
                {step.num}
              </div>
              <h4 className="text-xs font-extrabold text-slate-900">{step.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Executive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Authorized Workspace Operations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#714B67]" /> Operational Modules & Live Directories
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {permissions.length} Granted Permissions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Directory */}
              <Link
                to="/company/customers"
                className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-800 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Customer Directory</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                    {savedCustomers.length} Accounts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Manage B2B client accounts and automated tiering.</p>
              </Link>

              {/* Sales Quotations */}
              <Link
                to="/company/quotations"
                className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F7F2F5] text-[#714B67] flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Sales Quotations</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                    {savedQuotations.length} Proposals
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Create draft quotes and approval workflows.</p>
              </Link>

              {/* Sales Orders */}
              <Link
                to="/company/orders"
                className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-800 flex items-center justify-center font-bold">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Sales Orders</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                    {savedOrders.length} Orders
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Confirmed orders and fulfillment tracking.</p>
              </Link>

              {/* Master Product Catalog */}
              <Link
                to="/company/products"
                className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-800 flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Product Catalog</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                    {savedProducts.length} SKUs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Browse catalog SKUs, prices, and unit specs.</p>
              </Link>

              {(role === 'Admin' || role === 'Sales Manager') && (
                <>
                  <Link
                    to="/company/users"
                    className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#F7F2F5] text-[#714B67] flex items-center justify-center font-bold">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Staff Personnel</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#714B67]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Staff management and department roles.</p>
                  </Link>

                  <Link
                    to="/company/roles"
                    className="p-4 bg-slate-50/80 hover:bg-[#F7F2F5] border border-slate-200/80 hover:border-[#714B67]/40 rounded-xl transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#F7F2F5] text-[#714B67] flex items-center justify-center font-bold">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">RBAC Security Matrix</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#714B67]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Security roles and permission clearance rules.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Security Clearance & Role Switcher */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-[#714B67]" /> Active Security Role
            </h3>

            <div className="p-3.5 bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl space-y-1">
              <span className="text-[10px] font-extrabold text-[#714B67] uppercase tracking-wider">Current Role</span>
              <p className="text-sm font-extrabold text-[#714B67]">{role || 'Company Staff'}</p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Switch Active View Role:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => switchRole('Admin')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Admin' ? 'bg-[#714B67] text-white border-[#714B67]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => switchRole('Sales Manager')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Sales Manager' ? 'bg-[#714B67] text-white border-[#714B67]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => switchRole('Salesperson')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Salesperson' ? 'bg-[#714B67] text-white border-[#714B67]' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
