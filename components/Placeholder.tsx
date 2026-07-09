type PlaceholderProps = {
  label: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Placeholder({ label, className = "", style }: PlaceholderProps) {
  return (
    <div className={`ph-box ${className}`} style={style}>
      <span>{label}</span>
    </div>
  );
}
