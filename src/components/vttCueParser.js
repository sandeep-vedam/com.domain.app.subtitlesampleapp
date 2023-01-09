export default class VttCueParser {
  static clearCurrentSubtitle() {
    this._currentSubtitle = null
    this._nextSubtitle = null
  }

  static getSubtitleByTimeIndex(subtitlesList, timeIndex) {
    let self = this
    if (
      subtitlesList &&
      subtitlesList.length &&
      this._currentSubtitle &&
      this._nextSubtitle &&
      timeIndex < this._nextSubtitle.endTime &&
      timeIndex >= this._currentSubtitle.startTime
    ) {
      if (
        timeIndex >= this._currentSubtitle.startTime &&
        timeIndex < this._currentSubtitle.endTime
      ) {
        return this._currentSubtitle.text
      } else if (
        timeIndex >= this._nextSubtitle.startTime &&
        timeIndex < this._nextSubtitle.endTime
      ) {
        return this._nextSubtitle.text
      } else {
        return ''
      }
    } else {
      updateSubtitles()
    }

    function updateSubtitles() {
      if (subtitlesList && subtitlesList.length) {
        if (timeIndex <= subtitlesList[subtitlesList.length - 1].startTime) {
          if (timeIndex < subtitlesList[0].endTime) {
            if (subtitlesList[1] && subtitlesList[1].text) {
              self._nextSubtitle = subtitlesList[1]
            }
            self._currentSubtitle = subtitlesList[0]
          } else {
            for (let i = 0; i < subtitlesList.length; i++) {
              if (subtitlesList[i].startTime >= timeIndex) {
                subtitlesList[i + 1] && subtitlesList[i + 1].text
                  ? (self._nextSubtitle = subtitlesList[i + 1])
                  : { text: '' }
                self._currentSubtitle = subtitlesList[i]
                break
              }
            }
          }
        }
      }
    }
  }
}
