import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Filter,
  CheckCircle2,
  Phone,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const HospitalList: React.FC = () => {
  const { hospitals, language } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  
  const initialCategory = searchParams.get('category') || '';
  const [category, setCategory] = useState(initialCategory);

  const t = {
    en: {
      title: 'Find Care',
      sub: 'Browse hospitals by location, service, or queue status.',
      filter: 'Filter',
      all: 'All Categories',
      emergency: 'Emergency',
      search: 'Search hospitals...',
      mins: 'mins wait'
    },
    sw: {
      title: 'Tafuta Huduma',
      sub: 'Vinjari hospitali kwa eneo, huduma, au hali ya foleni.',
      filter: 'Chuja',
      all: 'Jamii Zote',
      emergency: 'Dharura',
      search: 'Tafuta hospitali...',
      mins: 'dakika kusubiri'
    }
  }[language];

  const filtered = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                         h.services.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || h.services.includes(category) || h.departments.some(d => d.name === category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.sub}</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
            <Input 
              className="pl-10" 
              placeholder={t.search} 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={18} /> {category || t.filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategory('')}>{t.all}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory('Emergency')}>Emergency</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory('Surgery')}>Surgery</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory('Dental')}>Dental</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(hospital => (
          <Card key={hospital.id} className="overflow-hidden group hover:shadow-xl transition-all border-none shadow-md">
             <div className="relative h-48">
               <img src={hospital.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={hospital.name} />
               <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-black border-none backdrop-blur">
                    {hospital.distance}
                  </Badge>
               </div>
               <div className="absolute top-3 right-3">
                  <div className="bg-black/40 backdrop-blur text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {hospital.rating}
                  </div>
               </div>
             </div>
             <CardContent className="p-5 space-y-4">
                <div>
                   <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-bold text-lg leading-tight">{hospital.name}</h3>
                      {hospital.isVerified && <CheckCircle2 size={16} className="text-blue-500 shrink-0" />}
                   </div>
                   <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={12} /> {hospital.location}
                   </p>
                </div>

                <div className="space-y-2">
                   {hospital.departments.slice(0, 2).map(d => (
                     <div key={d.id} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{d.name}</span>
                        <div className="flex items-center gap-1 font-medium">
                           <Clock size={12} className="text-orange-500" />
                           {d.avgWaitTime} {t.mins}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="flex gap-2 pt-2">
                   <Button className="flex-1 gap-2" onClick={() => navigate(`/hospital/${hospital.id}`)}>
                      Explore Facility <ArrowRight size={16} />
                   </Button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;