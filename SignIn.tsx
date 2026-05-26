import { useEffect, useState } from 'react';
import { Heart, Target, Eye, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImpactMetrics {
  total_meals_donated: number;
  total_orphanages_served: number;
  total_donors: number;
  total_funds_raised: number;
}

export function About() {
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    const { data } = await supabase
      .from('impact_metrics')
      .select('*')
      .maybeSingle();

    if (data) setMetrics(data);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-green-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 fill-current" />
            <span>About Community Bridge</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Building Bridges of{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
              Compassion
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Community Bridge is a platform dedicated to connecting generous donors with orphanages
            and children's homes across Tamil Nadu, ensuring no child goes to bed hungry.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Community Bridge was born from a simple observation: while many generous individuals
                  and organizations wanted to donate food and resources, they often didn't know where
                  to direct their contributions. Meanwhile, orphanages struggled to communicate their
                  needs effectively.
                </p>
                <p>
                  We saw an opportunity to build a bridge between these two groups. Our platform
                  makes it easy for donors to find verified orphanages in Tamil Nadu and make
                  meaningful contributions, whether through food donations or financial support.
                </p>
                <p>
                  Today, we're proud to serve communities across Tamil Nadu, from Chennai to rural
                  districts, ensuring that every child has access to nutritious meals and the
                  care they deserve.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-orange-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                    <p className="text-gray-600">
                      To create a transparent, efficient platform that connects donors with orphanages,
                      ensuring every contribution makes a real difference in a child's life.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-gray-600">
                      A Tamil Nadu where no child goes hungry, and every orphanage has the support
                      it needs to provide nutritious meals and care to the children in their care.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Our Values</h3>
                    <p className="text-gray-600">
                      Transparency, compassion, efficiency, and community. We believe in building
                      trust through verified partnerships and measurable impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {metrics && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Together, we're making a real difference in Tamil Nadu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_meals_donated.toLocaleString()}+
                </div>
                <div className="text-gray-600 font-medium">Meals Donated</div>
                <p className="text-sm text-gray-500 mt-2">
                  Feeding hope, one meal at a time
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_orphanages_served}+
                </div>
                <div className="text-gray-600 font-medium">Orphanages Served</div>
                <p className="text-sm text-gray-500 mt-2">
                  Verified partners across Tamil Nadu
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {metrics.total_donors}+
                </div>
                <div className="text-gray-600 font-medium">Active Donors</div>
                <p className="text-sm text-gray-500 mt-2">
                  Community members making a difference
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600 fill-current" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₹{(metrics.total_funds_raised / 100000).toFixed(1)}L+
                </div>
                <div className="text-gray-600 font-medium">Funds Raised</div>
                <p className="text-sm text-gray-500 mt-2">
                  Supporting nutritious meals
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-white fill-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600">
                We lead with empathy and care for every child and community we serve
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                Every donation is tracked and verified for complete accountability
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">
                We ensure resources reach those who need them quickly and effectively
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Together, we build bridges that unite and uplift our communities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-2 text-green-50 italic">
            "Together, we build bridges so no child goes hungry in Tamil Nadu."
          </p>
        </div>
      </section>
    </div>
  );
}
