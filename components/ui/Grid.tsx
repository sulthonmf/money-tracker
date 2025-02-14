import React from 'react';
import { Grid as SVGGrid } from 'react-native-svg-charts';

type GridProps = {
  belowChart?: boolean;
  svg?: {
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    [key: string]: any;
  };
};

export function Grid({ 
  belowChart = true, 
  svg = { stroke: 'rgba(0,0,0,0.1)' } 
}: GridProps) {
  // Buat objek props baru tanpa defaultProps
  const gridProps = {
    belowChart,
    svg
  };

  // Pass props langsung ke SVGGrid
  return <SVGGrid {...gridProps} />;
} 