import React from 'react';

interface PageSubheaderProps {
  title: string;
  description?: string;
  className?: string;
}
const PageSubheader = ({
  title,
  description,
  className,
}: PageSubheaderProps) => {
  return (
    <div className={className}>
      <h2 className="text-2xl">{title}</h2>
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );
};
export default PageSubheader;
