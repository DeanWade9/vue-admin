// 过滤特殊字符
export function stripscript(s) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】 ‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

// 验证邮箱
export function validatemail(v) {
  var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
  return reg.test(v) ? false : true
}

// 验证密码
export function validatepassword(v) {
  var reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  return reg.test(v) ? false : true
}

// 验证验证码
export function validatecode(v) {
  var reg = /^[a-z0-9]{6}$/
  return reg.test(v) ? false : true
}