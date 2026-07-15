export function DashboardLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E6E8EB] border-t-[#353638]" />
        <p className="text-[14px] font-medium text-[#7E8185]">{label}</p>
      </div>
    </div>
  );
}
