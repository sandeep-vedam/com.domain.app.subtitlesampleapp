import Hls from 'hls.js';

import {
  Lightning,
  Storage,
  Subtitles,
  VideoPlayer,
} from '@lightningjs/sdk';

import ClosedCaption from '../components/ClosedCaption';
import Loader from '../components/Loader';
import {
  getDefaultSettings,
  normalizeSettings,
} from '../lib/Settings';

export default class Player extends Lightning.Component {
  static _template() {
    return {
      Loader: {
        alpha: 0,
        x: 939,
        y: 519,
        type: Loader,
      },
      ClosedCaptionConfig: {
        zIndex: 4,
        type: ClosedCaption,
      },
    }
  }

  _init() {
    VideoPlayer.consumer(this)
    this._videoPlayer = null
    this._HLSLoader = (url, videoEl) => {
      return new Promise((resolve) => {
        if (
          this._videoPlayer &&
          this._videoPlayer.destroy &&
          typeof this._videoPlayer.destroy === 'function'
        ) {
          this._videoPlayer.destroy()
        }
        let video = document.getElementById('video-player')
        video.style.display = 'block'
        let hlsConfig = {
          enableWorker: false,
          debug: false,
          liveBackBufferLength: 0,
          maxBufferHole: 2.0,
          maxMaxBufferLength: 6,
          maxBufferSize: 10 * 1024 * 1024,
          maxBufferLength: 2,
          enableCEA708Captions: true,
        }

        this._videoPlayer = new Hls(hlsConfig)
        console.log('HLS >>> initialized')

        this._videoPlayer.autoLevelCapping = hlsConfig.autoLevelCapping
          ? hlsConfig.autoLevelCapping
          : -1

        this._videoPlayer.attachMedia(video)
        this._videoPlayer.on(Hls.Events.MEDIA_ATTACHED, () => {
          this._videoPlayer.loadSource(url)
        })

        this._videoPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play()
          resolve()
        })

        this._videoPlayer.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('HLS >>>> MEDIA_ERROR')
                this._videoPlayer.recoverMediaError()
                break

              case Hls.ErrorTypes.NETWORK_ERROR:
                switch (data.details) {
                  case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                    console.log('HLS >>>> FRAG_LOAD_ERROR')
                    this._videoPlayer.currentLevel = data.frag.start + data.frag.duration + 0.1
                    break

                  default:
                    console.log('HLS >>>> NETWORK_ERROR')
                    this._videoPlayer.recoverMediaError()
                    break
                }
                break

              default:
                this._videoPlayer.destroy()
                break
            }
          } else if (data.details === 'bufferStalledError') {
            console.log('HLS >>>> BUFFER STALLED ')
            // HLS automatically recovers in case of non-fatal errors.
          }
        })
      })
    }
    this._HLSunLoader = (videoEl) => {
      return new Promise((resolve) => {
        if (
          this._videoPlayer &&
          this._videoPlayer.destroy &&
          typeof this._videoPlayer.destroy === 'function'
        ) {
          this._videoPlayer.destroy()
        }

        videoEl.removeAttribute('src')
        videoEl.load()
        resolve()
      })
    }

    let ccs = Storage.get('ClosedCaptionSettings');
    if(!ccs) {
      ccs = getDefaultSettings();
    }
    else {
      ccs = normalizeSettings(ccs);
    }
    Subtitles.styles(ccs); 
  }
  _active() {
    VideoPlayer.unloader(this._HLSunLoader)
    VideoPlayer.loader(this._HLSLoader)
    // VideoPlayer.open('https://d17bp2kqyryk7s.cloudfront.net/TWNQCCONT.m3u8')
    https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
    // Tastemade stream
    VideoPlayer.open(
      'https://cdn-uw2-prod.tsv2.amagi.tv/linear/tastemade-tastemademetrological/playlist.m3u8?uid=ee6723b8-7ab3-462c-8d93-dbf61227998e',
    )
    this.tag('Loader').show();
    this._setState('Play')
  }

  $videoPlayerPlaying() {
    this.tag('Loader').hide();
  }

  $videoPlayerTimeUpdate() {
    const video = document.getElementById('video-player')
    let activeCues = [];
    for (let i = 0; i < video.textTracks.length; i++) {
      if (video.textTracks[i].kind === 'captions' && video.textTracks[i].cues.length) {
        const cues = video.textTracks[i].activeCues;
        for(let j = 0; j < cues.length; j++) {
          activeCues.push(cues[j]);
        }
        break;
      }
    }
    if (activeCues && activeCues.length > 0) {
      let caption = activeCues.sort((a, b) => a.line - b.line).map((c) => c.text).join('\n');
      if(caption !== this._currentCaption) {
        Subtitles.text(caption)
        this._currentCaption = caption
      }
    } else {
      this._currentCaption = '';
      Subtitles.clear()
    }
  }

  $videoPlayerLoadedData() {
    Subtitles.show()
  }

  $videoPlayerCanPlay() {
    VideoPlayer.play()
  }

  _inactive() {
    VideoPlayer.close()
  }

  static _states() {
    return [
      class Settings extends this {
        $enter() {
          this.tag('ClosedCaptionConfig').show()
        }

        $exit() {
          this.tag('ClosedCaptionConfig').hide()
        }
        _getFocused() {
          return this.tag('ClosedCaptionConfig')
        }

        _handleUp() {
          this._setState('Play')
        }
      },
      class Play extends this {
        _handlePlay() {
          VideoPlayer.play()
        }

        _handleKey() {
          this._setState('Settings')
        }
        _getFocused() {
          return this
        }
      },
    ]
  }
}
