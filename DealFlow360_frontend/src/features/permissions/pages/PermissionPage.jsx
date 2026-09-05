import React from 'react';
import { Shield, Key, Search, RotateCcw } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Card } from '../../../components/ui/Card/Card';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Button } from '../../../components/ui/Button/Button';
import { usePermissionsCatalogue } from '../hooks/usePermissionsCatalogue';
import { PermissionGroup } from '../components/PermissionGroup';

export const PermissionPage = () => {
  const { groups, loading, error, search, setSearch, refetch } = usePermissionsCatalogue();

  const totalTokens = groups.reduce((acc, g) => acc + g.permissions.length, 0);

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Permission Reference Catalogue"
        description="Centralized master repository of fine-grained capability tokens governing DealFlow360 RBAC security policy."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#714B67] text-xs font-bold font-mono">
            <Key className="w-4 h-4" />
            {totalTokens} Permission Tokens Defined
          </div>
        }
      />

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search by token string, domain, or capability description..."
            />
          </div>

          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch('')}
              className="text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Clear Search
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-slate-500 text-sm">
          Loading permission catalog definitions...
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
          {error}
        </div>
      ) : groups.length === 0 ? (
        <Card variant="default" padding="lg" className="text-center py-12">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No permission tokens match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or clear the filter to view all domain capabilities.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSearch('')} className="mt-4">
            Reset Filter
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <PermissionGroup key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionPage;
