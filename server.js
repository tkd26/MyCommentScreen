'use strict';

// モジュール
const http     = require('http');
const express  = require('express');
const socketIO = require('socket.io');
// const moment   = require('moment');
var fs = require('fs');

// オブジェクト
const app    = express();
const server = http.Server(app);
const io     = socketIO(server);

// 定数
const PORT = process.env.PORT || 3000;

// 接続時の処理
// 'connection'はフロント側と接続されている確認するときに使う
// socketには送信されたメッセージが格納されている
io.on('connection', (socket) => {
    console.log('connection');

    // 切断時の処理
    socket.on('disconnect', () => {
        console.log('disconnect');
    });

    // room IDを受け取った時の処理
    socket.on('roomId', (roomid) => {
        // 特定のroomに入室させる
        socket.join(roomid);

        // 新しいメッセージ受信時の処理
        socket.on('new message', (strMessage) => {
            // console.log('new message:', roomid, strMessage);
            // 受け取ったroom IDのroomにのみメッセージを送信する
            io.to(roomid).emit('message', strMessage);
        });

        // 拍手ボタン受信時の処理
        socket.on('action', (strMessage) => {
            // 受け取ったroom IDのroomにのみメッセージを送信する
            io.to(roomid).emit('action', strMessage);
        });
    });

});

// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// サーバーの起動
server.listen(PORT, () => {
    console.log('server starts on port: %d', PORT);
});