export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-8 animate-pulse">
          <div className="h-12 bg-muted/50 rounded-lg w-1/3"></div>
          <div className="h-6 bg-muted/50 rounded-lg w-1/2"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted/50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
