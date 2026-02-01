import { Platform } from 'react-native';

/**
 * API Config
 * 
 * Android Emulator: 10.0.2.2
 * iOS Simulator: localhost
 * Physical Device: Your computer's local IP (e.g., 192.168.1.5)
 * Web: localhost
 */

// If you are using a physical device, replace 'localhost' with your computer's IP address
const LOCAL_IP = 'localhost';

export const API_BASE_URL = Platform.select({
    android: 'http://10.0.2.2:5000',
    ios: 'http://localhost:5000',
    default: `http://${LOCAL_IP}:5000`,
});

export const ITEMS_URL = `${API_BASE_URL}/items`;
