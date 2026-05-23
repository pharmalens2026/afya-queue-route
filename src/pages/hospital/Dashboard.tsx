import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Users, 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2, 
  Timer, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  Plus,
  MoreVertical,
  LogOut,
  Hospital
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const HospitalDashboard: React.FC = () => {
  const { 
    currentUser, 
    hospitals, 
    queues, 
    referrals, 
    updateQueueStatus, 
    createReferral, 
    updateReferralStatus 
  } = useData();
  
  const hospital = hospitals.find(h => h.id === currentUser?.hospitalId);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  
  // New Referral State
  const [refPatientName, setRefPatientName] = useState('');
  const [refPatientPhone, setRefPatientPhone] = useState('');
  const [refToHospital, setRefToHospital] = useState('');
  const [refDept, setRefDept] = useState('');
  const [refUrgency, setRefUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [refNote, setRefNote] = useState('');

  if (!hospital) return <div className="p-10 text-center">Unauthorized access</div>;

  const hospitalQueues = queues.filter(q => q.hospitalId === hospital.id && q.status === 'waiting');
  const incomingReferrals = referrals.filter(r => r.toHospitalId === hospital.id);
  const outgoingReferrals = referrals.filter(r => r.fromHospitalId === hospital.id);

  const handleSendReferral = () => {
    createReferral({
      fromHospitalId: hospital.id,
      toHospitalId: refToHospital,
      patientName: refPatientName,
      patientPhone: refPatientPhone,
      department: refDept,
      urgency: refUrgency,
      note: refNote
    });
    setIsReferralModalOpen(false);
    // Reset form
    setRefPatientName('');
    setRefPatientPhone('');
    setRefToHospital('');
    setRefDept('');
    setRefUrgency('medium');
    setRefNote('');
  };

  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{hospital.name} Staff Portal</h1>
          <p className="text-muted-foreground">Manage your hospital's real-time patient flow.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2" onClick={() => setIsReferralModalOpen(true)}>
             <ArrowUpRight size={18} /> Send Referral
           </Button>
           <Button className="gap-2">
             <Plus size={18} /> Add Patient
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card>
           <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                 <Users size={24} />
              </div>
              <div>
                 <p className="text-sm text-muted-foreground">Waiting Now</p>
                 <h3 className="text-2xl font-bold">{hospitalQueues.length}</h3>
              </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                 <Clock size={24} />
              </div>
              <div>
                 <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
                 <h3 className="text-2xl font-bold">28m</h3>
              </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                 <ArrowDownLeft size={24} />
              </div>
              <div>
                 <p className="text-sm text-muted-foreground">Incoming Refs</p>
                 <h3 className="text-2xl font-bold">{incomingReferrals.filter(r => r.status === 'pending').length}</h3>
              </div>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-sm text-muted-foreground">Served Today</p>
                 <h3 className="text-2xl font-bold">{queues.filter(q => q.hospitalId === hospital.id && q.status === 'served').length}</h3>
              </div>
           </CardContent>
         </Card>
      </div>

      <Tabs defaultValue="queues" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queues">Live Queues</TabsTrigger>
          <TabsTrigger value="referrals">Referral Center</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queues" className="pt-4">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {hospital.departments.map(dept => {
                const deptQueue = hospitalQueues.filter(q => q.departmentId === dept.id);
                return (
                  <Card key={dept.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                         <CardTitle className="text-lg">{dept.name}</CardTitle>
                         <Badge variant="secondary">{deptQueue.length} in queue</Badge>
                      </div>
                      <CardDescription>Estimated wait: {dept.avgWaitTime} mins</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {deptQueue.length > 0 ? (
                        deptQueue.slice(0, 3).map((patient, idx) => (
                          <div key={patient.id} className={`p-3 border rounded-lg flex items-center justify-between ${idx === 0 ? 'bg-primary/5 border-primary/20' : ''}`}>
                             <div className="flex items-center gap-3">
                                <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                                   #{patient.number}
                                </div>
                                <div>
                                   <p className="font-bold text-sm">{patient.patientName}</p>
                                   <p className="text-xs text-muted-foreground">{new Date(patient.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                             </div>
                             {idx === 0 ? (
                               <Button size="sm" onClick={() => updateQueueStatus(patient.id, 'served')}>Call Next</Button>
                             ) : (
                               <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
                             )}
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center text-muted-foreground text-sm">
                           No patients in queue
                        </div>
                      )}
                      {deptQueue.length > 3 && (
                        <Button variant="ghost" className="w-full text-xs">View all {deptQueue.length} patients</Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
           </div>
        </TabsContent>

        <TabsContent value="referrals" className="pt-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Incoming */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowDownLeft size={18} /> Incoming Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomingReferrals.length > 0 ? (
                    incomingReferrals.map(ref => (
                      <div key={ref.id} className="p-4 border rounded-xl space-y-3">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold">{ref.patientName}</h4>
                               <p className="text-xs text-muted-foreground">From: {hospitals.find(h => h.id === ref.fromHospitalId)?.name}</p>
                            </div>
                            <Badge className={
                               ref.urgency === 'high' ? 'bg-red-100 text-red-700' : 
                               ref.urgency === 'medium' ? 'bg-orange-100 text-orange-700' : 
                               'bg-blue-100 text-blue-700'
                            }>
                               {ref.urgency.toUpperCase()}
                            </Badge>
                         </div>
                         <div className="text-sm bg-muted p-2 rounded">
                            <b>Dept:</b> {ref.department} <br/>
                            <b>Note:</b> {ref.note}
                         </div>
                         {ref.status === 'pending' ? (
                           <div className="flex gap-2">
                              <Button size="sm" className="flex-1" onClick={() => updateReferralStatus(ref.id, 'accepted')}>Accept</Button>
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => updateReferralStatus(ref.id, 'rejected')}>Reject</Button>
                           </div>
                         ) : (
                           <Badge variant="outline" className="w-full justify-center capitalize">{ref.status}</Badge>
                         )}
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">No referrals received.</div>
                  )}
                </CardContent>
              </Card>

              {/* Outgoing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowUpRight size={18} /> Outgoing Referrals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outgoingReferrals.length > 0 ? (
                    outgoingReferrals.map(ref => (
                      <div key={ref.id} className="p-4 border rounded-xl space-y-2">
                         <div className="flex justify-between">
                            <h4 className="font-bold">{ref.patientName}</h4>
                            <Badge variant="secondary" className="capitalize">{ref.status}</Badge>
                         </div>
                         <p className="text-xs text-muted-foreground">To: {hospitals.find(h => h.id === ref.toHospitalId)?.name}</p>
                         <p className="text-xs font-medium">Ref ID: {ref.id}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">No referrals sent.</div>
                  )}
                </CardContent>
              </Card>
           </div>
        </TabsContent>
      </Tabs>

      {/* Referral Modal */}
      <Dialog open={isReferralModalOpen} onOpenChange={setIsReferralModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Patient Referral</DialogTitle>
            <DialogDescription>Refer a patient to another specialist facility or hospital.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Patient Name</Label>
                 <Input value={refPatientName} onChange={(e) => setRefPatientName(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label>Patient Phone</Label>
                 <Input value={refPatientPhone} onChange={(e) => setRefPatientPhone(e.target.value)} />
               </div>
            </div>
            <div className="space-y-2">
              <Label>Destination Hospital</Label>
              <Select value={refToHospital} onValueChange={setRefToHospital}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.filter(h => h.id !== hospital.id).map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Target Department</Label>
                 <Input value={refDept} onChange={(e) => setRefDept(e.target.value)} placeholder="e.g. Cardiology" />
               </div>
               <div className="space-y-2">
                 <Label>Urgency</Label>
                 <Select value={refUrgency} onValueChange={(v: any) => setRefUrgency(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High / Emergency</SelectItem>
                    </SelectContent>
                 </Select>
               </div>
            </div>
            <div className="space-y-2">
              <Label>Reason for Referral / Notes</Label>
              <Textarea value={refNote} onChange={(e) => setRefNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReferralModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSendReferral}>Send Digital Referral</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalDashboard;