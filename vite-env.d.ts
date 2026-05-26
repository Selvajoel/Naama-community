import { useEffect, useState } from 'react';
import { Heart, Package, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useRouter, Link } from '../components/Router';

interface Donation {
  id: string;
  donation_type: string;
  food_type: string | null;
  quantity: string | null;
  amount: number | null;
  status: string;
  created_at: string;
  orphanages: {
    name: string;
  };
}

interface OrphanageDonation {
  id: string;
  donation_type: string;
  food_type: string | null;
  quantity: string | null;
  amount: number | null;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface OrphanageData {
  id: string;
  name: string;
  verification_status: string;
  city: string;
  district: string;
}

export function Dashboard() {
  const { user, profile } = useAuth();
  const { navigate } = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [receivedDonations, setReceivedDonations] = useState<OrphanageDonation[]>([]);
  const [orphanageData, setOrphanageData] = useState<OrphanageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      navigate('/signin');
      return;
    }

    fetchData();
  }, [user, profile]);

  const fetchData = async () => {
    if (!user || !profile) return;

    if (profile.user_type === 'donor') {
      const { data } = await supabase
        .from('donations')
        .select(`
          id,
          donation_type,
          food_type,
          quantity,
          amount,
          status,
          created_at,
          orphanages (name)
        `)
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setDonations(data as any);
    } else {
      const { data: orphanage } = await supabase
        .from('orphanages')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (orphanage) {
        setOrphanageData(orphanage);

        const { data: donationsData } = await supabase
          .from('donations')
          .select(`
            id,
            donation_type,
            food_type,
            quantity,
            amount,
            status,
            created_at,
            profiles (full_name, email)
          `)
          .eq('orphanage_id', orphanage.id)
          .order('created_at', { ascending: false });

        if (donationsData) setReceivedDonations(donationsData as any);
      }
    }

    setLoading(false);
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    const { error } = await supabase
      .from('donations')
      .update({ status: newStatus })
      .eq('id', donationId);

    if (!error) {
      fetchData();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.full_name}
          </h1>
          <p className="text-xl text-gray-600">
            {profile.user_type === 'donor' ? 'Track your donations and impact' : 'Manage your orphanage and donations'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {profile.user_type === 'donor' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {donations.length}
                  </div>
                  <div className="text-gray-600 font-medium">Total Donations</div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {donations.filter(d => d.status === 'pending').length}
                  </div>
                  <div className="text-gray-600 font-medium">Pending</div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {donations.filter(d => d.status === 'completed').length}
                  </div>
                  <div className="text-gray-600 font-medium">Completed</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Donations</h2>
                  <Link
                    to="/donate"
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold text-sm"
                  >
                    New Donation
                  </Link>
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't made any donations yet</p>
                    <Link
                      to="/donate"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold"
                    >
                      Make Your First Donation
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div key={donation.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-green-500 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {(donation.orphanages as any)?.name || 'Unknown Orphanage'}
                              </h3>
                              {getStatusBadge(donation.status)}
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              <div>
                                <span className="font-medium">Type:</span>{' '}
                                {donation.donation_type === 'food' ? 'Food Donation' : 'Fund Donation'}
                              </div>
                              {donation.donation_type === 'food' ? (
                                <>
                                  <div>
                                    <span className="font-medium">Food:</span> {donation.food_type}
                                  </div>
                                  <div>
                                    <span className="font-medium">Quantity:</span> {donation.quantity}
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <span className="font-medium">Amount:</span> ₹{donation.amount?.toLocaleString()}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Date:</span>{' '}
                                {new Date(donation.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {orphanageData ? (
                <>
                  <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{orphanageData.name}</h2>
                        <p className="text-gray-600">{orphanageData.city}, {orphanageData.district}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        orphanageData.verification_status === 'approved' ? 'bg-green-100 text-green-700' :
                        orphanageData.verification_status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {orphanageData.verification_status.charAt(0).toUpperCase() + orphanageData.verification_status.slice(1)}
                      </span>
                    </div>

                    {orphanageData.verification_status === 'pending' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <p className="text-orange-900 text-sm">
                          Your orphanage registration is under review. You'll be notified once it's approved.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Received Donations</h2>

                    {receivedDonations.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No donations received yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {receivedDonations.map((donation) => (
                          <div key={donation.id} className="border-2 border-gray-100 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    From: {(donation.profiles as any)?.full_name}
                                  </h3>
                                  {getStatusBadge(donation.status)}
                                </div>

                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>
                                    <span className="font-medium">Type:</span>{' '}
                                    {donation.donation_type === 'food' ? 'Food Donation' : 'Fund Donation'}
                                  </div>
                                  {donation.donation_type === 'food' ? (
                                    <>
                                      <div>
                                        <span className="font-medium">Food:</span> {donation.food_type}
                                      </div>
                                      <div>
                                        <span className="font-medium">Quantity:</span> {donation.quantity}
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      <span className="font-medium">Amount:</span> ₹{donation.amount?.toLocaleString()}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium">Date:</span>{' '}
                                    {new Date(donation.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {donation.status === 'pending' && (
                              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => updateDonationStatus(donation.id, 'confirmed')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateDonationStatus(donation.id, 'cancelled')}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            {donation.status === 'confirmed' && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => updateDonationStatus(donation.id, 'completed')}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                >
                                  Mark as Completed
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orphanage Registered</h2>
                  <p className="text-gray-600 mb-6">
                    You need to register your orphanage to start receiving donations
                  </p>
                  <Link
                    to="/register-orphanage"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold"
                  >
                    Register Orphanage
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
