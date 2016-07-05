# 自动打卡

## usage
    git clone this.
    //克隆项目

    cd dirname...
    //cd 到当前文件夹

    npm install 
    //安装依赖

    npm run setting
    //创建windows下的bat脚本，并自动添加进系统服务，开机自启动运行脚本
    //mac暂时无自动运行

    //设置成功后，检查文件夹config.json

    {
    "username":"your oa username",  //输入username
    "pwd":"your oa pwd", //输入密码
    "time":"0 或者 1 ---- 0是9:00上班，1是9：30上班" //0或者1
    }

    e.g.例
    {
    "username":"wangjue", 
    "pwd":"123123", 
    "time":"1" 
    }

    //手动上下班打卡

    npm run on
    //上班
    npm run off
    //下班

    //在./log/log.txt可以查看程序运行时的日志

