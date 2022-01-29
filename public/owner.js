// 'use strict';

// URLを取得
var url = new URL(window.location.href);
// URLSearchParamsオブジェクトを取得
var params = url.searchParams;

const roomIdText = document.getElementById('roomIdText');
const roomIdArea = document.getElementById('roomIdArea');

// クライアントからサーバーへの接続要求
const socket = io.connect();

// 接続時の処理
socket.on('connect', () => {

    const roomId = params.get('id'); // getメソッド
    sessionStorage.setItem('roomId', roomId);

    socket.emit('roomId', sessionStorage.getItem('roomId'));

    roomIdText.innerHTML = sessionStorage.getItem('roomId');
});

// メッセージを表示させる処理
let count = 0;

socket.on('message', async function createText(msg) {
        let div_text = document.createElement('div');
        div_text.id = "text" + count; //アニメーション処理で対象の指定に必要なidを設定
        count++;
        div_text.style.fontSize = '50px';
        div_text.style.fontWeight = 'bold';
        div_text.style.position = 'fixed'; //テキストのは位置を絶対位置にするための設定
        div_text.style.whiteSpace = 'nowrap' //画面右端での折り返しがなく、画面外へはみ出すようにする
        div_text.style.left = (document.documentElement.clientWidth) + 'px'; //初期状態の横方向の位置は画面の右端に設定
        let random = Math.round( Math.random() * (document.documentElement.clientHeight - 50) );
        div_text.style.top = random + 'px';  //初期状態の縦方向の位置は画面の上端から下端の間に設定（ランダムな配置に）
        div_text.appendChild(document.createTextNode(msg)); //画面上に表示されるテキストを設定
        msgSpace.appendChild(div_text);
        // document.body.appendChild(div_text); //body直下へ挿入
    
        //ライブラリを用いたテキスト移動のアニメーション： durationはアニメーションの時間、
        //        横方向の移動距離は「画面の横幅＋画面を流れるテキストの要素の横幅」、移動中に次の削除処理がされないようawait
        await gsap.to("#"+div_text.id, {
            duration: 10, 
            x: -1*(document.documentElement.clientWidth + div_text.clientWidth * 3)
        });
    
        div_text.parentNode.removeChild(div_text); //画面上の移動終了後に削除
});

// 拍手ボタン
socket.on('action', async function crap(msg){

    // const music = new Audio('musics/crap.mp3');
    // music.play();

    let div_text = document.createElement('div');
    div_text.id = "action" + count; //アニメーション処理で対象の指定に必要なidを設定
    count++;
    div_text.style.fontSize = '50px';
    div_text.style.fontWeight = 'bold';
    div_text.style.position = 'fixed'; //テキストのは位置を絶対位置にするための設定
    div_text.style.whiteSpace = 'nowrap' //画面右端での折り返しがなく、画面外へはみ出すようにする
    div_text.style.bottom = (document.documentElement.clientHeight) + 'px'; //初期状態の横方向の位置は画面の右端に設定
    let random = Math.round( Math.random() * (document.documentElement.clientWidth - 50) );
    div_text.style.left = random + 'px';  //初期状態の縦方向の位置は画面の上端から下端の間に設定（ランダムな配置に）
    div_text.appendChild(document.createTextNode(msg)); //画面上に表示されるテキストを設定
    actionSpace.appendChild(div_text);
    // document.body.appendChild(div_text); //body直下へ挿入

    //ライブラリを用いたテキスト移動のアニメーション： durationはアニメーションの時間、
    //        横方向の移動距離は「画面の横幅＋画面を流れるテキストの要素の横幅」、移動中に次の削除処理がされないようawait
    await gsap.fromTo(
        "#"+div_text.id, 
        {
            y: document.documentElement.clientHeight,
            opacity: 1,
        },
        {
            y: document.documentElement.clientHeight - 150,
            opacity: 0,
            duration: 3, 
        }
    );

    div_text.parentNode.removeChild(div_text); //画面上の移動終了後に削除
});