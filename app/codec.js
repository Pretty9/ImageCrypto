import RandomSequence from './random'

let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

// 块随机置乱
// 由于JPEG是分成8x8的块在块内压缩，分成8x8块处理可以避免压缩再解密造成的高频噪声
class ShuffleBlockCodec{
  constructor(imgData, seed) {
    this._imgData = imgData;
    this._seed = seed;
  }
  encrypt() {
    return this._doCommon((result, blockX, blockY, newBlockX, newBlockY) =>
      this._copyBlock(result, newBlockX, newBlockY, this._imgData, blockX, blockY)
    )
  }

  decrypt() {
    return this._doCommon((result, blockX, blockY, newBlockX, newBlockY) =>
      this._copyBlock(result, blockX, blockY, this._imgData, newBlockX, newBlockY)
    )
  }

  _doCommon(handleCopy) {
    // 尺寸不是8的倍数则去掉边界
    let blockWidth = Math.floor(this._imgData.width / 8);
    let blockHeight = Math.floor(this._imgData.height / 8);
    let result = ctx.createImageData(blockWidth * 8, blockHeight * 8);
    let seq = new RandomSequence(blockWidth * blockHeight, this._seed);
    for (let blockY = 0; blockY < blockHeight; blockY++) {
      for (let blockX = 0; blockX < blockWidth; blockX++) {
        let index = seq.next();
        let newBlockX = index % blockWidth;
        let newBlockY = Math.floor(index / blockWidth);
        handleCopy(result, blockX, blockY, newBlockX, newBlockY);
      }
    }
    return result;
  }

  _copyBlock(dstImgData, dstBlockX, dstBlockY, srcImgData, srcBlockX, srcBlockY) {
    let iDstStart = (dstBlockY * dstImgData.width + dstBlockX) * 8 * 4
    let iSrcStart = (srcBlockY * srcImgData.width + srcBlockX) * 8 * 4
    for (let y = 0; y < 8; y++) {
      for (let i = 0; i < 8 * 4; i++) {
        dstImgData.data[iDstStart + i] = srcImgData.data[iSrcStart + i]
      }
      iDstStart += dstImgData.width * 4
      iSrcStart += srcImgData.width * 4
    }
  }
}

export default ShuffleBlockCodec;