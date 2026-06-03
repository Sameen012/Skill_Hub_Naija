import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, User } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'Passionate learner focused on Web Development.',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatarPreview(imageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API update
        setTimeout(() => {
            alert("Profile updated successfully!");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
                    <p className="text-slate-500 dark:text-slate-300">Manage your profile and preferences.</p>
                </header>

                <div className="max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Profile Picture Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-transform hover:scale-110">
                                    <Camera size={16} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Upload a professional photo for your certificates.</p>
                            </div>
                        </div>

                        <hr className="border-slate-100 dark:border-slate-800" />

                        {/* Personal Details */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                                <Input
                                    label="Email Address"
                                    value={formData.email}
                                    disabled
                                    className="opacity-75 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="theme-label mb-1">Bio</label>
                                <textarea
                                    rows={4}
                                    className="theme-input sm:text-sm"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                />
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Brief description for your profile.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={loading} className="flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </Button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default Settings;