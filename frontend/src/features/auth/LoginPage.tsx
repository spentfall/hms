import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import api from '../../services/api';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginForm {
    email: string;
    pass: string;
}

export function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError('');
        try {
            // Note: Backend expects 'password', but form field might be 'pass' if we want to match backend DTO exactly? 
            // Wait, backend DTO is LoginDto { email, password }.
            // Let's ensure we send { email, password: data.pass }

            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.pass,
            });

            login(response.data.access_token);
            navigate('/');
        } catch (err: any) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            MediSys <span className="text-primary">HMS</span>
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Sign in to manage your hospital operations
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                    placeholder="admin@medisys.com"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register('pass', { required: 'Password is required' })}
                                        className="block w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.pass && (
                                    <p className="text-xs text-red-500 mt-1">{errors.pass.message}</p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Don't have an account?{' '}
                                <a href="/register" className="font-medium text-primary hover:text-blue-600 transition-colors">
                                    Create one now
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image/Branding */}
            <div className="hidden lg:block relative bg-slate-900">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=2000"
                    alt="Hospital Hallway"
                />
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <blockquote className="text-white">
                        <p className="text-xl font-medium">
                            "MediSys has transformed how we handle patient care. It is efficient, secure, and incredibly easy to use."
                        </p>
                        <footer className="mt-4 font-bold text-primary">
                            — Dr. Sarah Chen, Chief Medical Officer
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
