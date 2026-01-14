import { toRaw } from "vue";
import { usePlayerController } from "@/core/player/PlayerController";
import { useDataStore, useMusicStore, useStatusStore } from "@/stores";
import { SettingType } from "@/types/main";
import { handleProtocolUrl } from "@/utils/protocol";
import { cloneDeep } from "lodash-es";
import { toLikeSong } from "./auth";
import { isElectron, isCapacitor } from "./env";
import { getPlayerInfoObj } from "./format";
import { openSetting, openUpdateApp } from "./modal";
import { IpcManager } from "./ipc-manager";

// 关闭更新状态
const closeUpdateStatus = () => {
  const statusStore = useStatusStore();
  statusStore.updateCheck = false;
};

// 全局 IPC 事件
const initIpc = () => {
  try {
    // 只有在 Electron 或 Capacitor 环境下才初始化 IPC
    if (!isElectron && !isCapacitor) return;
    
    const player = usePlayerController();
    // 播放
    IpcManager.on("play", () => player.play());
    // 暂停
    IpcManager.on("pause", () => player.pause());
    // 播放或暂停
    IpcManager.on("playOrPause", () => player.playOrPause());
    // 上一曲
    IpcManager.on("playPrev", () => player.nextOrPrev("prev"));
    // 下一曲
    IpcManager.on("playNext", () => player.nextOrPrev("next"));
    // 音量加
    IpcManager.on("volumeUp", () => player.setVolume("up"));
    // 音量减
    IpcManager.on("volumeDown", () => player.setVolume("down"));
    // 播放模式切换
    IpcManager.on("changeRepeat", (mode) => player.toggleRepeat(mode));
    IpcManager.on("toggleShuffle", (mode) => player.toggleShuffle(mode));
    // 喜欢歌曲
    IpcManager.on("toggle-like-song", async () => {
      const dataStore = useDataStore();
      const musicStore = useMusicStore();
      await toLikeSong(musicStore.playSong, !dataStore.isLikeSong(musicStore.playSong.id));
    });
    // 开启设置
    IpcManager.on("openSetting", (type: SettingType, scrollTo?: string) =>
      openSetting(type, scrollTo),
    );
    // 桌面歌词开关
    IpcManager.on("toggle-desktop-lyric", () => player.toggleDesktopLyric());
    // 显式关闭桌面歌词
    IpcManager.on("close-desktop-lyric", () => player.setDesktopLyricShow(false));
    // 请求歌词数据
    IpcManager.on("request-desktop-lyric-data", () => {
      const musicStore = useMusicStore();
      const statusStore = useStatusStore();
      if (player) {
        const { name, artist } = getPlayerInfoObj() || {};
        IpcManager.send(
          "update-desktop-lyric-data",
          cloneDeep({
            playStatus: statusStore.playStatus,
            playName: name,
            artistName: artist,
            currentTime: statusStore.currentTime,
            songId: musicStore.playSong?.id,
            songOffset: statusStore.getSongOffset(musicStore.playSong?.id),
            lrcData: musicStore.songLyric.lrcData ?? [],
            yrcData: musicStore.songLyric.yrcData ?? [],
            lyricIndex: statusStore.lyricIndex,
            lyricLoading: statusStore.lyricLoading,
          }),
        );
      }
    });
    // 无更新
    IpcManager.on("update-not-available", () => {
      closeUpdateStatus();
      window.$message.success("当前已是最新版本");
    });
    // 有更新
    IpcManager.on("update-available", (info) => {
      closeUpdateStatus();
      openUpdateApp(info);
    });
    // 更新错误
    IpcManager.on("update-error", (error) => {
      console.error("Error updating:", error);
      closeUpdateStatus();
      window.$message.error("更新过程出现错误");
    });
    // 协议数据
    IpcManager.on("protocol-url", (url) => {
      console.log("📡 Received protocol url:", url);
      handleProtocolUrl(url);
    });
    // 请求播放信息
    IpcManager.on("request-track-info", () => {
      const musicStore = useMusicStore();
      const statusStore = useStatusStore();
      const { name, artist, album } = getPlayerInfoObj() || {};
      // 获取原始对象
      const playSong = toRaw(musicStore.playSong);
      const songLyric = statusStore.lyricLoading
        ? { lrcData: [], yrcData: [] }
        : toRaw(musicStore.songLyric);
      IpcManager.send(
        "return-track-info",
        cloneDeep({
          playStatus: statusStore.playStatus,
          playName: name,
          artistName: artist,
          albumName: album,
          currentTime: statusStore.currentTime,
          // 音量及播放速率
          volume: statusStore.playVolume,
          playRate: statusStore.playRate,
          ...playSong,
          // 歌词及加载状态
          lyricLoading: statusStore.lyricLoading,
          lyricIndex: statusStore.lyricIndex,
          ...songLyric,
        }),
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export default initIpc;
