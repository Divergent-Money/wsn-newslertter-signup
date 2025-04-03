
import React from 'react';

interface StarSparkleProps {
  className?: string;
  style?: React.CSSProperties;
}

const StarSparkle: React.FC<StarSparkleProps> = ({ className, style }) => {
  return (
    <svg 
      className={className} 
      style={style} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12,0L14.59,8.41L23,11L14.59,13.59L12,22L9.41,13.59L1,11L9.41,8.41L12,0Z" />
    </svg>
  );
};

export default StarSparkle;
