declare module 'react-native-svg-charts' {
  export const BarChart: any;
  export const LineChart: any;
  export const PieChart: any;
  export const Grid: React.FC<{
    belowChart?: boolean;
    svg?: {
      stroke?: string;
      strokeWidth?: number;
      strokeOpacity?: number;
      [key: string]: any;
    };
  }>;
} 