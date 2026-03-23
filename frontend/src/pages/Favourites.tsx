import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import type { Property } from '../types/property';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { HeartOff } from 'lucide-react';

const Favourites = () => {
    const [favourites, setFavourites] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavourites = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/favourites');
            const properties = data.map((fav: any) => fav.propertyId);
            setFavourites(properties);
        } catch (error) {
            toast.error('Could not fetch favourites');
        } finally {
            setLoading(false);
        }
    };

    const handleFavouriteToggle = (propertyId: string, isFav: boolean) => {
        if (!isFav) {
            // Removed — filter it out from the list
            setFavourites(prev => prev.filter(p => p._id !== propertyId));
        }
    };

    useEffect(() => {
        fetchFavourites();
    }, []);

    return (
        <div className="min-h-screen bg-brand-950 text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="space-y-10">
                    <div className="border-b border-brand-700 pb-6">
                        <h1 className="text-3xl font-bold text-white">Favourites</h1>
                        <p className="text-brand-muted mt-1 text-sm">Your saved properties</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-brand-800 rounded-2xl border border-brand-700" />
                            ))}
                        </div>
                    ) : favourites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favourites.map(property => (
                                <PropertyCard
                                    key={property._id}
                                    property={property}
                                    isFavourite={true}
                                    onFavouriteToggle={handleFavouriteToggle}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 border border-dashed border-brand-700 rounded-2xl">
                            <HeartOff size={40} className="mx-auto text-brand-600 mb-4" />
                            <h3 className="text-xl font-semibold text-brand-light">No saved properties</h3>
                            <p className="text-brand-muted mt-1 text-sm">Go to the dashboard and heart a property to save it.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Favourites;
