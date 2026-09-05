import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  SearchInput,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Tabs,
  Tooltip,
  Alert,
  PageHeader,
  SectionHeader,
  Avatar,
} from '../../components/ui';
import {
  DataTable,
  Pagination,
} from '../../components/tables';
import {
  Modal,
  ConfirmationDialog,
  Drawer,
  Dropdown,
} from '../../components/dialogs';
import {
  useToast,
  Skeleton,
  EmptyState,
  ErrorState,
  PermissionDenied,
  NotFound,
} from '../../components/feedback';
import {
  Plus,
  Mail,
  Lock,
  Trash2,
  Edit,
  Download,
  Filter,
  CheckCircle,
  MoreVertical,
  Bell,
  Sparkles,
} from 'lucide-react';

export const UIShowcase = () => {
  const toast = useToast();

  // Component state toggles for interactive demos
  const [btnLoading, setBtnLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('monthly');
  const [switchOn, setSwitchOn] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('buttons');

  // Dialog & Overlay States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Table Demo State
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortCol, setSortCol] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);

  // Dummy UI Demonstration Data (For Showcase Only — Zero Business Logic)
  const demoColumns = [
    { key: 'name', label: 'Item Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (status) => <StatusBadge status={status} size="sm" />,
    },
    { key: 'value', label: 'Value', sortable: true },
  ];

  const demoData = [
    { id: '1', name: 'Enterprise License A', category: 'Software', status: 'ACTIVE', value: '$12,000' },
    { id: '2', name: 'Cloud Storage Tier 2', category: 'Infrastructure', status: 'PENDING', value: '$4,500' },
    { id: '3', name: 'Support SLA Tier 1', category: 'Services', status: 'APPROVED', value: '$8,200' },
    { id: '4', name: 'Legacy Plan Maintenance', category: 'Maintenance', status: 'INACTIVE', value: '$1,200' },
    { id: '5', name: 'Custom Hardware Node', category: 'Hardware', status: 'REJECTED', value: '$15,800' },
  ];

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rId) => rId !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(demoData.map((d) => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 space-y-8 max-w-7xl mx-auto text-left">
      {/* PAGE HEADER */}
      <PageHeader
        breadcrumbs={[
          { label: 'System', href: '#' },
          { label: 'Developer Foundation', href: '#' },
          { label: 'UI System Showcase' },
        ]}
        title="DealFlow360 Design System Showcase"
        description="Interactive visual test harness for Phase 2.5 reusable UI components. All future business modules must use these exact shared components."
        badge={<Badge variant="plum">Phase 2.5 Active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leadingIcon={Sparkles}
              onClick={() => toast.info('Design tokens & components initialized!')}
            >
              Test Toast System
            </Button>
          </div>
        }
      />

      {/* SHOWCASE CATEGORY TABS */}
      <Tabs
        tabs={[
          { id: 'buttons', label: 'Buttons & Controls' },
          { id: 'inputs', label: 'Form Inputs' },
          { id: 'data', label: 'Cards & Badges' },
          { id: 'table', label: 'DataTable & Skeletons' },
          { id: 'overlays', label: 'Modals & Drawers' },
          { id: 'feedback', label: 'Feedback & States' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 1. BUTTONS & CONTROLS */}
      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Button System</CardTitle>
              <CardDescription>Variants, sizes, loading states, and icon configurations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Button Variants */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Button Variants</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="link">Link Button</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Button Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Small (sm)</Button>
                  <Button variant="primary" size="md">Medium (md)</Button>
                  <Button variant="primary" size="lg">Large (lg)</Button>
                </div>
              </div>

              {/* Icon & Loading States */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Icons & Async Loading</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leadingIcon={Plus}>Add Item</Button>
                  <Button variant="outline" trailingIcon={Download}>Download Report</Button>
                  <Button
                    variant="primary"
                    isLoading={btnLoading}
                    loadingText="Saving Changes..."
                    onClick={() => {
                      setBtnLoading(true);
                      setTimeout(() => setBtnLoading(false), 2500);
                    }}
                  >
                    Click to Test Async Loading
                  </Button>
                  <Button variant="primary" disabled>Disabled State</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. FORM INPUTS */}
      {activeTab === 'inputs' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Input & Form System</CardTitle>
              <CardDescription>Input fields, selects, textareas, search, checkboxes, radios, and switches.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standard Text Input */}
              <Input
                label="Corporate Email Address"
                placeholder="name@company.com"
                required
                leadingIcon={Mail}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (e.target.value && !e.target.value.includes('@')) {
                    setInputError('Please enter a valid corporate email address.');
                  } else {
                    setInputError('');
                  }
                }}
                error={inputError}
                helperText="We'll use this for transaction updates."
              />

              {/* Password / Suffix Icon */}
              <Input
                label="Security Key"
                type="password"
                placeholder="••••••••••••"
                leadingIcon={Lock}
                success={inputValue.length > 5}
                helperText="Must contain at least 8 characters."
              />

              {/* Select */}
              <Select
                label="Organization Department"
                placeholder="Choose department..."
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                isClearable
                options={[
                  { value: 'sales', label: 'Sales & Distribution' },
                  { value: 'finance', label: 'Finance & Billing' },
                  { value: 'exec', label: 'Executive Management' },
                ]}
                helperText="Used for role-based permission routing."
              />

              {/* SearchInput */}
              <SearchInput
                placeholder="Search across products or customers..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={(term) => console.log('Searching:', term)}
                showShortcut
              />

              {/* Textarea */}
              <div className="md:col-span-2">
                <Textarea
                  label="Quotation Notes & Terms"
                  placeholder="Enter custom terms and conditions..."
                  maxLength={200}
                  helperText="Included on formal PDF documentation."
                />
              </div>

              {/* Checkbox & Switch */}
              <div className="space-y-4">
                <SectionHeader title="Selection Controls" />
                <Checkbox
                  label="Enable Automatic Order Processing"
                  description="System will automatically route approved quotes to order status."
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <Checkbox
                  label="Indeterminate Selection Example"
                  indeterminate
                />
              </div>

              {/* Radio Group & Switch */}
              <div className="space-y-4">
                <SectionHeader title="Preferences & Flags" />
                <RadioGroup
                  label="Billing Schedule"
                  value={radioValue}
                  onChange={setRadioValue}
                  options={[
                    { value: 'monthly', label: 'Monthly Billing', description: 'Billed on the 1st of every month.' },
                    { value: 'annual', label: 'Annual Contract', description: 'Save 15% on upfront payment.' },
                  ]}
                />

                <div className="pt-2">
                  <Switch
                    label="Email Digest Notifications"
                    description="Receive weekly activity summaries."
                    checked={switchOn}
                    onChange={setSwitchOn}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3. CARDS & BADGES */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Centralized Workflow Status Badges</CardTitle>
              <CardDescription>Single source of truth status styling defined in tokens.js.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <StatusBadge status="ACTIVE" />
              <StatusBadge status="INACTIVE" />
              <StatusBadge status="PENDING" />
              <StatusBadge status="APPROVED" />
              <StatusBadge status="REJECTED" />
              <StatusBadge status="DRAFT" />
              <StatusBadge status="SENT" />
              <StatusBadge status="ACCEPTED" />
              <StatusBadge status="EXPIRED" />
              <StatusBadge status="CANCELLED" />
              <StatusBadge status="PROCESSING" />
              <StatusBadge status="COMPLETED" />
            </CardContent>
          </Card>

          {/* Card Layout Variants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="standard">
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>Default border and subtle shadow.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Used for standard dashboard widgets and content panels.
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Prominent shadow elevation.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Used for high-priority focus panels or floating summary widgets.
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover hover states & scale micro-animation.</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Clickable card for navigation options or quick action selection.
              </CardContent>
            </Card>
          </div>

          {/* Avatars */}
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Avatar System</CardTitle>
              <CardDescription>Images, initials fallback, sizes, and status dots.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar name="Alexander Wright" size="xs" status="online" />
              <Avatar name="Sarah Jenkins" size="sm" status="away" />
              <Avatar name="Marcus Vance" size="md" status="busy" />
              <Avatar name="Emily Watson" size="lg" status="offline" />
              <Avatar name="DealFlow Admin" size="xl" status="online" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4. DATATABLE & SKELETONS */}
      {activeTab === 'table' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>DataTable Foundation</CardTitle>
                <CardDescription>Pure prop-driven data table layout with sorting and multi-row selection.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTableLoading((prev) => !prev)}
              >
                Toggle Loading Skeleton
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <DataTable
                columns={demoColumns}
                data={demoData}
                isLoading={tableLoading}
                selectable
                selectedRowIds={selectedRows}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                sortColumn={sortCol}
                sortDirection={sortDir}
                onSort={(col, dir) => {
                  setSortCol(col);
                  setSortDir(dir);
                }}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={5}
                pageSize={10}
                totalItems={48}
                onPageChange={setCurrentPage}
                onPageSizeChange={(sz) => toast.info(`Changed page size to ${sz}`)}
              />
            </CardContent>
          </Card>

          {/* Skeletons preview */}
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>Pre-layout shimmer place-holders for asynchronous loading states.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton variant="avatar" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="rectangle" height="80px" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 5. MODALS & DRAWERS */}
      {activeTab === 'overlays' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Overlays & Dialog Controls</CardTitle>
              <CardDescription>Accessible modals, confirmation dialogs, drawers, and dropdown menus.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal Dialog
              </Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Open Confirmation Dialog
              </Button>
              <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
                Open Slide-Over Drawer
              </Button>

              {/* Dropdown Menu Demo */}
              <Dropdown
                trigger={
                  <Button variant="secondary" trailingIcon={MoreVertical}>
                    Actions Menu
                  </Button>
                }
                items={[
                  { label: 'Edit Record', icon: Edit, onClick: () => toast.info('Edit clicked') },
                  { label: 'Export PDF', icon: Download, onClick: () => toast.success('Export initiated') },
                  { isSeparator: true },
                  { label: 'Delete Record', icon: Trash2, destructive: true, onClick: () => toast.error('Record deleted') },
                ]}
              />
            </CardContent>
          </Card>

          {/* Modal Demo */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Standard Modal Dialog"
            description="Accessible modal container with backdrop blur and Escape key handler."
            footer={
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Save Changes
                </Button>
              </>
            }
          >
            <p className="text-sm text-slate-600">
              This modal system can contain custom form inputs, detailed text, or status confirmations.
            </p>
          </Modal>

          {/* Confirmation Dialog Demo */}
          <ConfirmationDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              toast.success('Action confirmed successfully.');
              setIsConfirmOpen(false);
            }}
            variant="danger"
            title="Suspend User Account?"
            description="Are you sure you want to suspend this account? The user will lose immediate access to company resources."
            confirmText="Suspend User"
          />

          {/* Drawer Demo */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title="Slide-Over Detail Drawer"
            description="Used for side filters, full audit histories, or detail inspectors."
          >
            <div className="space-y-4">
              <Alert variant="info" title="Drawer System">
                Drawers slide gracefully from the right and adapt to 100% width on mobile screens.
              </Alert>
              <Input label="Filter Query" placeholder="Filter details..." />
            </div>
          </Drawer>
        </div>
      )}

      {/* 6. FEEDBACK & STATES */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <Card variant="standard">
            <CardHeader>
              <CardTitle>Toast Notification Trigger Test</CardTitle>
              <CardDescription>Centralized toast engine with auto-dismiss timers.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button variant="success" onClick={() => toast.success('Changes saved successfully!')}>
                Success Toast
              </Button>
              <Button variant="danger" onClick={() => toast.error('Unable to save changes to the backend.')}>
                Error Toast
              </Button>
              <Button variant="secondary" onClick={() => toast.warning('Your session will expire in 5 minutes.')}>
                Warning Toast
              </Button>
              <Button variant="outline" onClick={() => toast.info('System maintenance scheduled for midnight.')}>
                Info Toast
              </Button>
            </CardContent>
          </Card>

          {/* Inline Alerts */}
          <div className="space-y-4">
            <SectionHeader title="Inline Page & Section Alerts" />
            <Alert variant="info" title="System Information">
              This inline alert stays in place on the page until closed.
            </Alert>
            <Alert variant="warning" title="Warning Action Required">
              Please complete company profile details before creating quotations.
            </Alert>
            <Alert variant="error" title="Connection Interrupted">
              Network connection was lost. Retrying automatically.
            </Alert>
            <Alert variant="success" title="Verification Complete">
              All Phase 2.5 components are rendering correctly.
            </Alert>
          </div>

          {/* Empty & Error States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <Card variant="standard">
              <EmptyState title="No Customers Yet" description="Customer records will appear here once added." />
            </Card>
            <Card variant="standard">
              <ErrorState onRetry={() => toast.info('Retrying operation...')} />
            </Card>
            <Card variant="standard">
              <PermissionDenied onReturn={() => toast.info('Returned to dashboard')} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIShowcase;
