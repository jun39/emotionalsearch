let dataUri
const makeblob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
 /**
 * 入力欄とか、画像やJSONを表示する要素を取得しておく
 */ 
document.getElementById('selectImageButton').addEventListener('change', function (e) {
    // 1枚だけ表示する
    var file = e.target.files[0];

    // ファイルリーダー作成
    var fileReader = new FileReader();
    fileReader.onload = function() {
        // Data URIを取得
        dataUri = this.result;

        // img要素に表示
        var img = document.getElementById('sourceImage');
        img.src = dataUri;
        

        processImage()
        
    }
      
    // ファイルをData URIとして読み込む
    fileReader.readAsDataURL(file);
});

const inputImage = document.getElementById("inputImage")
const displayImage = document.getElementById("sourceImage")
const displayJson = document.getElementById("responseTextArea")
console.log(inputImage);
/**
 * ボタンを押したときに実行される関数。
 * htmlの15行目でonclickに書いている。
 * <button onclick="processImage()">Analyze face</button>
 */
const processImage = ()=>{

    /**
     * アクセス先のURLを作る。
     * URLにはクエリパラメータをつけることができ、これにより解析条件の細かい設定ができる。
     */
    const uriBase ="https://japaneast.api.cognitive.microsoft.com/face/v1.0/detect";
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": [
            "age","gender","headPose",
            "smile","facialHair","glasses",
            "emotion","hair","makeup",
            "occlusion","accessories","blur",
            "exposure","noise"
        ].join(',')
    };
    // Object.keys〜以降は上のparamsをもとにクエリパラメータを作っている。よくわからなくても大丈夫。
    const url = uriBase + '?' + Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    

    /**
     * データを送信する。
     * 結果がかえってきたらthen以下に処理が進む。
     * この辺も今度詳しく説明します。
     */
    const subscriptionKey = "キー名を入力する";
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
            processData: false,
        },
        body: makeblob(dataUri)
    })
    .then((res) => res.json())
    .then((data)=>{
        // 取得したJSONを表示
        displayJson.value = JSON.stringify(data, null, 2)
        graph(data);
    })
    .catch(console.log)
};

const graph = (data)=>{
//グラフ化
//レーダーチャート
const happyRate  = Math.round(data[0].faceAttributes.emotion.happiness * 100);
const sadRate    = Math.round(data[0].faceAttributes.emotion.sadness * 100);
const angryRate  = Math.round(data[0].faceAttributes.emotion.anger * 100);
const exciteRate = Math.round(data[0].faceAttributes.emotion.surprise * 100);
const relaxRate  = Math.round(data[0].faceAttributes.emotion.neutral * 100);
  
const emotions=[
  {name:'happy',score:happyRate},
  {name:'sad',score:sadRate},
  {name:'angry',score:angryRate},
  {name:'excite',score:exciteRate},
  {name:'relax',score:relaxRate}
]
  const maxEmo = emotions.reduce((prev, curr)=>{
  return (prev.score >= curr.score) ? prev : curr
})


  const words = {
  happy:["ハッピー","幸せ","うれしい","楽しい","好き","MUSIC","sing"],
  sad:["悲しい","失恋","涙","冬","ありがとう","卒業","雨"],
  angry:["怒","激","rock"],
  excite:["ハッピー","うれしい","party","wow"],
  relax:["リラックス","relax","love"]  
}

 const searchwords =words[maxEmo.name]

 const random = searchwords[Math.floor(Math.random() * searchwords.length)]
// この下にyoutubeのやつ組み込みます　いずれ分けるけどとりあえず形にしたいので



// この中


var KEY = 'GoogleのAPIキーを入力する';                           // API KEY
var url = 'https://www.googleapis.com/youtube/v3/search?'; // API URL
const recordcom =['UCCy_q-N7F2FOIZ6ZggHIAKg',//sony
　                'UCCy_q-N7F2FOIZ6ZggHIAKg',//sony
                  'UC1oPBUWifc0QOOY8DEKhLuQ',//avex
                  'UC1oPBUWifc0QOOY8DEKhLuQ',//avex
                  'UC1oPBUWifc0QOOY8DEKhLuQ',//avex
                  //'UCxjXU89x6owat9dA8Z-bzdw',//AKB
                  //'UCOfESRUR5duQ2hMnTQ4oqhA',//bump
                  //'UCUCeZaZeJbEYAAzvMgrKOPQ',//米津
                  //'UCUzpZpX2wRYOk3QTFGxDg',//乃木坂
                  //'UCl2aT0nRejTCQO_LHZAftBw'//universalmusic
                ];
const randomrecord =recordcom[Math.floor(Math.random() * recordcom.length)]


url += `type=video`;            // 動画を検索する
url += '&part=snippet';         // 検索結果にすべてのプロパティを含む
url += `&q=${random}`;              // 検索ワード デカのグラフで変える
// url += '&publishedAfter=';
url += `&channelId=${randomrecord}`//ランダムで公式のレコードチャンネルが変わるようにする

url += '&videoCategoryId=10';    //動画のジャンルID 10は音楽
url += '&videoEmbeddable=true'; // Webページに埋め込み可能な動画のみを検索
url += '&videoSyndicated=true'; // youtube.com 以外で再生できる動画のみに限定
url += '&order=viewCount'
url += '&maxResults=6';         // 動画の最大取得件数
url += '&key=' + KEY;           // API KEY

$(function() {
    // youtubeの動画を検索して取得
    $.ajax({
      url: url,
      dataType : 'jsonp'
    }).done(function(data) {
      if (data.items) {
        setData(data);
      } else {
        console.log(data);
        alert('該当するデータが見つかりませんでした');
      }
    }).fail(function(data) {
      alert('通信に失敗しました');
    });
  });
  
  // データ取得が成功したときの処理
  function setData(data) {
    var result = '';
    var video  = '';
    // 動画を表示するHTMLを作る
    for (var i = 0; i < data.items.length; i++) {
      video  = '<iframe src="https://www.youtube.com/embed/';
      video  +=  data.items[i].id.videoId;
      video  += '" allowfullscreen></iframe>';
      result += '<div class="video">' + video + '</div>'
    }
    // HTMLに反映する
    $('#videoList').html(result);

    const instabtn = ''
  }


// この中





//棒グラフ
//円グラフ
var ctx = document.getElementById("myPieChart");
ctx.innerHTML = ""
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
        backgroundColor: [
          "#f8e352",
          "#7a8bc3",
          "#cd5638",
          "#dd9dbf",
          "#c7ddae"
        ],
        data: [Math.round(data[0].faceAttributes.emotion.happiness * 100),
               Math.round(data[0].faceAttributes.emotion.sadness * 100),
               Math.round(data[0].faceAttributes.emotion.anger * 100), 
               Math.round(data[0].faceAttributes.emotion.surprise * 100), 
               Math.round(data[0].faceAttributes.emotion.neutral * 100)]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'YOUR EMOTION'
    }
  }
});
const description= '<div class="icon" width="100%"><div class="happy">HAPPY<i class="fas fa-laugh-squint"></i></div><div class="angry">ANGRY<i class="fas fa-angry"></i></div><div class="sad">SAD<i class="fas fa-sad-tear"></i></div><div class="surprise">SURPRISE<i class="fas fa-surprise"></i></div><div class="natural">NATURAL<i class="fas fa-smile"></i></div></div>'




$('#description').html(description);


}