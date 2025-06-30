import React, { useState, useEffect } from 'react';
import { schoolAPI } from '../../lib/api';
import SchoolCard from '../../components/ui/SchoolCardNew';
import SearchBar from '../../components/ui/SearchBar';

const AdminSchoolManagement = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        subscriptionPlan: '',
        page: 1,
        limit: 12
    });

    useEffect(() => {
        fetchSchools();
    }, [filters]);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const response = await schoolAPI.getAllSchools(filters);
            setSchools(response.data.schools);
            setPagination(response.data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1
        }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    if (loading && schools.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading schools...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                School Management
                            </h1>
                            <p className="text-gray-600">
                                Manage all registered schools and institutions
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <span className="text-sm text-gray-600">Total Schools: </span>
                                <span className="font-semibold text-blue-600">{pagination.total || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <SearchBar
                                    placeholder="Search schools by name, city, or state..."
                                    onSearch={handleSearch}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    value={filters.subscriptionPlan}
                                    onChange={(e) => handleFilterChange('subscriptionPlan', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Plans</option>
                                    <option value="basic">Basic</option>
                                    <option value="standard">Standard</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Schools Grid */}
                {schools.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
                        <p className="text-gray-500">No schools match your current filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {schools.map((school) => (
                                <SchoolCard
                                    key={school._id}
                                    school={school}
                                    onUpdate={fetchSchools}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center">
                                <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-white/20 p-2">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.current - 1)}
                                            disabled={pagination.current === 1}
                                            className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        
                                        {[...Array(pagination.pages)].map((_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                                        page === pagination.current
                                                            ? 'bg-blue-500 text-white'
                                                            : 'hover:bg-blue-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={() => handlePageChange(pagination.current + 1)}
                                            disabled={pagination.current === pagination.pages}
                                            className="px-3 py-1 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {loading && schools.length > 0 && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSchoolManagement;
