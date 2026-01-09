import { LucideIcon } from 'lucide-react';

interface InfoFieldProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
}

export function InfoField({ icon: Icon, label, value }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {typeof value === 'string' ? <p className="font-medium">{value}</p> : value}
      </div>
    </div>
  );
}
