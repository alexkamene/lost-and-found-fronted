import Link from 'next/link';
import { HomeIcon, PlusCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <>
      {/* Desktop / Large screens */}
      <nav className="hidden md:flex bg-gray-800 text-white p-4 justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">Lost & Found</Link>
        </div>
        <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-200 flex items-center gap-1">
            Home
          </Link><Link href="/about" className="hover:text-gray-200 flex items-center gap-1">
            About
          </Link>
          <Link href="/profile" className="hover:text-gray-200 flex items-center gap-1">
            Contact Us
          </Link>
          <Link href="/dashboard/user" className="hover:text-gray-200 flex items-center gap-1">
            Browse
          </Link>
          <Link href="/dashboard/user/report" className="hover:text-gray-200 flex items-center gap-1">
          Report
          </Link>
          <Link href="/profile" className="hover:text-gray-200 flex items-center gap-1">
            Profile
          </Link>
        </div>
      </nav>

      {/* Mobile / Small screens - fixed bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full  bg-gray-800 text-white flex justify-around items-center  p-2 border-t border-gray-300">
        <Link href="/dashboard/user" className="flex flex-col items-center text-xs">
          <HomeIcon className="w-6 h-6" />
          <span>Browse</span>
        </Link>
        <Link href="/dashboard/user/report" className="flex flex-col items-center text-xs">
          <PlusCircleIcon className="w-6 h-6" />
          <span>Report</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-xs">
          <UserCircleIcon className="w-6 h-6" />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}
