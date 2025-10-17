import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import SpotlightCard from './SpotlightCard';

interface Tab {
  id: string;
  label: string;
  desc: string;
  icon?: string;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: Tab[];
}

const defaultTabs: Tab[] = [
  { id: 'home', label: '🏠 Home', desc: 'About PsyChat', icon: '🏠' },
  { id: 'chat', label: '💬 Chat', desc: 'Therapy Notes', icon: '💬' },
  { id: 'marketplace', label: '🏪 Marketplace', desc: 'Data Trading', icon: '🏪' },
  { id: 'dashboard', label: '📊 Dashboard', desc: 'Earnings & Yield', icon: '📊' },
];

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  tabs = defaultTabs
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [activeTab, isMobile]);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const mobileMenuVariants: Variants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const mobileTabVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Mobile hamburger menu
  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <SpotlightCard className="p-2" spotlightColor="rgba(97, 179, 220, 0.2)">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  variants={mobileTabVariants}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-psy-purple-500 to-psy-blue-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => onTabChange(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-psy-purple-500/20 to-psy-blue-500/20 rounded-2xl blur-xl" />
      
      <SpotlightCard 
        className="p-1" 
        spotlightColor="rgba(97, 179, 220, 0.2)"
      >
        {isMobile ? (
          <div className="relative">
            {/* Mobile hamburger button */}
            <motion.button
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">
                  {tabs.find(tab => tab.id === activeTab)?.icon}
                </span>
                <div className="text-left">
                  <div className="font-medium text-white">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </div>
                  <div className="text-xs text-white/60">
                    {tabs.find(tab => tab.id === activeTab)?.desc}
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-white/60"
              >
                ▼
              </motion.div>
            </motion.button>
            
            {/* Mobile menu dropdown */}
            <MobileMenu />
          </div>
        ) : (
          /* Desktop navigation */
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                variants={tabVariants}
                className={`
                  relative flex-1 px-6 py-4 rounded-xl transition-all duration-300 overflow-hidden
                  ${activeTab === tab.id
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  }
                `}
                onHoverStart={() => setHoveredTab(tab.id)}
                onHoverEnd={() => setHoveredTab(null)}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-psy-purple-500 to-psy-blue-500 rounded-xl"
                  initial={false}
                  animate={{
                    opacity: activeTab === tab.id ? 1 : 0,
                    scale: hoveredTab === tab.id ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Cyberpunk corner accents for active tab */}
                {activeTab === tab.id && (
                  <>
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan-400 rounded-br-lg" />
                  </>
                )}
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="text-sm font-semibold mb-1"
                    animate={{
                      scale: activeTab === tab.id ? 1.05 : 1
                    }}
                  >
                    {tab.label}
                  </motion.div>
                  <motion.div 
                    className="text-xs opacity-75"
                    animate={{
                      opacity: activeTab === tab.id ? 1 : 0.75
                    }}
                  >
                    {tab.desc}
                  </motion.div>
                </div>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-8 h-1 bg-cyber-cyan-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </SpotlightCard>
    </motion.nav>
  );
};

export default Navigation;
