import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Hospital, ShieldCheck, User, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { login, hospitals } = useData();
  const [hospitalId, setHospitalId] = useState(hospitals[0]?.id || '');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'hospital') {
      login('hospital', hospitalId);
      navigate('/hospital-dashboard');
    } else if (type === 'admin') {
      login('admin');
      navigate('/admin');
    } else {
      login('patient');
      navigate('/');
    }
  };

  const loginConfigs: any = {
    patient: {
      title: 'Patient Login',
      desc: 'Access your medical status and appointments.',
      icon: User,
      color: 'text-blue-600 bg-blue-50'
    },
    hospital: {
      title: 'Hospital Staff Portal',
      desc: 'Manage your facility queue and referrals.',
      icon: Hospital,
      color: 'text-green-600 bg-green-50'
    },
    admin: {
      title: 'AfyaRoute Admin',
      desc: 'System-wide monitoring and onboarding.',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50'
    }
  };

  const config = loginConfigs[type as string] || loginConfigs.patient;

  return (
    <div className="container px-4 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${config.color}`}>
            <config.icon size={32} />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {type === 'hospital' && (
              <div className="space-y-2">
                <Label>Select Hospital</Label>
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border bg-background text-sm ring-offset-background"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Phone or Email</Label>
              <Input placeholder={type === 'admin' ? 'admin@afyaroute.com' : '07xx xxx xxx'} />
            </div>
            
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button type="submit" className="w-full gap-2 mt-2">
               Access Portal <ArrowRight size={18} />
            </Button>
            
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                By logging in, you agree to AfyaRoute terms and privacy policy.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;