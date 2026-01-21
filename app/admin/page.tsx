'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch {
        // Ignore errors
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Panel Administratora
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Zaloguj się, aby zarządzać serwisem
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 shadow-sm rounded-md">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="E-mail administratora"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Admina</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 underline"
          >
            Wyloguj się
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MenuCard 
            title="Analityka" 
            desc="Statystyki odwiedzin i konwersji" 
            href="/admin/analytics"
            icon="📊"
          />
          <MenuCard 
            title="Zamówienia" 
            desc="Zarządzaj zamówieniami klientów" 
            href="/admin/orders"
            icon="🛍️"
          />
          <MenuCard 
            title="Cennik" 
            desc="Edytuj ceny i pakiety usług" 
            href="/admin/pricing"
            icon="💰"
          />
          <MenuCard 
            title="Wyszukiwania GMB" 
            desc="Historia wyszukiwań wizytówek" 
            href="/admin/searched-gmbs"
            icon="🔍"
          />
          <MenuCard 
            title="Odwiedzający" 
            desc="Szczegółowa lista wizyt w serwisie" 
            href="/admin/visitors"
            icon="👥"
          />
        </div>
      </div>
    </div>
  );
}

function MenuCard({ title, desc, href, icon }: { title: string, desc: string, href: string, icon: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>
        <p className="text-gray-500 mt-2">{desc}</p>
      </div>
    </Link>
  );
}
