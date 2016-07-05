'use strict';


//配置node.js服务为windows服务，开机自启动

const shortcut = require('windows-shortcuts');
const fs = require("fs");
const path = require('path')

let indexPath = path.join(__dirname, '../index.js')
let onDutyBatPath = path.join(__dirname, './onDuty.bat')
let offDutyBatPath = path.join(__dirname, './offDuty.bat')
let runBatPath = path.join(__dirname, './run.bat')
let logPath = path.join(__dirname,'../log', 'log.txt')
let configPath = path.join(__dirname,'../config.json')

// 生成bat
let batOnScript = `node ${indexPath} --on`;
let batOffScript = `node ${indexPath} --off`;

let runScript = `start ${onDutyBatPath}`;

fs.writeFile(onDutyBatPath, batOnScript, 'utf-8', (err) => {
    if (err) {
        fs.writeFile(logPath, err, 'utf-8');
    }
    fs.writeFileSync(runBatPath, runScript, 'utf-8');
    fs.writeFileSync(offDutyBatPath, batOffScript, 'utf-8');
    fs.writeFileSync(configPath,`{
"username":"your oa username",
"pwd":"your oa pwd",
"time":"0 或者 1 ---- 0是9:00上班，1是9：30上班"
}`)
    console.log('saved')
    //windows下的开机启动
    if (process.platform.match(/^win/)) {
        //开机启动目录
        var startupMenu = "";
        //APPDATA目录中有Roming的是win7,win8等同类系统开机目录
        if (/Roaming/.test(process.env.APPDATA)) {
            startupMenu = process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\";
        } else {
            //winXp等同类系统开机目录
            startupMenu = process.env.USERPROFILE + "\\「开始」菜单\\程序\\启动\\";
        }

        //在目录下生成的快捷方式名称
        var startupTarget = startupMenu + "autoClock.lnk"; /*注意更改*/
        //要复制快捷方式过去的源程序
        var sourcePrograme = __dirname + "\\run.bat"; /*注意更改*/
        //存在就删除,不存在就创建
        if (fs.existsSync(startupTarget)) {
            fs.unlink(startupTarget, function (err) {
                if (err) {
                    console.error("取消开机启动出错", err);
                    writeLog(err)
                }
                else {
                    console.log("取消开机启动成功");
                    writeLog("取消开机启动成功")
                }
            })
        } else {
            shortcut.create(startupTarget, sourcePrograme, function (err) {
                if (err) {
                    console.error("设置开机启动出错", err);
                    writeLog("设置开机启动出错")
                }
                else {
                    console.log("设置开机启动成功");
                    writeLog("设置开机启动成功")
                }
            })
        }
    }
})

function writeLog(str) {
    let time = new Date().toLocaleString();
    let writeInfo = `[${time}] -- ${str} \n`
    fs.writeFileSync(logPath, writeInfo,{
        encoding:'utf-8',
        flag:'a'
    } );
}


