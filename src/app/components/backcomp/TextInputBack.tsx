'use client'
import React, { useState, useEffect } from 'react'

const TextInputBack = () => {
  const [text, setText] = useState('')

  useEffect(() => {
    fetch('/api/text')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log('Fetched data:', data)
        setText(data.content)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('/api/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: text })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)
      })
      .catch(error => console.error('Error submitting data:', error))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          name="textedynamique"
          id="textedynamique"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='min-w-96'
        ></textarea>
        <button 
          type='submit' 
          className='bg-indigo-500 text-white rounded-md px-2 py-1'
        >
          Modifier
        </button>
      </div>
    </form>
  )
}

export default TextInputBack