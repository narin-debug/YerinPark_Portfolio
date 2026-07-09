type PlaceholderProps = {
  label: string;
  className?: string;
};

export default function Placeholder({ label, className = "" }: PlaceholderProps) {
  return (
    <div className={`ph-box ${className}`}>
      <span>{label}</span>
    </div>
  );
}
