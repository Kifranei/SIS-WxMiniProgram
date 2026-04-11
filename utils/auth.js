function getStoredUser() {
  return wx.getStorageSync('userInfo') || null;
}

function redirectToLogin() {
  wx.removeStorageSync('userInfo');
  wx.reLaunch({ url: '/pages/index/index' });
}

function requireLogin() {
  const userInfo = getStoredUser();
  if (!userInfo) {
    redirectToLogin();
    return null;
  }

  return userInfo;
}

function handleAuthFailure(message) {
  wx.showToast({
    title: message || '登录状态已失效，请重新登录',
    icon: 'none',
    duration: 2200
  });

  setTimeout(() => {
    redirectToLogin();
  }, 250);
}

module.exports = {
  getStoredUser,
  redirectToLogin,
  requireLogin,
  handleAuthFailure
};
