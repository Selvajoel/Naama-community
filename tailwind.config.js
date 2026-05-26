import { useEffect, useState } from 'react';
import { Search, MapPin, Users, Heart, ArrowRight } from 'lucide-react';
import { Link } from '../components/Router';
import { supabase } from '../lib/supabase';

interface Orphanage {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  capacity: number;
  description: string | null;
  current_needs: string | null;
  contact_person: string;
  contact_phone: string;
}

const TAMIL_NADU_DISTRICTS = [
  'All Districts',
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam',
  'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
  'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
  'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur',
  'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar'
];

export function Orphanages() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [filteredOrphanages, setFilteredOrphanages] = useState<Orphanage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrphanages();
  }, []);

  useEffect(() => {
    filterOrphanages();
  }, [orphanages, searchQuery, selectedDistrict]);

  const fetchOrphanages = async () => {
    const { data, error } = await supabase
      .from('orphanages')
      .select('*')
      .eq('verification_status', 'approved')
      .order('name');

    if (!error && data) {
      setOrphanages(data);
    }
    setLoading(false);
  };

  const filterOrphanages = () => {
    let filtered = [...orphanages];

    if (selectedDistrict !== 'All Districts') {
      filtered = filtered.filter(o => o.district === selectedDistrict);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.name.toLowerCase().includes(query) ||
        o.city.toLowerCase().includes(query) ||
        o.district.toLowerCase().includes(query)
      );
    }

    setFilteredOrphanages(filtered);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 fill-current" />
              <span>Verified Partners</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Orphanages Directory
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse verified orphanages and children's homes across Tamil Nadu.
              Every organization has been carefully verified to ensure your donations reach those who need them most.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                {TAMIL_NADU_DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredOrphanages.length}</span> orphanage{filteredOrphanages.length !== 1 ? 's' : ''}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading orphanages...</p>
            </div>
          ) : filteredOrphanages.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orphanages found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrphanages.map((orphanage) => (
                <div
                  key={orphanage.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-green-500 overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-6">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Heart className="h-7 w-7 text-white fill-white" />
                      </div>
                      <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium rounded-full flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{orphanage.capacity}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {orphanage.name}
                    </h3>

                    <div className="flex items-start space-x-2 text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        <div>{orphanage.city}</div>
                        <div className="text-gray-500">{orphanage.district} District</div>
                      </div>
                    </div>

                    {orphanage.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {orphanage.description}
                      </p>
                    )}

                    {orphanage.current_needs && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <div className="text-xs font-semibold text-orange-700 mb-1">Current Needs:</div>
                        <div className="text-sm text-orange-900 line-clamp-2">{orphanage.current_needs}</div>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="text-xs text-gray-500 mb-3">
                        Contact: {orphanage.contact_person}
                      </div>

                      <Link
                        to={`/donate?orphanage=${orphanage.id}`}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold group"
                      >
                        <span>Donate Now</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
