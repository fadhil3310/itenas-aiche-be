import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="w-full flex justify-end gap-2">
      <label className="max-md:w-full input">
        <Search width={16} />
        <input
          type="text"
          className="w-full grow"
          placeholder="Cari berita"
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
        />
      </label>

      <Link to="/news/create" className="shrink-0">
        <button className="btn btn-primary">Buat baru</button>
      </Link>
    </div>
  )
}
