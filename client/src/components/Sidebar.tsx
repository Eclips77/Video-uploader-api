import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, Library, ListMusic, Upload, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/videos', icon: <Film size={20} />, label: 'Videos' },
    { to: '/genres', icon: <Library size={20} />, label: 'Genres' },
    { to: '/playlists', icon: <ListMusic size={20} />, label: 'Playlists' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-white/10 z-50 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text tracking-tighter flex items-center gap-2">
          <Film className="text-primary" />
          StreamFlow
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary shadow-inner shadow-primary/5'
                  : 'text-textMuted hover:text-white hover:bg-white/5'
              )
            }
          >
            <span className="group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
         <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-1">Pro Status</h3>
            <p className="text-xs text-textMuted">Smart Encoding Active</p>
         </div>
      </div>
    </aside>
  );
};
