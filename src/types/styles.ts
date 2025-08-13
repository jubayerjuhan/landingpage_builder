export interface StyleObject {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  boxShadow?: string;
  customCSS?: string;
}

export interface ComponentStyle {
  id: string;
  name: string;
  styles: StyleObject;
  className?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  light: string;
  dark: string;
}

export interface DesignTokens {
  colors: ThemeColors;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    xxxl: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      monospace: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}