export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-floatSlow" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-floatMed" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-floatSlow" />
    </div>
  );
}
