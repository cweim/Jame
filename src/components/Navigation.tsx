import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/feed', label: 'Jobs', icon: '💼' },
    { path: '/dashboard', label: 'Track', icon: '📊' },
    { path: '/ai-chat', label: 'AI Chat', icon: '🤖' },
    { path: '/settings', label: 'Profile', icon: '👤' }
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center items-center py-4">
            <h1 className="text-title-medium" style={{ color: 'var(--color-primary)' }}>
              Jame
            </h1>
            <p className="text-caption mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Job Application Made Easy
            </p>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container mx-auto">
          <div className="flex justify-around items-center h-20 px-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center px-3 py-2 transition-all duration-200 hover:scale-105 relative"
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div 
                      className="absolute -top-1 w-8 h-1 rounded-full animate-slide-in"
                      style={{ background: 'var(--color-primary)' }}
                    />
                  )}
                  
                  {/* Icon with background for active state */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-1 transition-all ${isActive ? 'shadow-sm' : ''}`}
                       style={{ 
                         background: isActive ? 'var(--color-primary-light)' : 'transparent'
                       }}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  
                  {/* Label */}
                  <span className="text-caption font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;