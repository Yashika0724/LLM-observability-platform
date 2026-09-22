export default function StatusBadge({ status }) {
  const styles =
    status === "success"
      ? "bg-green-500/10 text-green-400"
      : "bg-red-500/10 text-red-400";

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles}`}>
      {status}
    </span>
  );
}
