import { useEffect, useState } from 'react';
import { Heart, Utensils, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useRouter } from '../components/Router';

interface Orphanage {
  id: string;
  name: string;
  city: string;
  district: string;
}

export function Donate() {
  const { user, profile } = useAuth();
  const { navigate, currentPath } = useRouter();
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [donationType, setDonationType] = useState<'food' | 'fund'>('food');
  const [formData, setFormData] = useState({
    orphanage_id: '',
    food_type: '',
    quantity: '',
    amount: '',
    pickup_delivery_date: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrphanages();
    const urlParams = new URLSearchParams(window.location.search);
    const orphanageId = urlParams.get('orphanage');
    if (orphanageId) {
      setFormData(prev => ({ ...prev, orphanage_id: orphanageId }));
    }
  }, []);

  const fetchOrphanages = async () => {
    const { data } = await supabase
      .from('orphanages')
      .select('id, name, city, district')
      .eq('verification_status', 'approved')
      .order('name');

    if (data) setOrphanages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !profile) {
      navigate('/signin');
      return;
    }

    if (profile.user_type !== 'donor') {
      alert('Only donor accounts can make donations');
      return;
    }

    setLoading(true);

    const donationData = {
      donor_id: user.id,
      orphanage_id: formData.orphanage_id,
      donation_type: donationType,
      food_type: donationType === 'food' ? formData.food_type : null,
      quantity: donationType === 'food' ? formData.quantity : null,
      amount: donationType === 'fund' ? parseFloat(formData.amount) : null,
      pickup_delivery_date: formData.pickup_delivery_date || null,
      message: formData.message || null,
      status: 'pending',
    };

    const { error } = await supabase
      .from('donations')
      .insert(donationData);

    setLoading(false);

    if (error) {
      alert('Error creating donation: ' + error.message);
    } else {
      setSuccess(true);
      setFormData({
        orphanage_id: '',
        food_type: '',
        quantity: '',
        amount: '',
        pickup_delivery_date: '',
        message: '',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <Heart className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign In to Donate</h2>
          <p className="text-gray-600 mb-8">
            Please sign in or create an account to make a donation
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (profile.user_type !== 'donor') {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <Heart className="h-16 w-16 text-orange-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Donor Account Required</h2>
          <p className="text-gray-600">
            You need a donor account to make donations. Orphanage accounts cannot donate.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-green-600 fill-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-8">
            Your donation has been submitted successfully. The orphanage will be notified and will contact you to coordinate delivery.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 fill-current" />
            <span>Make a Difference</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Donate Today
          </h1>

          <p className="text-xl text-gray-600">
            Choose to donate food or funds to support orphanages across Tamil Nadu
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Donation Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDonationType('food')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    donationType === 'food'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Utensils className={`h-8 w-8 mx-auto mb-3 ${donationType === 'food' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className={`font-semibold ${donationType === 'food' ? 'text-green-900' : 'text-gray-700'}`}>
                    Food Donation
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Donate meals or food items
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDonationType('fund')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    donationType === 'fund'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <DollarSign className={`h-8 w-8 mx-auto mb-3 ${donationType === 'fund' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className={`font-semibold ${donationType === 'fund' ? 'text-green-900' : 'text-gray-700'}`}>
                    Fund Donation
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Contribute financially
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Orphanage <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.orphanage_id}
                  onChange={(e) => setFormData({ ...formData, orphanage_id: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                >
                  <option value="">Choose an orphanage...</option>
                  {orphanages.map((orphanage) => (
                    <option key={orphanage.id} value={orphanage.id}>
                      {orphanage.name} - {orphanage.city}, {orphanage.district}
                    </option>
                  ))}
                </select>
              </div>

              {donationType === 'food' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Food Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rice, Dal, Vegetables, Prepared Meals"
                      value={formData.food_type}
                      onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 50 kg, 100 meals, 20 packets"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="Enter amount in rupees"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              )}

              {donationType === 'food' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Pickup/Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.pickup_delivery_date}
                    onChange={(e) => setFormData({ ...formData, pickup_delivery_date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Message (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Add a personal message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
