'use strict';
const config = require('./config')
let now = new Date().getTime()
let onDutyTimestamp = getOnDutyTimestamp(config.time);
let offDutyTimestamp = getOffDutyTimestamp(config.time);

function getOnDutyTimestamp(mode) {
    let minu = mode ? 30 : 0;
    let date = new Date()
    date.setHours(9)
    date.setMinutes(minu)
    output(date)
    return date.getTime()
}

function getOffDutyTimestamp(mode) {
    let minu = mode ? 30 : 0;
    let date = new Date()
    date.setHours(18)
    date.setMinutes(minu)
    return date.getTime()
}

function output(date) {
    console.log('您的上班时间是'+date.toLocaleString())
}

exports.onDutyTimeCheck = now < onDutyTimestamp;
exports.offDutyTimestamp = now > offDutyTimestamp;