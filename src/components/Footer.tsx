import { Stethoscope } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">SmileCare</span>
            </div>
            <p className="text-gray-400">
              Providing world-class dental care with modern technology and a gentle touch.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Book Appointment</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Dental Street, Medical District</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: info@smilecare.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SmileCare Dental Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
