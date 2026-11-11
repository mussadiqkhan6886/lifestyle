const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) => (
  <div className="rounded-xl border border-neutral-200 bg-white p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm text-neutral-500">{title}</p>
      <span className="text-neutral-400">{icon}</span>
    </div>

    <p className="mt-3 text-2xl font-semibold text-neutral-900">
      {value}
    </p>
  </div>
)


export default StatCard