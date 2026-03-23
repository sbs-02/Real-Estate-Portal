import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Heart, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../context/authStore';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-brand-900 border-b border-brand-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-white">
          Estate<span className="text-brand-muted">Portal</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 text-brand-light">
            <UserIcon size={16} className="text-brand-muted" />
            <span className="text-sm">
              Welcome <span className="text-white font-semibold">{user?.name}</span>
            </span>
            <span className="px-2 py-0.5 bg-white text-black text-xs rounded font-bold uppercase tracking-wider">
              {user?.role || 'Buyer'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/favourites"
              className="flex items-center gap-2 text-brand-light hover:text-white transition-colors text-sm"
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Favourites</span>
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-brand-muted hover:text-white hover:bg-brand-700 rounded-full transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
