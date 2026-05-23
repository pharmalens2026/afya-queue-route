import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  ClipboardList, 
  Hospital, 
  User, 
  Menu, 
  X,
  ShieldCheck,
  Building2,
  LogOut,
  Languages
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { currentUser, logout, language, setLanguage } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isHospital = currentUser?.role === 'hospital';
  const isPatient = !currentUser || currentUser.role === 'patient';

  const t = {
    en: {
      home: 'Home',
      search: 'Hospitals',
      status: 'My Status',
      dashboard: 'Dashboard',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout',
      hospitalStaff: 'Hospital Portal',
      patient: 'Patient Portal',
      adminPortal: 'HQ Panel',
      language: 'Language'
    },
    sw: {
      home: 'Mwanzo',
      search: 'Hospitali',
      status: 'Hali Yangu',
      dashboard: 'Dashibodi',
      admin: 'Usimamizi',
      login: 'Ingia',
      logout: 'Toka',
      hospitalStaff: 'Wafanyakazi',
      patient: 'Wagonjwa',
      adminPortal: 'Makao Makuu',
      language: 'Lugha'
    }
  }[language];

  const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <div className="bg-primary text-white p-1 rounded-lg">
            <Hospital size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">AfyaRoute</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {isPatient && (
            <>
              <NavItem to="/" icon={Home} label={t.home} active={location.pathname === '/'} />
              <NavItem to="/hospitals" icon={Search} label={t.search} active={location.pathname.startsWith('/hospitals')} />
              <NavItem to="/status" icon={ClipboardList} label={t.status} active={location.pathname === '/status'} />
            </>
          )}

          {isHospital && (
            <>
              <NavItem to="/hospital-dashboard" icon={Building2} label={t.dashboard} active={location.pathname === '/hospital-dashboard'} />
            </>
          )}

          {isAdmin && (
            <>
              <NavItem to="/admin" icon={ShieldCheck} label={t.admin} active={location.pathname === '/admin'} />
            </>
          )}

          <div className="h-6 w-[1px] bg-border mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('sw')}>Kiswahili</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User size={18} />
                  <span>{currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut size={16} className="mr-2" />
                  {t.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">{t.login}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/login/patient')}>{t.patient}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/login/hospital')}>{t.hospitalStaff}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/login/admin')}>{t.adminPortal}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-2 bg-background border-b animate-in slide-in-from-top duration-200">
          {isPatient && (
             <>
               <NavItem to="/" icon={Home} label={t.home} active={location.pathname === '/'} />
               <NavItem to="/hospitals" icon={Search} label={t.search} active={location.pathname.startsWith('/hospitals')} />
               <NavItem to="/status" icon={ClipboardList} label={t.status} active={location.pathname === '/status'} />
             </>
          )}
          
          {isHospital && (
             <NavItem to="/hospital-dashboard" icon={Building2} label={t.dashboard} active={location.pathname === '/hospital-dashboard'} />
          )}

          {isAdmin && (
             <NavItem to="/admin" icon={ShieldCheck} label={t.admin} active={location.pathname === '/admin'} />
          )}

          <div className="flex items-center justify-between pt-4 border-t mt-4">
             <div className="flex gap-2">
                <Button variant={language === 'en' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('en')}>EN</Button>
                <Button variant={language === 'sw' ? 'default' : 'outline'} size="sm" onClick={() => setLanguage('sw')}>SW</Button>
             </div>
             {currentUser ? (
               <Button variant="ghost" className="text-destructive" onClick={() => { logout(); setIsMenuOpen(false); }}>
                 <LogOut size={18} className="mr-2" /> {t.logout}
               </Button>
             ) : (
               <Button onClick={() => { navigate('/login/patient'); setIsMenuOpen(false); }}>{t.login}</Button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;