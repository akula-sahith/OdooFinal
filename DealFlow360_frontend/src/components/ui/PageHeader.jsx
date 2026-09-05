import React from 'react';
import { PageHeader as UIPageHeader } from './PageHeader/PageHeader';

export const PageHeader = ({
  title,
  subtitle,
  description,
  actions,
  action,
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
      actions={actions || action}
      action={action || actions}
      badge={badge}
      breadcrumbs={breadcrumbs}
      className={className}
    />
  );
};

export default PageHeader;
