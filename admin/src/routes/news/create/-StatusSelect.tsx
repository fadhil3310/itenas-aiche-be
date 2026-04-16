import { useState, forwardRef } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  offset,
  flip,
  size,
  shift,
} from '@floating-ui/react'
import { Lock, Rss } from 'lucide-react'
import { PublishStatus } from '@backend/generated/prisma/enums'

interface StatusOption {
  value: PublishStatus
  label: string
  description: string
  icon: React.ReactNode
}

const options: StatusOption[] = [
  {
    value: PublishStatus.DRAFT,
    label: 'Draft',
    description: 'Berita tidak akan ditampilkan ke publik, cocok apabila penulisan artikel ingin dilanjutkan nanti',
    icon: <Lock size={16} className="opacity-80 shrink-0" />,
  },
  {
    value: PublishStatus.PUBLISHED,
    label: 'Published',
    description: 'Berita akan langsung ditampilkan ke publik',
    icon: <Rss size={16} className="opacity-80 shrink-0" />,
  },
]

interface StatusSelectProps {
  value?: PublishStatus
  onChange?: (value: PublishStatus) => void
}

export const StatusSelect = forwardRef<HTMLButtonElement, StatusSelectProps>(
function StatusSelect({ value, onChange }, ref) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<PublishStatus>(value ?? PublishStatus.DRAFT)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(4),
      flip(),
      shift()
    ],
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const selectedOption = options.find((o) => o.value === selected)

  function handleSelect(opt: StatusOption) {
    setSelected(opt.value)
    onChange?.(opt.value)
    console.log(opt.value)
    setIsOpen(false)
  }

  function mergeRefs(...refList: React.Ref<HTMLButtonElement>[]) {
    return (node: HTMLButtonElement | null) => {
      refList.forEach((r) => {
        if (typeof r === 'function') r(node)
        else if (r) (r as React.MutableRefObject<HTMLButtonElement | null>).current = node
      })
    }
  }

  return (
    <div className="w-full md:w-50 md:shrink-0">
      <button
        ref={mergeRefs(refs.setReference as React.Ref<HTMLButtonElement>, ref)}
        {...getReferenceProps()}
        className="select select-bordered w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedOption?.icon}
          <span className="truncate text-sm">{selectedOption?.label}</span>
        </div>
      </button>

      {/* Floating dropdown */}
      {isOpen && (
        <FloatingPortal>
          <ul
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="dropdown-content menu bg-base-100 rounded-box border border-base-300 z-50 p-1 shadow-lg"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  onClick={() => handleSelect(opt)}
                  className={`flex items-start gap-3 w-full text-left rounded-lg px-3 py-2 hover:bg-base-200 ${
                    selected === opt.value ? 'bg-base-200' : ''
                  }`}
                >
                  <span className="mt-0.5">{opt.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{opt.label}</span>
                      {selected === opt.value && (
                        <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-base-content/60 block leading-snug mt-0.5">
                      {opt.description}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </FloatingPortal>
      )}
    </div>
  )
})