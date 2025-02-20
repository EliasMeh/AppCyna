'use client'
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function InputFile() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [produitId, setProduitId] = useState<number | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    } else {
      setFile(null)
      setFileName(null)
    }
  }

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseInt(event.target.value) : null
    setProduitId(value)
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result as string
        const base64Content = base64String.split(',')[1]
        resolve(base64Content)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected")
      return
    }

    try {
      const base64Data = await convertToBase64(file)
      
      const requestBody: { imageData: string; produitId?: number } = {
        imageData: base64Data,
      }

      // Only add produitId if it exists
      if (produitId !== null) {
        requestBody.produitId = produitId
      }
      
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      
      // Reset form
      setFile(null)
      setFileName(null)
      setProduitId(null)
      
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="picture">Picture</Label>
          <Input 
            id="picture" 
            type="file" 
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="w-24">
          <Label htmlFor="number">Produit ID</Label>
          <Input 
            id="number" 
            type="number" 
            onChange={handleNumberChange}
            min="1"
            placeholder="Optional"
          />
        </div>
      </div>
      {fileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {fileName}</p>}
      <Button className="mt-2" onClick={handleUpload} disabled={!fileName}>
        Upload
      </Button>
    </div>
  )
}