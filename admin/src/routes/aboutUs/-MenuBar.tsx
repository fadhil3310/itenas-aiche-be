import { Link } from '@tanstack/react-router'

export function MenuBar() {
  return (
    <div className="w-full flex justify-end gap-2">
      <Link to="/aboutUs/create" className="shrink-0">
        <button className="btn btn-primary">Buat baru</button>
      </Link>
    </div>
  )
}
