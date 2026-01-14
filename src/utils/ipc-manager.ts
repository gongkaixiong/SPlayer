import { isElectron, isCapacitor } from './env';
import type { MediaMetadataParam, MediaPlaybackStatus, MediaTimelineParam, MediaPlayModeParam, MediaEvent } from '../types/global';

/**
 * 统一的IPC通信管理器
 * 提供跨平台的IPC通信接口，支持Electron和Capacitor环境
 */
export class IpcManager {
  /**
   * 发送媒体元数据更新
   */
  static sendMediaMetadata(metadata: MediaMetadataParam): void {
    if (isElectron) {
      window.electron.ipcRenderer.send('media-update-metadata', metadata);
    } else if (isCapacitor) {
      // Capacitor环境下使用MediaSession插件
      import('@capacitor/mediasession').then(({ MediaSession }) => {
        MediaSession.setMetadata({
          title: metadata.songName,
          artist: metadata.authorName,
          album: metadata.albumName,
          artwork: metadata.coverUrl ? [{ src: metadata.coverUrl }] : undefined
        });
      });
    }
  }

  /**
   * 发送播放状态更新
   */
  static sendPlayState(status: MediaPlaybackStatus): void {
    if (isElectron) {
      window.electron.ipcRenderer.send('media-update-play-state', { status });
    } else if (isCapacitor) {
      // Capacitor环境下使用MediaSession插件
      import('@capacitor/mediasession').then(({ MediaSession }) => {
        if (status === 'Playing') {
          MediaSession.setPlaybackState({ state: 'playing' });
        } else {
          MediaSession.setPlaybackState({ state: 'paused' });
        }
      });
    }
  }

  /**
   * 发送时间线更新
   */
  static sendTimeline(timeline: MediaTimelineParam): void {
    if (isElectron) {
      window.electron.ipcRenderer.send('media-update-timeline', timeline);
    } else if (isCapacitor) {
      // Capacitor环境下使用MediaSession插件
      import('@capacitor/mediasession').then(({ MediaSession }) => {
        MediaSession.setPositionState({
          duration: timeline.totalTime,
          playbackRate: 1.0,
          position: timeline.currentTime
        });
      });
    }
  }

  /**
   * 发送播放模式更新
   */
  static sendPlayMode(playMode: MediaPlayModeParam): void {
    if (isElectron) {
      window.electron.ipcRenderer.send('media-update-play-mode', playMode);
    } else if (isCapacitor) {
      // Capacitor环境下暂不处理播放模式更新
    }
  }

  /**
   * 发送音量更新
   */
  static sendVolume(volume: number): void {
    if (isElectron) {
      window.electron.ipcRenderer.send('media-update-volume', { volume });
    } else if (isCapacitor) {
      // Capacitor环境下暂不处理音量更新
    }
  }

  /**
   * 监听媒体事件
   */
  static onMediaEvent(listener: (event: MediaEvent) => void): void {
    if (isElectron) {
      window.electron.ipcRenderer.on('media-event', (_, payload) => {
        listener(payload);
      });
    } else if (isCapacitor) {
      // Capacitor环境下使用MediaSession插件监听媒体事件
      import('@capacitor/mediasession').then(({ MediaSession }) => {
        MediaSession.addListener('play', () => {
          listener({ type: 'play' });
        });
        
        MediaSession.addListener('pause', () => {
          listener({ type: 'pause' });
        });
        
        MediaSession.addListener('stop', () => {
          listener({ type: 'stop' });
        });
        
        MediaSession.addListener('nextTrack', () => {
          listener({ type: 'next' });
        });
        
        MediaSession.addListener('previousTrack', () => {
          listener({ type: 'previous' });
        });
        
        MediaSession.addListener('seekTo', (data) => {
          listener({ type: 'seek', value: data.position / 1000 }); // 转换为秒
        });
        
        MediaSession.addListener('togglePlayPause', () => {
          listener({ type: 'toggle-play-pause' });
        });
      });
    }
  }

  /**
   * 发送自定义事件
   */
  static send(channel: string, ...args: any[]): void {
    if (isElectron) {
      window.electron.ipcRenderer.send(channel, ...args);
    } else if (isCapacitor) {
      // Capacitor环境下暂不处理自定义事件
    }
  }

  /**
   * 监听自定义事件
   */
  static on(channel: string, listener: (...args: any[]) => void): void {
    if (isElectron) {
      window.electron.ipcRenderer.on(channel, (_, ...args) => {
        listener(...args);
      });
    } else if (isCapacitor) {
      // Capacitor环境下暂不处理自定义事件
    }
  }

  /**
   * 调用异步方法
   */
  static async invoke(channel: string, ...args: any[]): Promise<any> {
    if (isElectron) {
      return window.electron.ipcRenderer.invoke(channel, ...args);
    } else if (isCapacitor) {
      // Capacitor环境下根据channel调用不同的插件方法
      switch (channel) {
        case 'mpv-play':
          // 在Capacitor环境下，音频播放由前端引擎处理，不需要调用原生方法
          return Promise.resolve({ success: true });
        case 'win-min':
        case 'win-max':
        case 'win-restore':
        case 'win-hide':
        case 'win-reload':
        case 'open-dev-tools':
        case 'quit-app':
          // 窗口控制相关方法在Capacitor环境下不需要实现
          return Promise.resolve();
        default:
          return Promise.resolve();
      }
    }
    return Promise.resolve();
  }
}
