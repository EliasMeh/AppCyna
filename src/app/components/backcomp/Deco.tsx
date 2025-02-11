'use client'
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Deco = () => {
    const [user, setUser] = useState<{ id: number; email: string; nom: string } | null>(null)
    const router = useRouter()
    
    const handleLogout = () => {
        localStorage.removeItem('user')
        setUser(null)
        router.push('/')
    }

    return (
        <button 
            onClick={handleLogout}
            className="bg-customViolet text-white p-2 rounded-lg"
        >
            Logout
        </button>
    )
}

export default Deco