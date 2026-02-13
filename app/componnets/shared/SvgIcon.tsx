// components/shared/SvgIcon.tsx
interface SvgIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function SvgIcon({ name, size = 18, className = "" }: SvgIconProps) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
}