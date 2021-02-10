import service from '@/utils/request'
/**
 * 获取验证码
 */
export function GetSMS(data) {
  return service.request({
    method: 'post',
    url: '/getSms/',
    data
  })
}
/**
* 获取用户角色
*/

/**
 * 登录
 */

/**
 * 注册
 */