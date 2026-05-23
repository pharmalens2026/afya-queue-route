import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  MapPin, 
  Clock, 
  Star, 
  ChevronLeft, 
  Phone, 
  Globe, 
  Share2, 
  Users, 
  Bed,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HospitalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hospitals, joinQueue, bookAppointment, language } = useData();
  const hospital = hospitals.find(h => h.id === id);

  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');

  if (!hospital) return <div className="p-10 text-center">Hospital not found</div>;

  const t = {
    en: {
      join: 'Join Queue',
      book: 'Book Appointment',
      services: 'Services',
      departments: 'Departments',
      about: 'About',
      waiting: 'waiting',
      waitTime: 'Avg. Wait Time',
      beds: 'Beds Available',
      specialists: 'Specialists',
      form: {
        title: 'Join Virtual Queue',
        sub: 'You will receive a notification when it is almost your turn.',
        name: 'Full Name',
        phone: 'Phone Number',
        confirm: 'Confirm'
      }
    },
    sw: {
      join: 'Jiunge Foleni',
      book: 'Weka Miadi',
      services: 'Huduma',
      departments: 'Vitengo',
      about: 'Kuhusu',
      waiting: 'wakisubiri',
      waitTime: 'Muda wa Kusubiri',
      beds: 'Vitanda Vilivyopo',
      specialists: 'Madaktari Bingwa',
      form: {
        title: 'Jiunge Foleni Kidijitali',
        sub: 'Utapokea ujumbe wakati unapokaribia kufika zamu yako.',
        name: 'Jina Kamili',
        phone: 'Namba ya Simu',
        confirm: 'Thibitisha'
      }
    }
  }[language];

  const handleJoinQueue = () => {
    if (!patientName || !patientPhone) return;
    joinQueue(hospital.id, selectedDept.id, patientName, patientPhone);
    setIsQueueModalOpen(false);
    navigate('/status');
  };

  const handleBook = () => {
    if (!patientName || !patientPhone || !bookDate || !bookTime) return;
    bookAppointment({
      hospitalId: hospital.id,
      patientName,
      department: selectedDept.name,
      date: bookDate,
      time: bookTime
    });
    setIsBookModalOpen(false);
    navigate('/status');
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="relative h-64 md:h-80">
        <img src={hospital.image} className="w-full h-full object-cover" alt={hospital.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-4 left-4 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-white border-none">Verified</Badge>
            <div className="flex items-center gap-1 text-sm bg-black/40 backdrop-blur px-2 py-0.5 rounded">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              {hospital.rating}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{hospital.name}</h1>
          <p className="flex items-center gap-1 opacity-90">
            <MapPin size={16} /> {hospital.location}
          </p>
        </div>
      </div>

      <div className="container px-4 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                   <Users className="text-primary mb-1" size={24} />
                   <span className="text-2xl font-bold">{hospital.departments.reduce((acc, d) => acc + d.queueSize, 0)}</span>
                   <span className="text-xs text-muted-foreground">Total Waiting</span>
                </CardContent>
             </Card>
             <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                   <Bed className="text-green-600 mb-1" size={24} />
                   <span className="text-2xl font-bold">{hospital.bedsAvailable}</span>
                   <span className="text-xs text-muted-foreground">{t.beds}</span>
                </CardContent>
             </Card>
             <Card className="bg-orange-50 border-orange-100">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                   <Clock className="text-orange-600 mb-1" size={24} />
                   <span className="text-2xl font-bold">{hospital.departments[0]?.avgWaitTime}m</span>
                   <span className="text-xs text-muted-foreground">Shortest Wait</span>
                </CardContent>
             </Card>
             <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-1">
                   <Phone className="text-blue-600 mb-1" size={24} />
                   <span className="text-xs font-bold mt-2">Call</span>
                   <span className="text-xs text-muted-foreground">Emergency</span>
                </CardContent>
             </Card>
          </div>

          <Tabs defaultValue="queues">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
              <TabsTrigger value="queues" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                {t.departments}
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                {t.services}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="queues" className="pt-6 space-y-4">
              {hospital.departments.map(dept => (
                <Card key={dept.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{dept.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {dept.queueSize} {t.waiting}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {dept.avgWaitTime} mins wait
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button size="sm" variant="outline" onClick={() => { setSelectedDept(dept); setIsBookModalOpen(true); }}>
                          <Calendar size={16} className="mr-1" /> Book
                       </Button>
                       <Button size="sm" onClick={() => { setSelectedDept(dept); setIsQueueModalOpen(true); }}>
                          {t.join}
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="services" className="pt-6">
              <div className="flex flex-wrap gap-2">
                {hospital.services.map(s => (
                  <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">
                    <CheckCircle2 size={14} className="mr-2 text-primary" /> {s}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-lg">Hospital Info</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                   <MapPin className="text-muted-foreground mt-1" size={18} />
                   <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{hospital.location}</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Phone className="text-muted-foreground mt-1" size={18} />
                   <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-muted-foreground">+254 700 000 000</p>
                   </div>
                </div>
                <div className="flex items-start gap-3">
                   <Clock className="text-muted-foreground mt-1" size={18} />
                   <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-muted-foreground">Open 24 Hours</p>
                   </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                   <Share2 size={16} /> Share Details
                </Button>
             </CardContent>
           </Card>

           <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4">
                 <div className="flex gap-3">
                    <AlertTriangle className="text-red-600 shrink-0" size={24} />
                    <div>
                       <h4 className="font-bold text-red-900">Emergency Case?</h4>
                       <p className="text-xs text-red-700 mb-3">Skip the search and call our dedicated emergency response unit.</p>
                       <Button variant="destructive" size="sm" className="w-full">Call Emergency</Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Queue Modal */}
      <Dialog open={isQueueModalOpen} onOpenChange={setIsQueueModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.form.title}</DialogTitle>
            <DialogDescription>{t.form.sub}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.form.name}</Label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label>{t.form.phone}</Label>
              <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="07xx xxx xxx" />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
               Selected: <b>{selectedDept?.name}</b>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQueueModalOpen(false)}>Cancel</Button>
            <Button onClick={handleJoinQueue} disabled={!patientName || !patientPhone}>{t.form.confirm}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <Dialog open={isBookModalOpen} onOpenChange={setIsBookModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.book}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.form.name}</Label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
               </div>
               <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={bookTime} onChange={(e) => setBookTime(e.target.value)} />
               </div>
            </div>
            <div className="space-y-2">
              <Label>{t.form.phone}</Label>
              <Input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="07xx xxx xxx" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookModalOpen(false)}>Cancel</Button>
            <Button onClick={handleBook} disabled={!patientName || !patientPhone || !bookDate || !bookTime}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalDetail;