import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import api from "../api/axiosInstance";
import type { Property } from "../types/property";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listingTypeFilter, setListingTypeFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Fetch all properties for frontend-only filtering
      const { data } = await api.get<{ properties: Property[] }>(
        "/properties?limit=100",
      );
      setProperties(data.properties);
    } catch (error) {
      console.log(error, "Could not fetch properties");
      toast.error("Could not fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const cities = useMemo(() => {
    const uniqueCities = new Set(properties.map((p) => p.location.city));
    return Array.from(uniqueCities).sort();
  }, [properties]);

  // Filter logic
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || property.propertyType === typeFilter;
      const matchesListing =
        listingTypeFilter === "all" ||
        property.listingType === listingTypeFilter;

      const price = property.price;
      const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

      const matchesCity =
        cityFilter === "all" || property.location.city === cityFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesListing &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesCity
      );
    });
  }, [
    properties,
    searchQuery,
    typeFilter,
    listingTypeFilter,
    minPrice,
    maxPrice,
    cityFilter,
  ]);

  // Pagination logic (frontend side)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    typeFilter,
    listingTypeFilter,
    minPrice,
    maxPrice,
    cityFilter,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setListingTypeFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setCityFilter("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    typeFilter !== "all" ||
    listingTypeFilter !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    cityFilter !== "all";

  return (
    <div className="min-h-screen bg-brand-950 text-white font-['Varela_Round']">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-700 pb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Properties
              </h1>
              <p className="text-brand-muted mt-1 text-sm">
                Discover your perfect home
              </p>
            </div>

            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by title, city or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white transition-all placeholder:text-brand-700"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all ${showFilters ? "bg-white text-black border-white" : "border-brand-700 text-brand-muted hover:border-brand-500"}`}
              >
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 bg-brand-900/50 border border-brand-700 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  City
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-white transition-all"
                >
                  <option value="all">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Property Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-white transition-all"
                >
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Listing Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-white transition-all"
                >
                  <option value="all">All Listings</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Min Price (NPR)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                  Max Price (NPR)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-brand-900 border border-brand-700 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-white transition-all"
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="p-2 text-brand-muted hover:text-white transition-colors"
                      title="Clear Filters"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredProperties.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-brand-muted text-sm">
                Found{" "}
                <span className="text-white font-semibold">
                  {filteredProperties.length}
                </span>{" "}
                properties
              </p>
              {hasActiveFilters && !showFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-muted hover:text-white underline underline-offset-4 decoration-brand-700 transition-all"
                >
                  Reset all filters
                </button>
              )}
            </div>
          )}

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[420px] bg-brand-900/40 rounded-2xl border border-brand-800"
                />
              ))}
            </div>
          ) : paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-8 pt-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-700 hover:border-white hover:text-white text-brand-muted transition-all disabled:opacity-30 disabled:hover:border-brand-700 disabled:hover:text-brand-muted"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{page}</span>
                    <span className="text-brand-muted text-sm">/</span>
                    <span className="text-brand-muted text-sm">
                      {totalPages}
                    </span>
                  </div>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-700 hover:border-white hover:text-white text-brand-muted transition-all disabled:opacity-30 disabled:hover:border-brand-700 disabled:hover:text-brand-muted"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-brand-900/20 border border-dashed border-brand-700 rounded-3xl">
              <div className="bg-brand-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={28} className="text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                No properties match your criteria
              </h3>
              <p className="text-brand-muted mt-2 text-sm max-w-xs mx-auto">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-8 px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-brand-light transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
