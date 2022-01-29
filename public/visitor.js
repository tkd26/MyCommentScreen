'use strict';

const topMenu = document.getElementById("topMenu");
const msgForm = document.getElementById("msgForm");
const crapButton = document.getElementById("crapButton");
const heartButton = document.getElementById("heartButton");
const exitForm = document.getElementById("exitForm");
const roomIdText = document.getElementById('roomIdText');
const roomIdArea = document.getElementById('roomIdArea');

function toTopMenu () {
    topMenu.style.display ="block";
    msgForm.style.display ="none";
    exitForm.style.display ="none";
    roomIdArea.style.display ="none";
}

function toRoom () {
    topMenu.style.display ="none";
    msgForm.style.display ="block";
    exitForm.style.display ="block";
    roomIdArea.style.display ="block";
}

// クライアントからサーバーへの接続要求
const socket = io.connect();

// 接続時の処理
socket.on('connect', () => {
    // console.log('connect');

    if (sessionStorage.getItem('roomId')) {
        toRoom();
        roomIdText.innerHTML = sessionStorage.getItem('roomId');
        socket.emit('roomId', sessionStorage.getItem('roomId'));
    } else {
        toTopMenu();
    }
});

// room IDの入力を受け付けるフォームでの処理
$('#topMenu').submit(() => {
    const $inp = $('#inputRoomId');
    const roomId = $inp.val();

    if (roomId) {
        sessionStorage.setItem('roomId', roomId);

        // room IDをサーバへ送ることで，roomへ入室する
        socket.emit('roomId', sessionStorage.getItem('roomId'));

        $inp.val('');

        toRoom();
    
        roomIdText.innerHTML = sessionStorage.getItem('roomId');
    }

    // フォーム送信はしない
    return false;

});

// メッセージを送信するフォームでの処理
$('#msgForm').submit(() => {
    const $inp = $('#input_message');
    const text = $inp.val();

    if (text) {
        // サーバーに、イベント名 'new message' で入力テキストを送信
        // これは参加したroom ID内にのみ送信される
        socket.emit('new message', text);
        // テキストボックスを空に
        $inp.val('');
    }
    // フォーム送信はしない
    return false;
});

// 
crapButton.addEventListener('click', async () => {
    socket.emit('action', '👏');

    // フォーム送信はしない
    return false;
});

heartButton.addEventListener('click', async () => {
    socket.emit('action', '❤️');

    // フォーム送信はしない
    return false;
});

// 退出ボタンを押した時の処理
$('#exitForm').submit(() => {
    sessionStorage.removeItem('roomId');
});