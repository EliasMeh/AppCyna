"use client"
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: number
  email: string
  nom: string
  prenom: string
}

interface Subscription {
  id: number
  produitId: number
  startDate: string
  endDate?: string
  status: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string
  produit: {
    nom: string
    prix: number
  }
}

const HandleSubUser = () => {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to load users')
      }
    }

    fetchUsers()
  }, [])

  const fetchSubscriptions = async () => {
    if (!selectedUserId) {
      setError('Please select a user')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/subscriptions?userId=${selectedUserId}`)
      if (!response.ok) throw new Error('Failed to fetch subscriptions')
      
      const data = await response.json()
      setSubscriptions(data)
    } catch (error) {
      setError('Error fetching subscriptions')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async (subscriptionId: number) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')
      
      // Refresh subscriptions list
      fetchSubscriptions()
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      setError('Failed to cancel subscription')
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">User Subscriptions Management</h2>
        
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Select User</label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.prenom} {user.nom} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={fetchSubscriptions}
            disabled={isLoading || !selectedUserId}
          >
            {isLoading ? 'Loading...' : 'Show Subscriptions'}
          </Button>
        </div>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {subscriptions.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>{sub.produit.nom}</TableCell>
                    <TableCell>
                      {sub.cancelAtPeriodEnd ? 
                        <span className="text-red-500">Cancelling</span> : 
                        <span className="text-green-500">Active</span>
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(sub.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {sub.endDate ? 
                        new Date(sub.endDate).toLocaleDateString() : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>€{sub.produit.prix}/month</TableCell>
                    <TableCell>
                      {!sub.cancelAtPeriodEnd && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[9999] bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this subscription? 
                                The user will maintain access until the end of their billing period.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Active</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelSubscription(sub.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Yes, Cancel
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {subscriptions.length === 0 && !isLoading && selectedUserId && (
          <p className="text-gray-500">No subscriptions found for this user.</p>
        )}
      </div>
    </div>
  )
}

export default HandleSubUser