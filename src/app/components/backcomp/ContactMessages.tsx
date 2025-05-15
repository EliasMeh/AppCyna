'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load messages'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update message status');

      // Update local state
      setMessages(
        messages.map((msg) => (msg.id === id ? { ...msg, status } : msg))
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update status'
      );
    }
  };

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg bg-white shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {message.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {message.email}
                </td>
                <td className="max-w-md truncate px-6 py-4 text-sm text-gray-500">
                  {message.message}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${message.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''} ${message.status === 'responded' ? 'bg-green-100 text-green-800' : ''} ${message.status === 'archived' ? 'bg-gray-100 text-gray-800' : ''}`}
                  >
                    {message.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  {message.status === 'pending' && (
                    <Button
                      onClick={() =>
                        updateMessageStatus(message.id, 'responded')
                      }
                      className="mr-2 bg-green-500 hover:bg-green-600"
                    >
                      Mark Responded
                    </Button>
                  )}
                  {message.status !== 'archived' && (
                    <Button
                      onClick={() =>
                        updateMessageStatus(message.id, 'archived')
                      }
                      variant="destructive"
                    >
                      Archive
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
