export default function Spinner({ className = '' }) {
  return (
    <span
      className={`material-symbols-outlined animate-spin text-primary ${className}`}
    >
      sync
    </span>
  );
}
