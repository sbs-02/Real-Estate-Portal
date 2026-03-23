import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import api from '../api/axiosInstance';
import type { Property, PropertiesResponse } from '../types/property';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '6',
            });
            const { data } = await api.get<PropertiesResponse>(`/properties?${queryParams}`);
            setProperties(data.properties);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            toast.error('Could not fetch properties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page]);

    return (
        <div className="min-h-screen bg-brand-950 text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="space-y-10">
                    {/* Header */}
                    <div className="flex justify-between items-end border-b border-brand-700 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Properties</h1>
                            <p className="text-brand-muted mt-1 text-sm">Browse available listings</p>
                        </div>
                        {!loading && (
                            <p className="text-brand-muted text-sm hidden sm:block">
                                Showing <span className="text-white font-semibold">{properties.length}</span> results
                            </p>
                        )}
                    </div>

                    {/* Properties Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-brand-800 rounded-2xl border border-brand-700" />
                            ))}
                        </div>
                    ) : properties.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map(property => (
                                    <PropertyCard key={property._id} property={property} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-6 pt-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 rounded-full border border-brand-600 hover:border-white hover:text-white text-brand-muted transition-all disabled:opacity-30"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <span className="text-sm text-brand-muted">
                                    Page <span className="text-white font-semibold">{page}</span> of <span className="text-white font-semibold">{totalPages}</span>
                                </span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 rounded-full border border-brand-600 hover:border-white hover:text-white text-brand-muted transition-all disabled:opacity-30"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-24 border border-dashed border-brand-700 rounded-2xl">
                            <Search size={40} className="mx-auto text-brand-600 mb-4" />
                            <h3 className="text-xl font-semibold text-brand-light">No properties found</h3>
                            <p className="text-brand-muted mt-1 text-sm">Try again later.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
