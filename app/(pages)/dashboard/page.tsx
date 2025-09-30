'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  orderId: string;
  pizzaType: string;
  size: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      const loadOrders = async () => {
        try {
          const mockOrders: Order[] = [
            {
              orderId: 'order_123456',
              pizzaType: 'Pepperoni',
              size: 'Grande',
              quantity: 2,
              total: 25.99,
              status: 'entregado',
              createdAt: '2024-01-15T14:30:00Z'
            },
            {
              orderId: 'order_123457',
              pizzaType: 'Hawaiana',
              size: 'Mediana',
              quantity: 1,
              total: 18.99,
              status: 'preparando',
              createdAt: '2024-01-15T16:45:00Z'
            }
          ];
          setRecentOrders(mockOrders);
        } catch (error) {
          console.error('Error cargando órdenes:', error);
        } finally {
          setLoading(false);
        }
      };

      loadOrders();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado': return 'bg-green-100 text-green-800';
      case 'preparando': return 'bg-yellow-100 text-yellow-800';
      case 'en camino': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido, {session.user?.name || 'Pizzero'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus pedidos y disfruta de las mejores pizzas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {session.user?.email}
              </span>
              <button
                onClick={() => router.push('/auth/signin')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-2xl">🍕</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/orders/new"
            className="bg-red-600 text-white p-6 rounded-lg shadow hover:bg-red-700 transition-colors block"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Hacer Nuevo Pedido</h3>
                <p className="text-red-100 mt-2">Ordena tu pizza favorita</p>
              </div>
              <span className="text-2xl">➕</span>
            </div>
          </Link>

          <Link 
            href="/orders"
            className="bg-white text-gray-900 p-6 rounded-lg shadow hover:bg-gray-50 transition-colors block border"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Ver Todos los Pedidos</h3>
                <p className="text-gray-600 mt-2">Revisa tu historial completo</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Órdenes Recientes</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Cargando órdenes...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No tienes órdenes recientes</p>
              <Link 
                href="/orders/new"
                className="text-red-600 hover:text-red-700 font-medium mt-2 inline-block"
              >
                ¡Haz tu primer pedido!
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden">
              {recentOrders.map((order) => (
                <div key={order.orderId} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="text-2xl">🍕</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {order.pizzaType} - {order.size}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {order.quantity} pizza(s) • ${order.total} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <Link 
                          href={`/orders/${order.orderId}`}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Tu Información</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-gray-900">{session.user?.name || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">ID de Usuario</label>
                <p className="text-gray-900 font-mono text-sm">{session.user?.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rol</label>
                <p className="text-gray-900 capitalize">{session.user?.role || 'usuario'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}