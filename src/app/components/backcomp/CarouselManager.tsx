'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CarouselManager() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);
    // Convert number to string explicitly
    formData.append('order', String(order));

    try {
      console.log('Submitting form data:', {
        fileName: selectedFile.name,
        title,
        order: String(order)
      });

      const response = await fetch('/api/carousel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Image uploaded successfully');
        setSelectedFile(null);
        setTitle('');
        setOrder(0);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 2) {
      setOrder(value);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Carousel Image Manager</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Order (0-2)</label>
          <input
            type="number"
            min={0}
            max={2}
            value={order}
            onChange={handleOrderChange}
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={!selectedFile || order < 0 || order > 2}
        >
          Upload Image
        </Button>
      </form>
    </div>
  );
}