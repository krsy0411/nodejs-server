const { send } = require("./request");
const { read } = require("./response");

function makeReqest(url, data) {
    // 1.데이터 전송
    send(url, data);
    // 2. 데이터 리턴
    read();
}

console.log(makeReqest('https://naver.com', 'any data'));