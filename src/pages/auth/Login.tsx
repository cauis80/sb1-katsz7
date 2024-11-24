import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import { ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Temporary superadmin credentials for demo
const SUPERADMIN = {
  id: '1',
  email: 'admin@formationpro.com',
  password: 'admin123',
  name: 'Super Admin',
  role: 'admin' as const,
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Auto-fill credentials in development mode
  useEffect(() => {
    if (import.meta.env.DEV) {
      setValue('email', SUPERADMIN.email);
      setValue('password', SUPERADMIN.password);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        data.email === SUPERADMIN.email &&
        data.password === SUPERADMIN.password
      ) {
        setAuth(SUPERADMIN, 'fake-token');
        navigate('/dashboard', { replace: true });
      } else {
        setError('root', {
          message: 'Email ou mot de passe incorrect',
        });
      }
    } catch (error) {
      setError('root', {
        message: 'Une erreur est survenue',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Connexion à FormationPro
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {errors.root && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            {import.meta.env.DEV && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>Identifiants de démonstration :</p>
                <p className="font-mono mt-1">admin@formationpro.com / admin123</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}