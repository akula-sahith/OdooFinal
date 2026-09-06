import React, { useState, useEffect } from 'react';
import { productApi } from '../../api/productApi';
import { approvalApi } from '../../api/approvalApi';
import { fulfillmentApi } from '../../api/fulfillmentApi';
import { userApi } from '../../api/userApi';
import { Layout } from '../../components/common/Layout';
import {
  Settings,
  Plus,
  Users,
  Package,
  Warehouse,
  ShieldAlert,
  Layers,
  RefreshCw,
  Box,
  CheckCircle,
  TrendingUp,
  DollarSign,
  UserCheck,
  Building
} from 'lucide-react';

export const BackendConfigPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Master Lists
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Controls
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('user'); // 'user', 'product', 'warehouse', 'stock', 'tier', 'rule'
  const [actionLoading, setActionLoading] = useState(false);

  // New User Form State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('Password123!');
  const [userRole, setUserRole] = useState('SALES_REP');
  const [userTeamId, setUserTeamId] = useState('1');

  // New Product Form State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productTaxPercent, setProductTaxPercent] = useState('18.0');
  const [productCategoryId, setProductCategoryId] = useState('1');
  const [productIsSub, setProductIsSub] = useState(false);

  // New Warehouse Form State
  const [whName, setWhName] = useState('');
  const [whLocation, setWhLocation] = useState('');
  const [whFactor, setWhFactor] = useState('1.0');

  // Stock Adjustment Form State
  const [stockWhId, setStockWhId] = useState('');
  const [stockProdId, setStockProdId] = useState('');
  const [stockQtyChange, setStockQtyChange] = useState('50');

  // Governance Tier & Rule Form State
  const [tierName, setTierName] = useState('');
  const [tierMaxDisc, setTierMaxDisc] = useState('');
  const [ruleName, setRuleName] = useState('');
  const [ruleMinDisc, setRuleMinDisc] = useState('');

  const loadConfigData = async () => {
    setLoading(true);
    try {
      const [userRes, prodRes, catRes, whRes, stockRes, tierRes, ruleRes] = await Promise.all([
        userApi.getAllUsers().catch(() => []),
        productApi.getAllProducts().catch(() => []),
        productApi.getAllCategories().catch(() => []),
        fulfillmentApi.getAllWarehouses().catch(() => []),
        fulfillmentApi.getAllStock().catch(() => []),
        approvalApi.getAllDiscountTiers().catch(() => []),
        approvalApi.getAllApprovalRules().catch(() => []),
      ]);

      setUsers(Array.isArray(userRes) ? userRes : []);
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
      setWarehouses(Array.isArray(whRes) ? whRes : []);
      setStocks(Array.isArray(stockRes) ? stockRes : []);
      setTiers(Array.isArray(tierRes) ? tierRes : []);
      setRules(Array.isArray(ruleRes) ? ruleRes : []);
    } catch (e) {
      console.error('Config Data Load Error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigData();
  }, []);

  const openModalForTab = (tab) => {
    setModalType(tab);
    setShowModal(true);
  };

  // Submit User Creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert('Name and Email are required.');
      return;
    }
    setActionLoading(true);
    try {
      await userApi.createUser({
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        teamId: Number(userTeamId),
      });
      alert(`User "${userName}" (${userRole}) created successfully!`);
      setShowModal(false);
      setUserName('');
      setUserEmail('');
      setUserPassword('Password123!');
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to create user.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Product Creation
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice) {
      alert('Product name and price are required.');
      return;
    }
    setActionLoading(true);
    try {
      await productApi.createProduct({
        name: productName,
        categoryId: Number(productCategoryId || 1),
        basePrice: Number(productPrice),
        taxPercent: Number(productTaxPercent || 0),
        isSubscription: productIsSub,
        currency: 'USD',
      });
      alert(`Product "${productName}" added to catalog successfully!`);
      setShowModal(false);
      setProductName('');
      setProductPrice('');
      setProductIsSub(false);
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to create product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Warehouse Creation
  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    if (!whName) {
      alert('Warehouse name is required.');
      return;
    }
    setActionLoading(true);
    try {
      await fulfillmentApi.createWarehouse({
        name: whName,
        location: whLocation || 'Main Fulfillment Center',
        shippingWeightFactor: Number(whFactor || 1.0),
      });
      alert(`Warehouse "${whName}" created successfully!`);
      setShowModal(false);
      setWhName('');
      setWhLocation('');
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to create warehouse.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Stock Adjustment
  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!stockWhId || !stockProdId || !stockQtyChange) {
      alert('Please select warehouse, product, and quantity.');
      return;
    }
    setActionLoading(true);
    try {
      await fulfillmentApi.adjustStock(stockWhId, stockProdId, stockQtyChange);
      alert('Stock inventory adjusted successfully!');
      setShowModal(false);
      setStockWhId('');
      setStockProdId('');
      setStockQtyChange('50');
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to adjust stock.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Tier Creation
  const handleCreateTier = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await approvalApi.createDiscountTier({
        name: tierName,
        maxDiscountPercent: Number(tierMaxDisc),
      });
      setShowModal(false);
      setTierName('');
      setTierMaxDisc('');
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to create discount tier.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Rule Creation
  const handleCreateRule = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await approvalApi.createApprovalRule({
        name: ruleName,
        minDiscountPercent: Number(ruleMinDisc),
      });
      setShowModal(false);
      setRuleName('');
      setRuleMinDisc('');
      await loadConfigData();
    } catch (err) {
      alert(err.message || 'Failed to create approval rule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Map product ID to product name
  const getProductName = (prodId) => {
    const p = products.find((pr) => String(pr.id || pr.dbId) === String(prodId));
    return p ? p.name : `Product #${prodId}`;
  };

  // Map warehouse ID to warehouse name
  const getWarehouseName = (whId) => {
    const w = warehouses.find((wh) => String(wh.id) === String(whId));
    return w ? w.name : `Warehouse #${whId}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Navigation Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-blue-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-600 font-bold uppercase tracking-wider">SYSTEM ADMIN CONSOLE</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                Backend Connected
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Settings className="w-6 h-6 text-sky-600" />
              Master Data &amp; Operations Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create Managers, Salespersons, Financial Staff, Catalog Products, Warehouses, and Live Stock Inventory
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadConfigData}
              className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => openModalForTab(activeTab)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'users' ? 'Create Staff User' : activeTab === 'products' ? 'Add New Product' : activeTab === 'warehouses' ? 'Add Warehouse Depot' : activeTab === 'inventory' ? 'Adjust Product Stock' : 'Add Rule / Tier'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'users' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff &amp; User Roles ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'products' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Products &amp; Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('warehouses')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'warehouses' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            Warehouses &amp; Depots ({warehouses.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'inventory' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            Stock Adjustments ({stocks.length})
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'governance' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Discount &amp; Approval Governance
          </button>
        </div>

        {/* Tab Content Display */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-mono">Loading Admin Master Data...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            {/* 1. USERS TAB */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-600" />
                      Staff Directory &amp; Access Roles ({users.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Manage Sales Managers, Salespersons, Financial Officers, and Administrators</p>
                  </div>

                  <button
                    onClick={() => openModalForTab('user')}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Staff User
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role Badge</th>
                        <th className="py-3 px-4">Team ID</th>
                        <th className="py-3 px-4">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400 italic">No users found.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id || u.dbId} className="hover:bg-slate-50/60">
                            <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-700 font-mono font-bold flex items-center justify-center text-xs border border-sky-200">
                                {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              {u.name || u.firstName ? `${u.name || `${u.firstName} ${u.lastName}`}` : 'Staff Member'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500">{u.email}</td>
                            <td className="py-3 px-4 font-mono">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  u.role === 'ADMIN'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : u.role === 'SALES_MANAGER'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : u.role === 'FINANCE'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {u.roleName || u.role || 'SALES_REP'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500">Team #{u.teamId || 1}</td>
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold">
                                ACTIVE
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Package className="w-4 h-4 text-sky-600" />
                      Master Product Catalog ({products.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Manage products, base list pricing, tax rates, and recurring subscription flags</p>
                  </div>

                  <button
                    onClick={() => openModalForTab('product')}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product to Catalog
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div
                      key={p.id || p.dbId}
                      className="bg-slate-50 border border-slate-200 hover:border-sky-300 p-4 rounded-xl space-y-2 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                        {p.isSubscription ? (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-mono font-semibold">
                            Subscription
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-semibold">
                            One-Time
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between pt-1 font-mono">
                        <span className="text-xs text-slate-500">Base Price:</span>
                        <span className="text-base font-extrabold text-sky-700">
                          ${Number(p.basePrice || p.price || 0).toFixed(2)} {p.isSubscription ? '/ mo' : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-2">
                        <span>Tax Rate: {p.taxPercent || 18}%</span>
                        <span>Currency: {p.currency || 'USD'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. WAREHOUSES TAB */}
            {activeTab === 'warehouses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-sky-600" />
                      Fulfillment Warehouses &amp; Logistics Depots ({warehouses.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Configure fulfillment depots for automated order splitting</p>
                  </div>

                  <button
                    onClick={() => openModalForTab('warehouse')}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Warehouse Depot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {warehouses.map((w) => (
                    <div key={w.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Building className="w-4 h-4 text-sky-600" />
                          {w.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          ID: #{w.id}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-sans">
                        Location: <span className="text-slate-800 font-medium">{w.location || 'Primary Hub'}</span>
                      </p>

                      <div className="pt-2 border-t border-slate-200 text-[11px] font-mono flex items-center justify-between text-slate-500">
                        <span>Weight Factor: {w.shippingWeightFactor || 1.0}</span>
                        <span className="text-emerald-700 font-bold">ACTIVE ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. INVENTORY STOCKS TAB */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Box className="w-4 h-4 text-sky-600" />
                      Live Inventory &amp; Product Stock Levels ({stocks.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Add and adjust product inventory quantities across warehouses</p>
                  </div>

                  <button
                    onClick={() => openModalForTab('stock')}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Adjust Product Stock (+/-)
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Warehouse Depot</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">On-Hand Stock</th>
                        <th className="py-3 px-4">Reserved Stock</th>
                        <th className="py-3 px-4">Available Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {stocks.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400 italic">No inventory stock records loaded. Use button above to add stock.</td>
                        </tr>
                      ) : (
                        stocks.map((st) => {
                          const onHand = Number(st.onHandAmount || st.onHand || 0);
                          const reserved = Number(st.reservedAmount || st.reserved || 0);
                          const available = Math.max(0, onHand - reserved);

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/60">
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {getWarehouseName(st.warehouseId)}
                              </td>
                              <td className="py-3 px-4 text-slate-800">
                                {getProductName(st.productId)}
                              </td>
                              <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{onHand} units</td>
                              <td className="py-3 px-4 font-mono text-amber-600">{reserved} units</td>
                              <td className="py-3 px-4 font-mono text-slate-900 font-extrabold">{available} units</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. GOVERNANCE TAB */}
            {activeTab === 'governance' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Customer Discount Tiers ({tiers.length})</h3>
                    <button
                      onClick={() => openModalForTab('tier')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200"
                    >
                      + Add Discount Tier
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {tiers.map((t) => (
                      <div key={t.id || t.dbId} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 font-mono text-xs">
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="text-amber-600">Max Discount Limit: {t.maxDiscountPercent || t.maxDiscount || 0}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Approval Routing Rules ({rules.length})</h3>
                    <button
                      onClick={() => openModalForTab('rule')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200"
                    >
                      + Add Approval Rule
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rules.map((r) => (
                      <div key={r.id || r.dbId} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 font-mono text-xs">
                        <div className="font-bold text-slate-900">{r.name}</div>
                        <div className="text-slate-500">Trigger Threshold: &gt;{r.minDiscountPercent || 15}% Discount</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Multi-Tab Creation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-md space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-600" />
                  {modalType === 'user'
                    ? 'Create Staff User'
                    : modalType === 'product'
                    ? 'Add Product to Catalog'
                    : modalType === 'warehouse'
                    ? 'Add Warehouse Depot'
                    : modalType === 'stock'
                    ? 'Adjust Product Stock'
                    : 'Add Governance Item'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                  ✕
                </button>
              </div>

              {/* USER CREATION FORM */}
              {modalType === 'user' && (
                <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="sarah.j@company.com"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Password</label>
                      <input
                        type="password"
                        required
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Role</label>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sky-700 font-mono font-semibold focus:outline-none focus:border-sky-500"
                      >
                        <option value="SALES_REP">Salesperson</option>
                        <option value="SALES_MANAGER">Sales Manager</option>
                        <option value="FINANCE">Financial / Finance Ops</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                    >
                      {actionLoading ? 'Creating...' : 'Save User Account'}
                    </button>
                  </div>
                </form>
              )}

              {/* PRODUCT CREATION FORM */}
              {modalType === 'product' && (
                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Product Name</label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. DealFlow Edge Router 5G"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Base Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="1499.00"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sky-700 font-mono font-bold focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={productTaxPercent}
                        onChange={(e) => setProductTaxPercent(e.target.value)}
                        placeholder="18.0"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Category</label>
                    <select
                      value={productCategoryId}
                      onChange={(e) => setProductCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    >
                      {categories.length > 0 ? (
                        categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value="1">Cloud &amp; Software SaaS</option>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="isSub"
                      checked={productIsSub}
                      onChange={(e) => setProductIsSub(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-0"
                    />
                    <label htmlFor="isSub" className="text-slate-800 font-semibold cursor-pointer">
                      Recurring Subscription Line Item (Monthly Billing)
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                    >
                      {actionLoading ? 'Saving...' : 'Add to Catalog'}
                    </button>
                  </div>
                </form>
              )}

              {/* WAREHOUSE CREATION FORM */}
              {modalType === 'warehouse' && (
                <form onSubmit={handleCreateWarehouse} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Depot / Warehouse Name</label>
                    <input
                      type="text"
                      required
                      value={whName}
                      onChange={(e) => setWhName(e.target.value)}
                      placeholder="e.g. Central Logistics Hub"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Location / Address</label>
                    <input
                      type="text"
                      value={whLocation}
                      onChange={(e) => setWhLocation(e.target.value)}
                      placeholder="Chicago, IL"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                    >
                      {actionLoading ? 'Saving...' : 'Create Warehouse Depot'}
                    </button>
                  </div>
                </form>
              )}

              {/* STOCK ADJUSTMENT FORM */}
              {modalType === 'stock' && (
                <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Target Warehouse Depot</label>
                    <select
                      required
                      value={stockWhId}
                      onChange={(e) => setStockWhId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    >
                      <option value="">-- Select Warehouse --</option>
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Select Product</label>
                    <select
                      required
                      value={stockProdId}
                      onChange={(e) => setStockProdId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p) => (
                        <option key={p.id || p.dbId} value={p.id || p.dbId}>
                          {p.name} (${Number(p.basePrice || 0).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Quantity Adjustment (+/-)</label>
                    <input
                      type="number"
                      required
                      value={stockQtyChange}
                      onChange={(e) => setStockQtyChange(e.target.value)}
                      placeholder="e.g. 50 or -10"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sky-700 font-mono text-base font-bold focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1"
                    >
                      {actionLoading ? 'Saving...' : 'Adjust Inventory Stock'}
                    </button>
                  </div>
                </form>
              )}

              {/* TIER CREATION FORM */}
              {modalType === 'tier' && (
                <form onSubmit={handleCreateTier} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Tier Name</label>
                    <input
                      type="text"
                      required
                      value={tierName}
                      onChange={(e) => setTierName(e.target.value)}
                      placeholder="e.g. Platinum Tier"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Max Discount Ceiling (%)</label>
                    <input
                      type="number"
                      required
                      value={tierMaxDisc}
                      onChange={(e) => setTierMaxDisc(e.target.value)}
                      placeholder="20"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                      Save Tier
                    </button>
                  </div>
                </form>
              )}

              {/* RULE CREATION FORM */}
              {modalType === 'rule' && (
                <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Rule Name</label>
                    <input
                      type="text"
                      required
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      placeholder="High Risk Discount Rule"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-mono uppercase text-[10px]">Min Discount (%) to Trigger</label>
                    <input
                      type="number"
                      required
                      value={ruleMinDisc}
                      onChange={(e) => setRuleMinDisc(e.target.value)}
                      placeholder="15"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl">
                      Save Rule
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
