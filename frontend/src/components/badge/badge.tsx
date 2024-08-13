// Badge.tsx
import React from 'react';

// Define the types for the Badge component's props
interface BadgeProps {
  badgeContent: React.ReactNode;
  color?: string;
  max?: number;
  showZero?: boolean;
  variant?: 'standard' | 'dot';
  children: React.ReactNode; // Add this line to accept children
}

// Badge component definition
const Badge: React.FC<BadgeProps> = ({
  badgeContent,
  color = 'bg-red-500',
  max = 99,
  showZero = false,
  variant = 'standard',
  children
}) => {
  const isDot = variant === 'dot';
  const content =
    typeof badgeContent === 'number' && badgeContent > max
      ? `${max}+`
      : badgeContent;

  return (
    <div className="relative inline-block">
      {children}
      {isDot ? (
        <span
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${color}`}
        ></span>
      ) : (
        !!badgeContent &&
        (showZero || badgeContent !== 0) && (
          <span
            className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-bold text-white rounded-full ${color}`}
          >
            {content}
          </span>
        )
      )}
    </div>
  );
};

export default Badge;
