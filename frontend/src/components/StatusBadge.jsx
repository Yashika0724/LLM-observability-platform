export default function StatusBadge({ status }) {
  const styles = status === "success" ? "bg-mint text-green-800" : "bg-blush text-red-700";

  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles}`}>{status}</span>;
}
