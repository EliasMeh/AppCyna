'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogPortal, AlertDialogOverlay } from "@/components/ui/alert-dialog";

interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  adresse?: string;
  role: string;
}

interface Subscription {
  id: number;
  produitId: number;
  startDate: string;
  endDate?: string;
  status: string;
  produit: {
    nom: string;
    prix: number;
  };
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/users/connexion');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({
      nom: userData.nom || '',
      prenom: userData.prenom || '',
      email: userData.email || '',
      adresse: userData.adresse || '',
    });

    // Fetch user subscriptions
    fetchSubscriptions(userData.id);
  }, [router]);

  const fetchSubscriptions = async (userId: number) => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');
      
      // Refresh subscriptions after cancellation
      if (user) {
        fetchSubscriptions(user.id);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Profile Information */}
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Profile Information</h2>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block">First Name</label>
                  <Input
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block">Last Name</label>
                  <Input
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block">Address</label>
                  <Input
                    value={formData.adresse}
                    onChange={(e) =>
                      setFormData({ ...formData, adresse: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p>
                  <strong>Name:</strong> {user?.prenom} {user?.nom}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Address:</strong> {user?.adresse || 'Not provided'}
                </p>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </div>

          {/* Subscriptions */}
          <div className="rounded-lg border p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Your Subscriptions</h2>
            {subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-lg border p-4 shadow-sm"
                  >
                    <h3 className="font-semibold">{sub.produit.nom}</h3>
                    <p>Status: {sub.status}</p>
                    <p>Price: €{sub.produit.prix}/month</p>
                    <p>Started: {new Date(sub.startDate).toLocaleDateString()}</p>
                    {sub.cancelAtPeriodEnd ? (
                      <div className="mt-2">
                        <p className="text-red-600">
                          Cancels on {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="mt-2">
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">
                              Cancel Subscription
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Your subscription will remain active until the end of the current billing period. 
                              Continue with cancellation?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6 flex gap-3 justify-end">
                            <AlertDialogCancel>
                              Keep Subscription
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelSubscription(sub.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                        
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active subscriptions</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}