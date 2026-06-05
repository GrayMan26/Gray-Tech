'use client'

interface Props {
  buses: string[]
  selected: string
  onSelect: (bus: string) => void
}

export default function CarSidebar({ buses, selected, onSelect }: Props) {
  const options = ['all', ...buses]
  return (
    <aside className="w-36 shrink-0 bg-gray-light border-r border-border flex flex-col">
      <p className="text-xs font-bold text-muted uppercase tracking-wider px-3 pt-3 pb-2">
        Filter by Car
      </p>
      <div className="flex-1 overflow-y-auto">
        {options.map(opt => {
          const label = opt === 'all' ? 'All Cars' : opt || '(No Bus #)'
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                selected === opt
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-border'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}