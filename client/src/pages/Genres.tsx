import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Genres = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['genres'],
        queryFn: async () => (await api.get('/genres')).data.data
    });

    const createMutation = useMutation({
        mutationFn: async (name: string) => api.post('/genres', { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres'] });
            setIsCreateOpen(false);
            setNewGenreName('');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/genres/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['genres'] })
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Genres</h1>
                    <p className="text-textMuted mt-1">Categorize your video content.</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setIsCreateOpen(true)}>Create Genre</Button>
            </div>

            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <GlassCard className="p-4 mb-6 flex gap-3 items-center">
                            <input
                                autoFocus
                                placeholder="Enter genre name..."
                                className="input-field max-w-sm"
                                value={newGenreName}
                                onChange={(e) => setNewGenreName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createMutation.mutate(newGenreName)}
                            />
                            <Button size="sm" onClick={() => createMutation.mutate(newGenreName)} isLoading={createMutation.isPending}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="text-textMuted">Loading genres...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data?.map((genre: any, i: number) => (
                        <motion.div key={genre.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                            <GlassCard hoverEffect className="flex justify-between items-center group">
                                <span className="font-medium text-white">{genre.name}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-white/10 rounded-md text-textMuted hover:text-white transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-red-500/20 rounded-md text-textMuted hover:text-red-400 transition-colors"
                                        onClick={() => deleteMutation.mutate(genre.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
