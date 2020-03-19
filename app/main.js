import ShuffleBlockCodec from './codec';


let canvas = document.getElementById('crypto-canvas');
let context = canvas.getContext('2d');
let fileInput = document.getElementById('crypto-file');
let theSeed = '2020';


fileInput.onchange = function (event) {
  let file = event.target.files[0];
  let reader = new FileReader(file);
  let image = new Image();

  if(!file){  // 如果文件undefined
    let bar = document.getElementById('crypto-bar'); 
    bar.innerText = "";  // 清空工具栏
    context.clearRect(0, 0, canvas.width, canvas.height);  // 清空画布
    return;
  }

  reader.readAsDataURL(file);   // 将File对象转为DataURL
  reader.onload = function (e) {
    image.src = e.target.result;
  }


  image.onload = function (e) {
    [canvas.width, canvas.height] = [image.width, image.height];
    context.drawImage(image, 0, 0);  // 在画布绘制图像
    appendButton();
  };

};

function appendButton() {
  let bar = document.getElementById('crypto-bar');
  bar.innerText = "";
  let enBtn = document.createElement('button');
  enBtn.textContent = "加密";
  let deBtn = document.createElement('button');
  deBtn.textContent = "解密";
  let seedField = document.createElement('input');
  seedField.setAttribute('type', 'input');
  seedField.setAttribute('placeholder', 'Seed');
  let dlBtn = document.createElement('button');
  dlBtn.textContent = "下载";

  bar.appendChild(seedField);
  bar.appendChild(enBtn);
  bar.appendChild(deBtn);
  bar.appendChild(dlBtn);

  enBtn.onclick = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    theSeed = seedField.value.length > 0 ? seedField.value : '2020';
    console.log('加密种子:' + theSeed);

    let codec = new ShuffleBlockCodec(imageData, theSeed);
    context.putImageData(codec.encrypt(), 0, 0);
  };

  deBtn.onclick = function () {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    theSeed = seedField.value.length > 0 ? seedField.value : '2020';
    console.log('解密种子:' + theSeed);

    let codec = new ShuffleBlockCodec(imageData, theSeed);
    context.putImageData(codec.decrypt(), 0, 0);
  }

  dlBtn.onclick = function () {
    let fileName = encodeURI(theSeed) + '.jpg';  // 将seed进行URI编码，防止非法字符
    exportCanvasAsPNG(fileName);  // 保存为jpg
  }
}

function exportCanvasAsPNG(fileName) {

  let MIME_TYPE = "image/jpg";

  let imgURL = canvas.toDataURL(MIME_TYPE);

  let dlLink = document.createElement('a');
  dlLink.download = fileName;
  dlLink.href = imgURL;
  dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

  document.body.appendChild(dlLink);
  dlLink.click();
  document.body.removeChild(dlLink);
}
