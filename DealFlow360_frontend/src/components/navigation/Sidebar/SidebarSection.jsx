import React from 'react';
import { SidebarItem } from './SidebarItem';

export const SidebarSection = ({ section, collapsed = false, onItemClick }) => {
  if (!section.items || section.items.length === 0) return null;

  return (
    <div className="space-y-1 py-1">
      {!collapsed && (
        <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 select-none">
          {section.title}
        </h4>
      )}

      <div className="space-y-0.5">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};
