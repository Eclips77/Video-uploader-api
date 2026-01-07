import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Search, Upload, Filter, Play, MoreVertical, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Videos = () => {
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['videos', search],
    queryFn: async () => {
      const res = await api.get('/videos', { params: { q: search } });
      return res.data.data;
    }
  });

  const { data: genresData } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => (await api.get('/genres')).data.data
  });

  const genreMap = React.useMemo(() => {
    if (!genresData) return {};
    return genresData.reduce((acc: any, genre: any) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  }, [genresData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-white">Video Library</h1>
            <p className="text-textMuted mt-1">Manage and watch your encoded videos.</p>
         </div>
         <Button icon={<Upload size={18} />} onClick={() => setIsUploadModalOpen(true)}>
            Upload Video
         </Button>
      </div>

      {/* Search & Filter Bar */}
      <GlassCard className="p-4 flex gap-4 items-center">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input
               type="text"
               placeholder="Search videos by title, creator..."
               className="w-full bg-surfaceLight border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-textMuted/50"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <Button variant="secondary" icon={<Filter size={18} />}>Filters</Button>
      </GlassCard>

      {/* Video Grid */}
      {isLoading ? (
          <div className="text-center py-20 text-textMuted">Loading library...</div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.map((video: any, i: number) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                     <GlassCard className="p-0 overflow-hidden group hover:border-primary/50 transition-colors h-full flex flex-col">
                        <div className="aspect-video bg-black relative group-hover:opacity-90 transition-opacity">
                            <video src={`http://localhost:3000/${video.filePath}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                   <Play fill="currentColor" size={20} className="ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <h3 className="font-semibold text-white line-clamp-1" title={video.title}>{video.title}</h3>
                                 <p className="text-xs text-textMuted mt-1">{video.creator}</p>
                              </div>
                              <button className="text-textMuted hover:text-white transition-colors">
                                 <MoreVertical size={16} />
                              </button>
                           </div>

                           <div className="mt-auto flex gap-2 flex-wrap">
                               {video.genres.map((g: string) => (
                                   <span key={g} className="text-[10px] px-2 py-1 bg-white/5 rounded-full text-textMuted border border-white/5">
                                      {genreMap[g] || g}
                                   </span>
                               ))}
                           </div>
                        </div>
                     </GlassCard>
                  </motion.div>
              ))}
          </div>
      )}

      {/* Upload Modal (Simplified for this file) */}
      <AnimatePresence>
        {isUploadModalOpen && (
           <UploadModal onClose={() => setIsUploadModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const UploadModal = ({ onClose }: { onClose: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({ title: '', creator: '', description: '', targetAudience: '', language: '', genres: [] as string[] });
    const queryClient = useQueryClient();

    // Fetch genres for selection
    const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: async () => (await api.get('/genres')).data.data });

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return api.post('/videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videos'] });
            onClose();
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!file) return;

        const formData = new FormData();
        formData.append('video', file);
        Object.entries(metadata).forEach(([k, v]) => {
             if (k === 'genres' && Array.isArray(v)) {
                 v.forEach((id: string) => formData.append('genres', id));
             } else {
                 formData.append(k, v as string);
             }
        });

        // Manual fix for genres to ensure array sends correctly
        // Actually our backend busboy handler expects multiple fields or JSON.
        // Let's send multiple fields.

        uploadMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
            />
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
               className="relative w-full max-w-lg glass-panel bg-[#121212] border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Upload Video</h2>
                    <button onClick={onClose} className="text-textMuted hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {!file ? (
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                            <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            <Upload className="mx-auto text-primary mb-3" size={32} />
                            <p className="text-white font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-textMuted mt-1">MP4, MOV, AVI up to 2GB</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <Film className="text-primary" />
                            <span className="text-sm text-white truncate flex-1">{file.name}</span>
                            <button type="button" onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         <input required placeholder="Title" className="input-field" value={metadata.title} onChange={e => setMetadata({...metadata, title: e.target.value})} />
                         <input required placeholder="Creator" className="input-field" value={metadata.creator} onChange={e => setMetadata({...metadata, creator: e.target.value})} />
                    </div>
                    <textarea required placeholder="Description" className="input-field min-h-[80px]" value={metadata.description} onChange={e => setMetadata({...metadata, description: e.target.value})} />

                    <div className="grid grid-cols-2 gap-4">
                        <select className="input-field" required value={metadata.language} onChange={e => setMetadata({...metadata, language: e.target.value})}>
                            <option value="" disabled>Select Language</option>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                        <select className="input-field" required value={metadata.targetAudience} onChange={e => setMetadata({...metadata, targetAudience: e.target.value})}>
                            <option value="" disabled>Target Audience</option>
                            <option value="General">General</option>
                            <option value="Kids">Kids</option>
                            <option value="Adults">Adults</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-textMuted mb-2 block">Genres</label>
                        <div className="flex flex-wrap gap-2">
                             {genres?.map((g: any) => (
                                 <button
                                    key={g.id}
                                    type="button"
                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${metadata.genres.includes(g.id) ? 'bg-primary text-white border-primary' : 'bg-surfaceLight text-textMuted border-white/10 hover:border-white/30'}`}
                                    onClick={() => {
                                        if (metadata.genres.includes(g.id)) {
                                            setMetadata({...metadata, genres: metadata.genres.filter(id => id !== g.id)});
                                        } else {
                                            setMetadata({...metadata, genres: [...metadata.genres, g.id]});
                                        }
                                    }}
                                 >
                                    {g.name}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={uploadMutation.isPending} disabled={!file}>
                            {uploadMutation.isPending ? 'Encoding...' : 'Upload Video'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
