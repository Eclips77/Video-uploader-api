import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Plus, ListMusic, Trash2, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Playlists = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['playlists'],
        queryFn: async () => (await api.get('/playlists')).data.data
    });

    const createMutation = useMutation({
        mutationFn: async (name: string) => api.post('/playlists', { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            setIsCreateOpen(false);
            setNewPlaylistName('');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/playlists/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['playlists'] })
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Playlists</h1>
                    <p className="text-textMuted mt-1">Organize videos into collections.</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setIsCreateOpen(true)}>Create Playlist</Button>
            </div>

            <AnimatePresence>
                {isCreateOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <GlassCard className="p-4 mb-6 flex gap-3 items-center">
                            <input
                                autoFocus
                                placeholder="Playlist Name..."
                                className="input-field max-w-sm"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createMutation.mutate(newPlaylistName)}
                            />
                            <Button size="sm" onClick={() => createMutation.mutate(newPlaylistName)} isLoading={createMutation.isPending}>Create</Button>
                            <Button size="sm" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="text-textMuted">Loading playlists...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.map((playlist: any, i: number) => (
                        <motion.div key={playlist.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <GlassCard hoverEffect className="group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 bg-black/40 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors"
                                        onClick={() => deleteMutation.mutate(playlist.id)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-white/10 text-white">
                                        <ListMusic size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                                        <p className="text-sm text-textMuted">{playlist.videoIds.length} Videos</p>
                                    </div>
                                </div>

                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/3" />
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                                    <span className="text-textMuted text-xs">Updated recently</span>
                                    <button className="text-primary hover:text-primaryHover font-medium text-xs">Manage Videos →</button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
