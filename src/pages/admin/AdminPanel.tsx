import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AdminPanel: React.FC = () => {
  const { hospitals, referrals, queues } = useData();

  return (
    <div className="container px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AfyaRoute HQ</h1>
          <p className="text-muted-foreground">National healthcare routing analytics and management.</p>
        </div>
        <Button className="gap-2">
           <Plus size={18} /> Onboard Hospital
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <Card className="bg-blue-950 text-white">
           <CardContent className="p-6">
              <Building2 className="mb-2 opacity-60" size={24} />
              <p className="text-sm opacity-80">Total Hospitals</p>
              <h3 className="text-3xl font-bold">{hospitals.length}</h3>
           </CardContent>
         </Card>
         <Card className="bg-green-900 text-white">
           <CardContent className="p-6">
              <Users className="mb-2 opacity-60" size={24} />
              <p className="text-sm opacity-80">Active Patients</p>
              <h3 className="text-3xl font-bold">{queues.length}</h3>
           </CardContent>
         </Card>
         <Card className="bg-indigo-900 text-white">
           <CardContent className="p-6">
              <Activity className="mb-2 opacity-60" size={24} />
              <p className="text-sm opacity-80">System Health</p>
              <h3 className="text-3xl font-bold">99.9%</h3>
           </CardContent>
         </Card>
         <Card className="bg-orange-900 text-white">
           <CardContent className="p-6">
              <ArrowRight className="mb-2 opacity-60" size={24} />
              <p className="text-sm opacity-80">Total Referrals</p>
              <h3 className="text-3xl font-bold">{referrals.length}</h3>
           </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <Card>
               <CardHeader>
                  <CardTitle>Hospital Management</CardTitle>
                  <CardDescription>Verify and manage hospital subscriptions.</CardDescription>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Hospital</TableHead>
                           <TableHead>Location</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead>Queue Load</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {hospitals.map(h => (
                           <TableRow key={h.id}>
                              <TableCell className="font-medium">{h.name}</TableCell>
                              <TableCell>{h.location}</TableCell>
                              <TableCell>
                                 <Badge variant={h.isVerified ? 'default' : 'outline'} className={h.isVerified ? 'bg-green-100 text-green-700' : ''}>
                                    {h.isVerified ? 'Verified' : 'Pending'}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2">
                                    <div className="w-16 bg-muted h-1.5 rounded-full overflow-hidden">
                                       <div 
                                          className="bg-primary h-full" 
                                          style={{ width: `${Math.min(100, (h.departments.reduce((a,b)=>a+b.queueSize, 0)/20)*100)}%` }} 
                                       />
                                    </div>
                                    <span className="text-xs">{h.departments.reduce((a,b)=>a+b.queueSize, 0)}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="text-right">
                                 <Button variant="ghost" size="sm">Manage</Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle className="text-lg">Recent Referrals</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {referrals.slice(0, 5).map(r => (
                     <div key={r.id} className="text-sm flex justify-between items-center border-b pb-2">
                        <div>
                           <p className="font-bold">{r.patientName}</p>
                           <p className="text-xs text-muted-foreground">ID: {r.id}</p>
                        </div>
                        <Badge variant="outline" className="capitalize text-[10px]">{r.status}</Badge>
                     </div>
                  ))}
               </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
               <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                     <TrendingUp size={18} /> System Insight
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm text-muted-foreground">
                     The national average wait time has decreased by <b>15%</b> since implementing AfyaRoute referrals.
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-primary font-bold">View Report</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;