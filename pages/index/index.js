const { request, saveUser, getCachedUser } = require('../../utils/api');

Page({
  data: {
    username: '',
    password: '',
    errorMessage: '',
    loading: false
  },

  onLoad() {
    const cached = getCachedUser();
    if (cached) {
      wx.reLaunch({ url: '/pages/main/main' });
    }
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onLoginTap() {
    if (this.data.loading) return;

    const { username, password } = this.data;
    if (!username || !password) {
      this.setData({ errorMessage: '请输入用户名和密码' });
      return;
    }

    this.setData({ loading: true, errorMessage: '' });

    request('/login', {
      method: 'POST',
      data: {
        Username: username,
        Password: password
      }
    })
      .then((user) => {
        saveUser(user);
        wx.showToast({ title: '登录成功', icon: 'success' });
        wx.reLaunch({ url: '/pages/main/main' });
      })
      .catch((err) => {
        const message = err?.message || '用户名或密码错误！';
        this.setData({ errorMessage: message });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  }
});
