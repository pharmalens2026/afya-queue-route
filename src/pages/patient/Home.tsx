import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Activity, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Stethoscope,
  Baby,
  HeartPulse,
  Syringe,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { hospitals, language } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const t = {
    en: {
      heroTitle: 'Healthcare in Real-Time',
      heroSub: 'Find hospitals near you, see live queue times, and join virtually.',
      searchPlaceholder: 'Search hospitals, specialists, or services...',
      emergency: 'Find Emergency Care Now',
      categories: 'Popular Categories',
      nearby: 'Hospitals Near You',
      viewAll: 'View All',
      wait: 'Wait:',
      join: 'Join Queue',
      mins: 'mins',
      sections: {
        gen: 'General Consultation',
        specialist: 'Specialist Doctors',
        emergency: 'Emergency Care',
        diagnostics: 'Diagnostics'
      }
    },
    sw: {
      heroTitle: 'Huduma ya Afya kwa Wakati',
      heroSub: 'Pata hospitali karibu nawe, angalia foleni, na ujiunge kidijitali.',
      searchPlaceholder: 'Tafuta hospitali au daktari...',
      emergency: 'Pata Huduma ya Dharura Sasa',
      categories: 'Jamii Maarufu',
      nearby: 'Hospitali Karibu Nawe',
      viewAll: 'Tazama Zote',
      wait: 'Muda:',
      join: 'Jiunge Foleni',
      mins: 'dakika',
      sections: {
        gen: 'Ushauri wa Jumla',
        specialist: 'Madaktari Bingwa',
        emergency: 'Huduma ya Dharura',
        diagnostics: 'Vipimo'
      }
    }
  }[language];

  const categories = [
    { name: t.sections.gen, icon: Stethoscope, color: 'bg-blue-100 text-blue-700' },
    { name: t.sections.specialist, icon: Activity, color: 'bg-purple-100 text-purple-700' },
    { name: t.sections.emergency, icon: AlertCircle, color: 'bg-red-100 text-red-700' },
    { name: t.sections.diagnostics, icon: Syringe, color: 'bg-green-100 text-green-700' },
  ];

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden -mt-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/b9bbb050-2e00-4329-8696-dfe118cde763/clinic-interior-4c24e16a-1779049456235.webp" 
            className="w-full h-full object-cover opacity-20"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
        </div>

        <div className="relative z-10 container px-4 text-center max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8"
          >
            {t.heroSub}
          </motion.p>

          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input 
              className="pl-10 h-12 bg-white/80 backdrop-blur"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/hospitals')}
            />
          </div>
        </div>
      </section>

      {/* Emergency Button */}
      <div className="container px-4">
        <Button 
          variant="destructive" 
          className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-red-200 gap-3"
          onClick={() => navigate('/hospitals?emergency=true')}
        >
          <AlertCircle size={28} />
          {t.emergency}
        </Button>
      </div>

      {/* Categories */}
      <section className="container px-4">
        <h2 className="text-xl font-bold mb-4">{t.categories}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl flex flex-col items-center gap-3 cursor-pointer border transition-shadow hover:shadow-md ${cat.color}`}
              onClick={() => navigate(`/hospitals?category=${cat.name}`)}
            >
              <cat.icon size={32} />
              <span className="text-sm font-bold text-center">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Nearby Hospitals */}
      <section className="container px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t.nearby}</h2>
          <Button variant="link" className="gap-1 px-0" onClick={() => navigate('/hospitals')}>
            {t.viewAll} <ChevronRight size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          {filteredHospitals.map((hospital, idx) => (
            <Card key={hospital.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative w-full sm:w-48 h-32 sm:h-auto">
                    <img 
                      src={hospital.image} 
                      className="w-full h-full object-cover" 
                      alt={hospital.name} 
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-black hover:bg-white backdrop-blur">
                        <MapPin size={12} className="mr-1" /> {hospital.distance}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg">{hospital.name}</h3>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin size={14} /> {hospital.location}
                      </p>
                      
                      <div className="flex gap-2 mb-4">
                        {hospital.departments.slice(0, 2).map(d => (
                          <div key={d.id} className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1">
                            <Clock size={12} />
                            {d.name}: <b>{d.avgWaitTime}{t.mins}</b>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => navigate(`/hospital/${hospital.id}`)}>
                        {t.join}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => navigate(`/hospital/${hospital.id}`)}>
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;