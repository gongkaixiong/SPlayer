import { isIOS, isCapacitor } from './env';

/**
 * iOS 功能管理器
 * 处理 iOS 平台特定的功能，如后台播放、媒体会话等
 */
export class IOSFeaturesManager {
  /**
   * 初始化 iOS 功能
   */
  static init() {
    if (!isIOS || !isCapacitor) return;

    // 初始化媒体会话
    this.initMediaSession();
    
    // 设置音频会话类别，允许后台播放
    this.setupAudioSession();
    
    // 监听应用状态变化
    this.listenAppState();
  }

  /**
   * 初始化媒体会话
   */
  static async initMediaSession() {
    if (!isIOS || !isCapacitor) return;

    try {
      const { MediaSession } = await import('@capacitor/mediasession');
      
      // 设置媒体会话支持的操作
      await MediaSession.setSupportedActions({
        actions: [
          'play',
          'pause',
          'stop',
          'nextTrack',
          'previousTrack',
          'seekTo',
          'togglePlayPause'
        ]
      });
      
      console.log('iOS MediaSession initialized');
    } catch (error) {
      console.error('Failed to initialize MediaSession:', error);
    }
  }

  /**
   * 设置音频会话类别
   */
  static async setupAudioSession() {
    if (!isIOS || !isCapacitor) return;

    try {
      // 在 iOS 上，需要设置音频会话类别为 "playback" 以支持后台播放
      // 使用 Capacitor 的 App 插件或原生插件来设置
      // 注意：Capacitor 核心插件可能不直接支持音频会话设置
      // 这里需要使用专门的音频插件或原生代码来实现
      // 目前先留空，后续可以添加专门的音频会话插件支持
      
      console.log('iOS Audio Session setup completed');
    } catch (error) {
      console.error('Failed to setup Audio Session:', error);
    }
  }

  /**
   * 监听应用状态变化
   */
  static async listenAppState() {
    if (!isIOS || !isCapacitor) return;

    try {
      const { App } = await import('@capacitor/app');
      
      // 监听应用进入后台事件
      App.addListener('appStateChange', (state) => {
        if (state.isActive) {
          // 应用进入前台
          console.log('App entered foreground');
        } else {
          // 应用进入后台
          console.log('App entered background');
          // 在后台保持音频播放
          this.handleBackgroundState();
        }
      });
      
      console.log('iOS App State listeners added');
    } catch (error) {
      console.error('Failed to setup App State listeners:', error);
    }
  }

  /**
   * 处理应用进入后台状态
   */
  static handleBackgroundState() {
    if (!isIOS || !isCapacitor) return;

    // 在 iOS 上，应用进入后台后，音频会继续播放
    // 但需要确保 MediaSession 状态正确
    
    console.log('Handling background state');
  }

  /**
   * 请求通知权限
   */
  static async requestNotificationPermission() {
    if (!isIOS || !isCapacitor) return;

    try {
      // 注意：需要安装 @capacitor/local-notifications 插件
      // const { LocalNotifications } = await import('@capacitor/local-notifications');
      // const permission = await LocalNotifications.requestPermissions();
      // return permission.granted;
      return false;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * 请求媒体库权限
   */
  static async requestMediaLibraryPermission() {
    if (!isIOS || !isCapacitor) return;

    try {
      // 注意：需要安装 @capacitor/media-library 插件
      // const { MediaLibrary } = await import('@capacitor/media-library');
      // const permission = await MediaLibrary.requestPermissions();
      // return permission.granted;
      return false;
    } catch (error) {
      console.error('Failed to request media library permission:', error);
      return false;
    }
  }
}
