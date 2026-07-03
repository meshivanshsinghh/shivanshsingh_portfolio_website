export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-6">
      {/* Tensor matrix visualization */}
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-sm bg-foreground/10 animate-pulse"
            style={{ animationDelay: `${i * 80}ms`, animationDuration: "1.2s" }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-mono text-foreground font-medium">
          Loading neural weights...
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          initializing attention layers
        </p>
      </div>
    </div>
  );
}
