import { useState } from 'react';
import type { Property } from '../types/property';
import { Heart, Maximize2, Bed, Bath, MapPin } from 'lucide-react';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
  isFavourite?: boolean;
  onFavouriteToggle?: (propertyId: string, isFav: boolean) => void;
}

const PropertyCard = ({ property, isFavourite = false, onFavouriteToggle }: PropertyCardProps) => {
  const [fav, setFav] = useState(isFavourite);
  const [loading, setLoading] = useState(false);

  const handleFavToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (fav) {
        await api.delete(`/favourites/${property._id}`);
        setFav(false);
        toast.success('Removed from favourites');
      } else {
        await api.post(`/favourites/${property._id}`);
        setFav(true);
        toast.success('Added to favourites');
      }
      onFavouriteToggle?.(property._id, !fav);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not update favourites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-brand-900 border border-brand-700 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1 shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
            {property.listingType}
          </span>
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-white/20">
            {property.propertyType}
          </span>
        </div>
        <button
          onClick={handleFavToggle}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
            fav
              ? 'bg-white text-black border-white'
              : 'bg-black/40 text-white border-white/20 hover:bg-white hover:text-black'
          } disabled:opacity-50`}
          title={fav ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{property.title}</h3>
            <div className="flex items-center text-brand-muted text-sm mt-1">
              <MapPin size={13} className="mr-1 shrink-0" />
              {property.location.city}, {property.location.state}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-white">NPR {property.price.toLocaleString()}</p>
            <p className="text-[10px] text-brand-muted uppercase tracking-widest">Asking Price</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-brand-700 text-brand-light">
          <div className="flex flex-col items-center gap-1">
            <Bed size={14} className="text-brand-muted" />
            <span className="text-xs">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-brand-700">
            <Bath size={14} className="text-brand-muted" />
            <span className="text-xs">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize2 size={14} className="text-brand-muted" />
            <span className="text-xs">{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
