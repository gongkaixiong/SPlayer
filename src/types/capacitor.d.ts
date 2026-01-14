/**
 * Capacitor 插件类型声明
 * 解决 TypeScript 找不到 Capacitor 插件模块的问题
 */

declare module '@capacitor/mediasession' {
  export interface MediaSession {
    setMetadata(metadata: {
      title: string;
      artist: string;
      album?: string;
      artwork?: Array<{ src: string }>;
    }): Promise<void>;
    setPlaybackState(state: {
      state: 'playing' | 'paused' | 'stopped';
    }): Promise<void>;
    setPositionState(state: {
      duration: number;
      playbackRate: number;
      position: number;
    }): Promise<void>;
    setSupportedActions(actions: {
      actions: Array<'play' | 'pause' | 'stop' | 'nextTrack' | 'previousTrack' | 'seekTo' | 'togglePlayPause'>;
    }): Promise<void>;
    addListener(event: string, listener: (data?: any) => void): Promise<{ remove: () => void }>;
  }
  export const MediaSession: MediaSession;
}

declare module '@capacitor/app' {
  export interface App {
    addListener(event: 'appStateChange', listener: (state: { isActive: boolean }) => void): Promise<{ remove: () => void }>;
    addListener(event: string, listener: (data?: any) => void): Promise<{ remove: () => void }>;
  }
  export const App: App;
}

declare module '@capacitor/filesystem' {
  export interface Filesystem {
    // 添加需要的 Filesystem 方法声明
  }
  export const Filesystem: Filesystem;
}

declare module '@capacitor/device' {
  export interface Device {
    // 添加需要的 Device 方法声明
  }
  export const Device: Device;
}

declare module '@capacitor/haptics' {
  export interface Haptics {
    // 添加需要的 Haptics 方法声明
  }
  export const Haptics: Haptics;
}

declare module '@capacitor/keyboard' {
  export interface Keyboard {
    // 添加需要的 Keyboard 方法声明
  }
  export const Keyboard: Keyboard;
}

declare module '@capacitor/splash-screen' {
  export interface SplashScreen {
    // 添加需要的 SplashScreen 方法声明
  }
  export const SplashScreen: SplashScreen;
}
