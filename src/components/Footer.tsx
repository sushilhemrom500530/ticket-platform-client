export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-500 py-12 text-center mt-auto border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-slate-900 text-xl font-bold mb-4">TICKET<span className="text-blue-600">PRO</span></h2>
        <p className="mb-6 text-slate-600">The best platform to discover and book tickets for premium and free events worldwide.</p>
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <a href="#" className="hover:text-blue-600 transition text-slate-600">About Us</a>
          <a href="#" className="hover:text-blue-600 transition text-slate-600">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition text-slate-600">Terms of Service</a>
        </div>
        <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} TicketPro. All rights reserved.</p>
      </div>
    </footer>
  );
}
