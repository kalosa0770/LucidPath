import React, { useEffect, useState, useContext } from 'react';
import { CheckCircle, XCircle, Mail, Phone, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContent';

const ProviderApprovalList = () => {
  const { backendUrl } = useContext(AppContent);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/providers/pending`, {
        withCredentials: true,
      });
      if (data.success) {
        setPendingProviders(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch pending providers');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error fetching pending providers');
      console.error('fetchPendingProviders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId) => {
    try {
      setProcessing({ ...processing, [providerId]: 'approving' });
      const { data } = await axios.post(
        `${backendUrl}/api/providers/approve/${providerId}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Provider approved successfully!');
        setPendingProviders(pendingProviders.filter(p => p._id !== providerId));
      } else {
        toast.error(data.message || 'Failed to approve provider');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error approving provider');
      console.error('handleApprove error:', err);
    } finally {
      setProcessing({ ...processing, [providerId]: null });
    }
  };

  const handleReject = async (providerId) => {
    try {
      setProcessing({ ...processing, [providerId]: 'rejecting' });
      const { data } = await axios.post(
        `${backendUrl}/api/providers/reject/${providerId}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success('Provider rejected');
        setPendingProviders(pendingProviders.filter(p => p._id !== providerId));
      } else {
        toast.error(data.message || 'Failed to reject provider');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting provider');
      console.error('handleReject error:', err);
    } finally {
      setProcessing({ ...processing, [providerId]: null });
    }
  };

  return (
    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gold font-extrabold text-lg">Provider Approvals</h3>
        <span className="text-xs text-amber-300 bg-amber-300/20 px-3 py-1 rounded-full">
          {pendingProviders.length} pending
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-400">Loading pending providers...</div>
        </div>
      ) : pendingProviders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No pending provider approvals</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingProviders.map((provider) => (
            <div
              key={provider._id}
              className="p-4 bg-white/3 border border-white/5 rounded-lg hover:border-gold/30 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {provider.firstName} {provider.lastName}
                  </h4>
                  <p className="text-gold text-sm font-medium">{provider.title}</p>
                </div>
                <span className="text-xs bg-amber-300/20 text-amber-300 px-2 py-1 rounded">
                  Pending
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Profession</p>
                  <p className="text-white">{provider.profession}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Experience</p>
                  <p className="text-white">{provider.experience} years</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail size={16} className="text-gold" />
                  <span className="break-all">{provider.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone size={16} className="text-gold" />
                  <span>{provider.phone}</span>
                </div>
              </div>

              {/* Bio */}
              {provider.bio && (
                <div className="mb-4 text-sm">
                  <p className="text-gray-400 text-xs mb-1">Bio</p>
                  <p className="text-gray-300 line-clamp-2">{provider.bio}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => handleApprove(provider._id)}
                  disabled={processing[provider._id]}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {processing[provider._id] === 'approving' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(provider._id)}
                  disabled={processing[provider._id]}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition disabled:opacity-50"
                >
                  <XCircle size={16} />
                  {processing[provider._id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderApprovalList;
