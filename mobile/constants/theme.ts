export const COLORS = {

  primary: '#007AFF', // Bright Blue
  secondary: '#5856D6',
  success: '#34C759', // Green
  warning: '#FF9500', // Orange
  danger: '#FF3B30', // Red

  background: '#F2F2F7', // Light Gray Background
  card: '#FFFFFF',

  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    light: '#C7C7CC',
    inverse: '#FFFFFF'
  },

  border: '#E5E5EA',

  badge: {
    inProgress: { bg: '#EBF3FF', text: '#007AFF' },
    pending: { bg: '#FFF8E6', text: '#FF9500' },
    done: { bg: '#E8FAEF', text: '#34C759' },
  }
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  }
};

export const Fonts = {
  rounded: 'System', // Fallback to System if fonts aren't loaded
  mono: 'SpaceMono',
};

export const Colors = COLORS;
