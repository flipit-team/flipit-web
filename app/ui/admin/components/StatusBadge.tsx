'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
    case 'accepted':
    case 'approved':
      return 'bg-green-100 text-green-800';
    
    case 'inactive':
    case 'pending':
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    
    case 'rejected':
    case 'blacklisted':
    case 'suspended':
    case 'failed':
      return 'bg-red-100 text-red-800';
    
    case 'draft':
    case 'paused':
      return 'bg-gray-100 text-gray-800';
    
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

export default function StatusBadge({ status, variant }: StatusBadgeProps) {
  let colorClass = '';
  
  if (variant) {
    switch (variant) {
      case 'success':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'warning':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'danger':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'info':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
    }
  } else {
    colorClass = getStatusColor(status);
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full typo-body_ss capitalize ${colorClass}`}>
      {status}
    </span>
  );
}