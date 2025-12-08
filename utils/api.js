const API_BASE = 'https://localhost:44332/api/miniprogram';

const roleMap = {
  0: '管理员',
  1: '教师',
  2: '学生'
};

function getRoleName(role) {
  return roleMap.hasOwnProperty(role) ? roleMap[role] : '未知用户';
}

function getCachedUser() {
  const cached = wx.getStorageSync('userInfo');
  return cached || null;
}

function saveUser(userInfo) {
  wx.setStorageSync('userInfo', userInfo);
}

function clearUser() {
  wx.removeStorageSync('userInfo');
}

function request(path, options = {}) {
  const { method = 'GET', data = {} } = options;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      success(res) {
        const { statusCode, data: resData } = res;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(resData);
        } else {
          reject(new Error(resData?.message || '请求失败，请稍后重试'));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  API_BASE,
  getRoleName,
  getCachedUser,
  saveUser,
  clearUser,
  request
};
