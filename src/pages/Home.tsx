import { Link } from 'react-router-dom';
import { Calendar, Shield, Clock, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-blue-50 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Smile is Our <span className="text-blue-600">Top Priority</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience world-class dental care with our team of expert professionals. We use the latest technology to ensure your comfort and health.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/services" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg shadow-blue-200"
                >
                  Book Appointment
                </Link>
                <Link 
                  to="/services" 
                  className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Our Services
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Modern Dental Clinic" 
                className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Certified</p>
                  <p className="font-bold text-gray-900">Top Dentists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SmileCare?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We combine expertise, compassion, and advanced technology to provide you with the best dental experience possible.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 rounded-2xl text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Technology</h3>
              <p className="text-gray-600">We use state-of-the-art equipment for precise diagnosis and comfortable treatments.</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-2xl text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600">Schedule your appointments online anytime with our convenient booking system.</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-2xl text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">Our AI assistant is available around the clock to answer your dental queries.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
