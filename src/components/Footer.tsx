export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 text-center mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-white text-xl font-bold mb-4">TICKET<span className="text-blue-500">PRO</span></h2>
        <p className="mb-6">The best platform to discover and book tickets for premium and free events worldwide.</p>
        <div className="flex justify-center gap-6 mb-8 text-sm">
          <a href="#" className="hover:text-white transition">About Us</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} TicketPro. All rights reserved.</p>
      </div>
    </footer>
  );
}
