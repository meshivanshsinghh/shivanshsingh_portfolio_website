export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center">
        {/* ML Tensor Matrix Loader */}
        <div className="grid grid-cols-3 gap-1.5 mb-6">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 bg-foreground rounded-sm opacity-20 animate-pulse"
              style={{ animationDelay: `${(i % 3) * 150 + Math.floor(i / 3) * 100}ms`, animationDuration: '1.2s' }}
            />
          ))}
        </div>
        
        {/* Terminal Loading Text */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-muted-foreground animate-pulse">
            &gt; Loading neural weights...
          </p>
        </div>
      </div>
    </div>
  );
}
