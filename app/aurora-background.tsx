export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob aurora-blob--violet absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full" />
      <div className="aurora-blob aurora-blob--cyan absolute top-20 -left-40 h-[600px] w-[600px] rounded-full" />
      <div className="aurora-blob aurora-blob--emerald absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.07),_transparent_38%)]" />
    </div>
  );
}
