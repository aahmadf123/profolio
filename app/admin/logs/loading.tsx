export default function LogsLoading() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Logs</h1>
      <div className="bg-card rounded-lg shadow p-4 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-muted rounded mb-2 w-full"></div>
        <div className="h-4 bg-muted rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-muted rounded mb-2 w-4/6"></div>
      </div>
    </div>
  )
}

