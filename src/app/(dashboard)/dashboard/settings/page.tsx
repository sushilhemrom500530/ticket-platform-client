import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { PiFlagBanner } from 'react-icons/pi'
import { VscLayoutMenubar } from 'react-icons/vsc'

export default function SettingsPage() {
    return <div>

        <div className="bg-white text-gray-900 w-full lg:w-4/5 mx-auto my-6">
            <div className="flex-1 overflow-y-auto py-10 px-6 space-y-2">
                <Link
                    href="/dashboard/settings/system"
                    className="flex items-center gap-3 p-4 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-primary"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>System Settings</span>
                </Link>
                <Link
                    href="/dashboard/settings/banner"
                    className="flex items-center gap-3 p-4 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-primary"
                >
                    <PiFlagBanner className="w-4 h-4" />
                    <span>Banner Settings</span>
                </Link>
                <Link
                    href="/dashboard/settings/menubar"
                    className="flex items-center gap-3 p-4 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-primary"
                >
                    <VscLayoutMenubar className="w-4 h-4" />
                    <span>Menubar Settings</span>
                </Link>
            </div>
        </div>
    </div>
}