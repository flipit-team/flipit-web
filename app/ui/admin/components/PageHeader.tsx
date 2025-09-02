'use client';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="typo-heading_mb text-text_one">{title}</h1>
        {description && (
          <p className="mt-2 typo-body_mr text-text_four max-w-4xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}