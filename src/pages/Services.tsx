import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const { user } = useAuthState();
  const navigate = useNavigate();

  // Form state
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        // If no services in DB, use dummy data
        if (servicesData.length === 0) {
          setServices([
            { id: '1', name: 'Teeth Cleaning', description: 'Professional deep cleaning to remove plaque and tartar.', price: 99 },
            { id: '2', name: 'Teeth Whitening', description: 'Advanced laser whitening for a brighter, confident smile.', price: 199 },
            { id: '3', name: 'Dental Braces', description: 'Orthodontic treatment to straighten teeth and align your bite.', price: 2999 },
            { id: '4', name: 'Root Canal', description: 'Treatment to repair and save a badly damaged or infected tooth.', price: 899 },
          ]);
        } else {
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookClick = (service: Service) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingService(service);
    setSuccessMsg('');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bookingService) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: user.displayName || 'Patient',
        phone,
        date,
        time,
        service: bookingService.name,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setSuccessMsg('Appointment booked successfully!');
      setTimeout(() => {
        setBookingService(null);
        setSuccessMsg('');
        setPhone('');
        setDate('');
        setTime('');
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Dental Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive dental care tailored to your needs. Choose a service below to book an appointment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">{service.name}</h3>
                <span className="text-xl font-bold text-blue-600">${service.price}</span>
              </div>
              <p className="text-gray-600 mb-6 h-12">{service.description}</p>
              <button 
                onClick={() => handleBookClick(service)}
                className="w-full bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-medium py-3 rounded-lg transition-colors"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h2>
            <p className="text-gray-600 mb-6">Service: <span className="font-semibold">{bookingService.name}</span></p>
            
            {successMsg ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-medium">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setBookingService(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Booking...' : 'Confirm'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
