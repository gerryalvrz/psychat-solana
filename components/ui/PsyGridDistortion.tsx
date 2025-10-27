import React from 'react';
import GridDistortion from './GridDistortion';

interface PsyGridDistortionProps {
  imageSrc: string;
  className?: string;
  variant?: 'hero' | 'background' | 'card' | 'overlay';
  intensity?: 'subtle' | 'medium' | 'strong';
  onError?: () => void;
}

const PsyGridDistortion: React.FC<PsyGridDistortionProps> = ({
  imageSrc,
  className = '',
  variant = 'background',
  intensity = 'medium',
  onError
}) => {
  // Configuration based on variant and intensity
  const getConfig = () => {
    const baseConfig = {
      grid: 15,
      mouse: 0.1,
      strength: 0.15,
      relaxation: 0.9,
    };

    const intensityMultipliers = {
      subtle: { strength: 0.5, mouse: 0.5 },
      medium: { strength: 1.0, mouse: 1.0 },
      strong: { strength: 1.5, mouse: 1.5 },
    };

    const variantConfigs = {
      hero: {
        grid: 20,
        className: 'z-0',
        style: { minHeight: '100vh' }
      },
      background: {
        grid: 15,
        className: 'z-0',
        style: { position: 'absolute', inset: 0 }
      },
      card: {
        grid: 12,
        className: 'z-0 rounded-lg overflow-hidden',
        style: { minHeight: '300px' }
      },
      overlay: {
        grid: 18,
        className: 'z-10',
        style: { position: 'absolute', inset: 0 }
      }
    };

    const intensityConfig = intensityMultipliers[intensity];
    const variantConfig = variantConfigs[variant];

    return {
      ...baseConfig,
      strength: baseConfig.strength * intensityConfig.strength,
      mouse: baseConfig.mouse * intensityConfig.mouse,
      grid: variantConfig.grid,
      className: `${variantConfig.className} ${className}`,
      style: variantConfig.style
    };
  };

  const config = getConfig();

  return (
    <div 
      className={`relative ${config.className}`}
      style={config.style}
    >
      <GridDistortion
        imageSrc={imageSrc}
        grid={config.grid}
        mouse={config.mouse}
        strength={config.strength}
        relaxation={config.relaxation}
        className="w-full h-full"
        fallbackImage="/assets/grid-distortion/default-bg.jpg"
        onError={onError}
      />
      
      {/* PsyChat themed overlay for certain variants */}
      {variant === 'hero' && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-psy-purple/5 to-transparent pointer-events-none" />
      )}
      
      {variant === 'overlay' && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/20 pointer-events-none" />
      )}
    </div>
  );
};

export default PsyGridDistortion;
