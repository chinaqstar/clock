'use strict';
const fs = require("fs");
const path = require("path");
let request = require("request");
let CONF = require('./config.json')
const argv = require('yargs').argv;
const timeCheck = require('./timeCheck')

let logPath = path.join(__dirname, "log/log.txt")
let responsePath = path.join(__dirname, 'log/index.html')


let onDutyUrl = 'http://oa.dronggroup.com/general//attendance/personal/duty/submit.php?REGISTER_TYPE=1'; //上班
let offDutyUrl = 'http://oa.dronggroup.com/general//attendance/personal/duty/submit.php?REGISTER_TYPE=2'; //下班

// let onDutyUrl = 'http://oa.dronggroup.com/general/index.php?isIE=0';
// let offDutyUrl = 'http://www.baidu.com';

let indexPath = path.join(__dirname, 'index.js')

let dutyUrl, mode;

if (argv.off) {
  mode = 'off'
  dutyUrl = offDutyUrl;
} else if (argv.on) {
  mode = 'on'
  dutyUrl = onDutyUrl;
} else {
  throw new Error("带参数启动；--on 上班  --off 下班")
}
writeLog('auto:' + mode + '启动成功');

if (!timeCheck.onDutyTimeCheck && mode === 'on' && !argv.f) {
  let str = `现在已经上班啦，你还要打上班的卡么？ 输入node ${indexPath} --on --f或者 npm run onf 强行打卡`
  writeLog(str)
  throw new Error(str)
} else if (!timeCheck.offDutyTimestamp && mode === 'off' && !argv.f) {
  let str = `还没下班呢，打什么卡...  输入node ${indexPath} --off --f 或者 npm run offf强行打卡`
  writeLog(str)
  throw new Error(str)
} else {
  request = request.defaults({ jar: true })
  request(
    {
      method: 'POST',
      uri: 'http://oa.dronggroup.com/logincheck.php',
      formData: { UNAME: CONF.username, PASSWORD: CONF.pwd }
    },
    function (err, res) {
      if (err) {
        writeLog(JSON.stringify(err))
        throw new Error(err)
      }
      writeLog("[headers]" + JSON.stringify(res.headers));
      checkCookies(res.headers['set-cookie']);

      request(
        dutyUrl,
        (err, res) => {
          if (err) {
            writeLog(JSON.stringify(err))
            throw new Error(err)
          }
          writeLog('打卡成功')
          console.log('打卡成功')
        }).pipe(fs.createWriteStream(responsePath))
    })

}

function writeLog(str) {
  let time = new Date().toLocaleString();
  let writeInfo = `[${time}] -- ${str} \n`
  fs.writeFileSync(logPath, writeInfo, {
    encoding: 'utf-8',
    flag: 'a'
  });
}

function checkCookies(cookie) {
  if (cookie.length < 2) {
    let errMsg = `登陆失败，检查log文件 ${logPath}登陆获取到的headers,cookie中是否有userid，检查用户名or密码是否正确`
    writeLog(errMsg)
    throw new Error(errMsg)
  } else {
    writeLog('登陆成功')
  }
}