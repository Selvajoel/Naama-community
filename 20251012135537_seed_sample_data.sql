import { useEffect, useState } from 'react';
import { Heart, Users, TrendingUp, ArrowRight, Utensils, DollarSign, Truck } from 'lucide-react';
import { Link } from '../components/Router';
import { supabase } from '../lib/supabase';

interface Orphanage {
  id: string;
  name: string;
  city: string;
  district: string;
  description: string | null;
  capacity: number;
}

interface ImpactMetrics {
  total_meals_donated: number;
  total_orphanages_served: number;
  total_donors: number;
  total_funds_raised: number;
}

interface Testimonial {
  id: string;
  content: string;
  author_name: string;
}

export function Home() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: orphanageData } = await supabase
      .from('orphanages')
      .select('id, name, city, district, description, capacity')
      .eq('verification_status', 'approved')
      .limit(3);

    if (orphanageData) setOrphanages(orphanageData);

    const { data: metricsData } = await supabase
      .from('impact_metrics')
      .select('*')
      .maybeSingle();

    if (metricsData) setMetrics(metricsData);

    const { data: testimonialData } = await supabase
      .from('testimonials')
      .select('id, content, author_name')
      .eq('is_featured', true)
      .limit(3);

    if (testimonialData) setTestimonials(testimonialData);
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-green-50 via-white to-orange-50 pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 fill-current" />
              <span>Serving Tamil Nadu with Love</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Feeding Hope.<br />
              Building Bridges.<br />
              <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                Sharing Meals.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Connect with orphanages across Tamil Nadu and make a difference in a child's life.
              Every meal matters. Every contribution counts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/donate"
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg flex items-center space-x-2"
              >
                <span>Donate Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/register-orphanage"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg font-semibold text-lg border-2 border-gray-200"
              >
                Register Orphanage
              </Link>
            </div>
          </div>
        </div>
      </section>

      {metrics && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                  <Utensils className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_meals_donated.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Meals Donated</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                  <Heart className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_orphanages_served}+
                </div>
                <div className="text-gray-600 font-medium">Orphanages Served</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_donors}+
                </div>
                <div className="text-gray-600 font-medium">Active Donors</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₹{(metrics.total_funds_raised / 100000).toFixed(1)}L+
                </div>
                <div className="text-gray-600 font-medium">Funds Raised</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to make a meaningful impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 ml-8">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose to Donate</h3>
              <p className="text-gray-600 leading-relaxed">
                Select an orphanage from our verified list and decide whether to donate food or funds.
                Every contribution helps feed hungry children.
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 ml-8">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">We Match & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                We ensure your donation reaches the right place at the right time.
                Our platform handles all coordination seamlessly.
              </p>
            </div>

            <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 ml-8">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deliver & Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Your donation reaches the children who need it most. Track your impact and
                see the difference you're making in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {orphanages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Orphanages
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Registered and verified orphanages across Tamil Nadu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {orphanages.map((orphanage) => (
                <div
                  key={orphanage.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-green-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                      <Heart className="h-7 w-7 text-white fill-white" />
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {orphanage.capacity} children
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {orphanage.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {orphanage.city}, {orphanage.district}
                  </p>

                  {orphanage.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {orphanage.description}
                    </p>
                  )}

                  <Link
                    to={`/donate?orphanage=${orphanage.id}`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold group"
                  >
                    Donate Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/orphanages"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
              >
                View All Orphanages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-green-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Stories of Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Hear from the communities we serve
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-8 rounded-2xl shadow-lg"
                >
                  <div className="text-green-600 text-5xl font-serif mb-4">"</div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-10 text-green-50">
            Join hundreds of donors who are feeding hope and building bridges across Tamil Nadu
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Start Donating
            </Link>
            <Link
              to="/orphanages"
              className="px-8 py-4 bg-green-800 text-white rounded-xl hover:bg-green-900 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Explore Orphanages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
