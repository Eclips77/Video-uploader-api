import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { GlassCard } from '../components/ui/GlassCard';
import { Film, ListMusic, Library, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <GlassCard hoverEffect className="relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
       {React.cloneElement(icon, { size: 60 })}
    </div>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-surfaceLight ${color} bg-opacity-10 text-white`}>
        {icon}
      </div>
      <div>
        <p className="text-textMuted text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </div>
  </GlassCard>
);

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="text-white">Loading stats...</div>;

  const stats = [
    { title: 'Total Videos', value: data.totalVideos, icon: <Film />, color: 'text-primary' },
    { title: 'Genres', value: data.totalGenres, icon: <Library />, color: 'text-secondary' },
    { title: 'Playlists', value: data.totalPlaylists, icon: <ListMusic />, color: 'text-accent' },
    { title: 'Active Encodings', value: 'Idle', icon: <Activity />, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-textMuted">Welcome back to your video management center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <GlassCard className="col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
               <TrendingUp className="text-primary" size={20} />
               Recent Uploads
            </h2>
            <div className="space-y-4">
               {data.recentVideos.length === 0 ? (
                   <div className="text-textMuted text-center py-8">No videos uploaded yet.</div>
               ) : (
                   data.recentVideos.map((video: any) => (
                       <div key={video.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-white/5">
                           <div className="w-16 h-10 bg-surfaceLight rounded overflow-hidden relative">
                              {/* Placeholder for thumbnail since we don't strictly generate them yet, usually ffmpeg can. Using video tag as robust fallback */}
                              <video src={`http://localhost:3000/${video.filePath}`} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                               <h4 className="font-medium text-white truncate">{video.title}</h4>
                               <p className="text-xs text-textMuted">{video.creator} • {new Date(video.uploadTime).toLocaleDateString()}</p>
                           </div>
                           <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                               {video.filePath.split('.').pop()?.toUpperCase()}
                           </div>
                       </div>
                   ))
               )}
            </div>
         </GlassCard>

         <GlassCard>
             <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
             <div className="space-y-3">
                 <button className="w-full p-3 text-left rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm flex items-center gap-2">
                    <Film size={16} /> Upload New Video
                 </button>
                 <button className="w-full p-3 text-left rounded-lg bg-surfaceLight hover:bg-white/10 transition-colors font-medium text-sm text-textMuted hover:text-white flex items-center gap-2">
                    <Library size={16} /> Create Genre
                 </button>
                 <button className="w-full p-3 text-left rounded-lg bg-surfaceLight hover:bg-white/10 transition-colors font-medium text-sm text-textMuted hover:text-white flex items-center gap-2">
                    <ListMusic size={16} /> Create Playlist
                 </button>
             </div>
         </GlassCard>
      </div>
    </div>
  );
};
