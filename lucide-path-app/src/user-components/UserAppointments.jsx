import React, { useEffect, useState, useContext } from 'react';
import { Calendar, MapPin, Clock, Star, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContent';

const UserAppointments = () => {
  const { backendUrl } = useContext(AppContent);
  const { userData, getUserData } = useContext(AppContent);
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    dateTime: '',
    type: 'Consult',
    mode: 'Video',
    notes: '',
  });
  const [booking, setBooking] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchTherapists();
    if (!userData) getUserData();
  }, []);

  useEffect(() => {
    // Filter therapists based on search term
    if (searchTerm.trim() === '') {
      setFilteredTherapists(therapists);
    } else {
      const filtered = therapists.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTherapists(filtered);
    }
  }, [searchTerm, therapists]);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/therapists`);
      if (data.success) {
        console.log('Therapists fetched:', data.data); // Log the response
        setTherapists(data.data || []);
        setFilteredTherapists(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch therapists');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching therapists');
      console.error('fetchTherapists error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    try {
      if (!bookingData.dateTime) {
        toast.warning('Please select a date and time');
        return;
      }

      setBooking(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/appointments/book`,
        {
          providerId: selectedTherapist._id,
          ...bookingData,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Appointment booked successfully!');
        setBookingModal(false);
        setSelectedTherapist(null);
        setBookingData({ dateTime: '', type: 'Consult', mode: 'Video', notes: '' });
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error booking appointment');
      console.error('bookAppointment error:', err);
    } finally {
      setBooking(false);
    }
  };

  const handleImageError = (therapistId) => {
    setImageErrors(prev => ({ ...prev, [therapistId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071b1b] to-[#062b2b] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Find & Book a Therapist</h1>
              <p className="text-gray-400">Browse our network of available therapists and schedule your appointment</p>
            </div>
            <div className="flex items-center gap-3">
              {userData?.profileImageUrl ? (
                <img src={userData.profileImageUrl} alt="you" className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white">🙂</div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-300">You</div>
                <div className="text-white font-semibold">{userData ? `${userData.firstName} ${userData.lastName}` : 'Guest'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, profession, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading therapists...</p>
            </div>
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No therapists found matching your search.</p>
          </div>
        ) : (
          /* Therapists Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <div
                key={therapist._id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 hover:bg-white/8 transition"
              >
                {/* Profile Image */}
                <div className="aspect-square bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center overflow-hidden">
                  {therapist.profile && !imageErrors[therapist._id] ? (
                    <img
                      src={therapist.profile}
                      alt={therapist.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(therapist._id)}
                    />
                  ) : (
                    <div className="text-5xl">👨‍⚕️</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{therapist.name}</h3>
                    <p className="text-gold font-semibold">{therapist.title}</p>
                    <p className="text-sm text-gray-400">{therapist.profession}</p>
                  </div>

                  {/* Experience Badge */}
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-gold" />
                    <span className="text-sm text-gray-300">{therapist.experience} years experience</span>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-400 line-clamp-2">{therapist.bio}</p>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      setSelectedTherapist(therapist);
                      setBookingModal(true);
                    }}
                    className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-gold to-gold/80 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedTherapist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-[#071b1b] to-[#062b2b] border border-white/10 rounded-2xl max-w-md w-full p-8 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
              <p className="text-gray-400 text-sm">with {selectedTherapist.name}</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.dateTime}
                  onChange={(e) => setBookingData({ ...bookingData, dateTime: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold/50"
                />
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Appointment Type</label>
                <select
                  value={bookingData.type}
                  onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold/50"
                >
                  <option value="Consult">Consultation</option>
                  <option value="Therapy">Therapy Session</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Assessment">Assessment</option>
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <MapPin className="inline mr-2" size={16} />
                  Mode
                </label>
                <select
                  value={bookingData.mode}
                  onChange={(e) => setBookingData({ ...bookingData, mode: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold/50"
                >
                  <option value="Video">Video Call</option>
                  <option value="Phone">Phone Call</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Notes (Optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  placeholder="Any specific concerns or notes for the therapist..."
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setBookingModal(false);
                  setSelectedTherapist(null);
                }}
                className="flex-1 py-2 px-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={booking}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-gold to-gold/80 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition disabled:opacity-50"
              >
                {booking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAppointments;
