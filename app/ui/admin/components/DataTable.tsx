'use client';
import { ReactNode, useState } from 'react';
import { 
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  actions?: Array<{
    label: string;
    onClick: (row: any) => void;
    className?: string;
  }>;
  showSearch?: boolean;
  showFilters?: boolean;
  searchPlaceholder?: string;
}

export default function DataTable({
  title,
  columns,
  data,
  actions,
  showSearch = false,
  showFilters = false,
  searchPlaceholder = "Search..."
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="typo-heading_ss text-text_one">{title}</h3>
          <div className="flex items-center space-x-3">
            {showSearch && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            )}
            {showFilters && (
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg typo-body_sr text-text_two hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left typo-body_ss text-text_two uppercase tracking-wider whitespace-nowrap ${
                    index === 0 ? 'pl-6' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-right typo-body_ss text-text_two uppercase tracking-wider whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column, colIndex) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap typo-body_mr text-text_one ${
                      colIndex === 0 ? 'pl-6' : ''
                    }`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === rowIndex ? null : rowIndex)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                      {openDropdown === rowIndex && (
                        <>
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={() => {
                                    action.onClick(row);
                                    setOpenDropdown(null);
                                  }}
                                  className={`block w-full text-left px-4 py-2 typo-body_sr hover:bg-gray-100 ${
                                    action.className || 'text-text_two'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div
                            className="fixed inset-0 z-0"
                            onClick={() => setOpenDropdown(null)}
                          ></div>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="typo-body_mr text-text_four">No data found</p>
        </div>
      )}
    </div>
  );
}