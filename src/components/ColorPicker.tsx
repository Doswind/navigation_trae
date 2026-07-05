import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#14b8a6',
  '#84cc16',
  '#f97316',
  '#6366f1',
  '#d946ef',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-medium text-theme-secondary">{label}</label>}
      <div className="grid grid-cols-6 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
              value === color ? 'border-theme-primary' : 'border-transparent'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
