import { Link, useMatchRoute } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Newspaper, Home, Info } from 'lucide-react'
import { cn } from '@admin/src/utils/tw'

const navList = [
  {
    icon: <Home />,
    to: '/',
    text: 'Home',
  },
  {
    icon: <Info />,
    to: '/aboutUs',
    text: 'About Us'
  },
  {
    icon: <Newspaper />,
    to: '/news',
    text: 'News',
  },
]

function NavItem({ item }: { item: (typeof navList)[0] }) {
  const matchRoute = useMatchRoute();

  return (
    <Link
      to={item.to}
      className={cn(
        'md:w-full md:max-w-[200px] h-full px-4 flex items-center max-md:justify-center',
        matchRoute({ to: item.to }) && 'bg-primary/10 border-b-2 border-primary [&_svg]:fill-white font-medium text-lg',
      )}
    >
      <span className="md:mr-2">{item.icon}</span>
      <span className='max-md:hidden'>{item.text}</span>
    </Link>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-base-200 flex items-stretch px-4 backdrop-blur-lg">
      <img src="/logo.png" width={32} className="shrink-0 my-2" />

      <div className="flex w-full justify-center">
        {navList.map((item) => (
          <NavItem item={item} />
        ))}
      </div>
    </header>
  )
}
