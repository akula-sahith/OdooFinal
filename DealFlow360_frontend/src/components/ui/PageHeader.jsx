import React from 'react';
import { PageHeader as UIPageHeader } from './PageHeader/PageHeader';

export const PageHeader = ({
  title,
  subtitle,
  description,
  actions,
  badgeText,
  badge,
  badgeVariant = 'plum',
  className = '',
  breadcrumbs = [],
}) => {
  return (
    <UIPageHeader
      title={title}
      description={description || subtitle}
      actions={actions}
      badge={badge}
      breadcrumbs={breadcrumbs}
      className={className}
    />
  );
};

export default PageHeader;
