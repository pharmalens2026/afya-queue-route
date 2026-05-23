import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ClipboardList,
  Calendar,
  Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const MyStatus: React.FC = () => {
  const { queues, referrals, appointments, hospitals, language } = useData();

  const myQueues = queues.slice().reverse(); // Show latest first for mock simplicity
  const myRefs = referrals.slice().reverse();
  const myApps = appointments.slice().reverse();

  const t = {
    en: {
      title: 'My Healthcare Status',
      sub: 'Track your active queues, referrals, and appointments.',
      queues: 'Active Queues',
      referrals: 'My Referrals',
      appointments: 'Appointments',
      noQueues: 'No active queues.',
      noRefs: 'No referrals found.',
      noApps: 'No upcoming appointments.',
      position: 'Position in Queue',
      estTime: 'Est. Wait Time',
      mins: 'mins',
      refCode: 'Digital Referral Code',
      at: 'at'
    },
    sw: {
      title: 'Hali Yangu ya Matibabu',
      sub: 'Fuatilia foleni zako, marejeleo, na miadi.',
      queues: 'Foleni Zinazoendelea',
      referrals: 'Marejeleo Yangu',
      appointments: 'Miadi',
      noQueues: 'Hakuna foleni inayoendelea.',
      noRefs: 'Hakuna marejeleo yaliyopatikana.',
      noApps: 'Hakuna miadi inayokuja.',
      position: 'Nafasi yako foleni',
      estTime: 'Muda wa Kusubiri',
      mins: 'dakika',
      refCode: 'Namba ya Marejeleo',
      at: 'katika'
    }
  }[language];

  return (
    <div className="container px-4 py-8 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.sub}</p>
      </div>

      {/* Queues */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="text-primary" size={20} /> {t.queues}
        </h2>
        {myQueues.length > 0 ? (
          myQueues.map((q, i) => {
            const h = hospitals.find(h => h.id === q.hospitalId);
            const d = h?.departments.find(dept => dept.id === q.departmentId);
            return (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={q.status === 'waiting' ? 'border-primary/30 bg-primary/5' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{h?.name}</h3>
                        <p className="text-sm text-muted-foreground">{d?.name}</p>
                      </div>
                      <Badge variant={q.status === 'waiting' ? 'default' : 'secondary'} className="capitalize">
                        {q.status}
                      </Badge>
                    </div>

                    {q.status === 'waiting' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg border text-center">
                           <p className="text-xs text-muted-foreground mb-1">{t.position}</p>
                           <p className="text-2xl font-black text-primary">#{q.number}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border text-center">
                           <p className="text-xs text-muted-foreground mb-1">{t.estTime}</p>
                           <p className="text-2xl font-black text-orange-600">~{d?.avgWaitTime} {t.mins}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                       <span>Ref ID: {q.id}</span>
                       <span>Joined: {new Date(q.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center py-8 bg-muted/50 rounded-xl border border-dashed">{t.noQueues}</p>
        )}
      </section>

      {/* Referrals */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ArrowRight className="text-primary" size={20} /> {t.referrals}
        </h2>
        {myRefs.length > 0 ? (
          myRefs.map((r, i) => (
            <Card key={r.id} className="overflow-hidden border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{t.refCode}: {r.id}</Badge>
                  <Badge variant="outline" className="capitalize">{r.status}</Badge>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{hospitals.find(h => h.id === r.fromHospitalId)?.name}</span>
                      <ArrowRight size={14} className="text-muted-foreground" />
                      <span className="text-sm font-bold">{hospitals.find(h => h.id === r.toHospitalId)?.name}</span>
                   </div>
                   <p className="text-sm text-muted-foreground"><b>Department:</b> {r.department}</p>
                   {r.status === 'accepted' && (
                     <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        Hospital has confirmed your referral. Please proceed to the facility.
                     </div>
                   )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center py-8 bg-muted/50 rounded-xl border border-dashed">{t.noRefs}</p>
        )}
      </section>

      {/* Appointments */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="text-primary" size={20} /> {t.appointments}
        </h2>
        {myApps.length > 0 ? (
          myApps.map((a, i) => (
            <Card key={a.id}>
              <CardContent className="p-6 flex items-center gap-4">
                 <div className="bg-primary/10 text-primary p-3 rounded-xl flex flex-col items-center">
                    <span className="text-xs font-bold uppercase">{new Date(a.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-black">{new Date(a.date).getDate()}</span>
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold">{hospitals.find(h => h.id === a.hospitalId)?.name}</h3>
                    <p className="text-sm text-muted-foreground">{a.department} • {a.time}</p>
                 </div>
                 <Badge variant="outline">{a.status}</Badge>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center py-8 bg-muted/50 rounded-xl border border-dashed">{t.noApps}</p>
        )}
      </section>
    </div>
  );
};

export default MyStatus;