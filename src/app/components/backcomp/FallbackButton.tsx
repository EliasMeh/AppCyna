'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const Deco = () => {
    const router = useRouter()
    
    const handleFallback = () => {
        router.push('/')
    }

    return (
        <button 
            onClick={handleFallback}
            className="bg-customViolet text-white p-2 rounded-lg"
        >
            Main Page
        </button>
    )
}

export default Deco