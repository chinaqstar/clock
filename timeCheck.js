'use strict';
let now = new Date().getTime()
let onDutyTimestamp = getOnDutyTimestamp();
let offDutyTimestamp = getOffDutyTimestamp();

function getOnDutyTimestamp(mode) {
    let minu = mode ? 30 : 0;
    let date = new Date()
    date.setHours(9)
    date.setMinutes(minu)
    return date.getTime()
}

function getOffDutyTimestamp(mode) {
    let minu = mode ? 30 : 0;
    let date = new Date()
    date.setHours(18)
    date.setMinutes(minu)
    return date.getTime()
}

exports.onDutyTimeCheck = now < onDutyTimestamp;
exports.offDutyTimestamp = now > offDutyTimestamp;