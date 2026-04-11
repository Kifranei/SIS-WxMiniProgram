const API_BASE = 'https://localhost:44332/api/miniprogram';
const { requireLogin, handleAuthFailure } = require('../../utils/auth');

function buildStudentStatus(gradeInput) {
  const value = (gradeInput || '').trim();
  if (!value) {
    return {
      text: '未录入',
      className: ''
    };
  }

  const grade = Number(value);
  return {
    text: `当前 ${value}`,
    className: !Number.isNaN(grade) && grade >= 60 ? 'success' : 'danger'
  };
}

function normalizeStudents(students) {
  return (students || []).map((item) => {
    const gradeInput = item.Grade === null || item.Grade === undefined ? '' : String(item.Grade);
    const status = buildStudentStatus(gradeInput);
    return {
      ...item,
      GradeInput: gradeInput,
      StatusText: status.text,
      StatusClass: status.className
    };
  });
}

function getGradedCount(students) {
  return (students || []).filter((item) => (item.GradeInput || '').trim() !== '').length;
}

Page({
  data: {
    courseId: 0,
    courseName: '',
    courseTypeText: '',
    teacherName: '',
    credits: 0,
    studentCount: 0,
    gradedCount: 0,
    students: [],
    loading: true,
    saving: false,
    loadError: '',
    hasLoaded: false
  },

  onLoad(options) {
    const courseId = Number(options.courseId || 0);
    if (!courseId) {
      this.setData({
        loading: false,
        loadError: '缺少课程参数'
      });
      return;
    }

    this.setData({ courseId });
    this.loadGradeEntry();
  },

  onShow() {
    if (this.data.hasLoaded && this.data.courseId) {
      this.loadGradeEntry(true);
    }
  },

  onPullDownRefresh() {
    this.loadGradeEntry(false, () => wx.stopPullDownRefresh());
  },

  loadGradeEntry(silent, done) {
    const userInfo = requireLogin();
    if (!userInfo) {
      if (done) done();
      return;
    }

    if (userInfo.Role !== 1) {
      this.setData({
        loading: false,
        loadError: '仅教师可访问该页面'
      });
      if (done) done();
      return;
    }

    if (!silent) {
      this.setData({
        loading: true,
        loadError: ''
      });
    }

    wx.request({
      url: `${API_BASE}/teacher-grade-entry?userId=${userInfo.UserID}&courseId=${this.data.courseId}`,
      success: (res) => {
        if (res.statusCode === 200) {
          const students = normalizeStudents(res.data.Students);

          this.setData({
            courseName: res.data.CourseName || '',
            courseTypeText: res.data.CourseTypeText || '',
            teacherName: res.data.TeacherName || '',
            credits: res.data.Credits || 0,
            studentCount: res.data.StudentCount || students.length,
            gradedCount: getGradedCount(students),
            students,
            loading: false,
            loadError: '',
            hasLoaded: true
          });
          return;
        }

        const message = (res.data && (res.data.message || res.data.Message)) || `成绩页加载失败 (${res.statusCode})`;
        this.setData({
          loading: false,
          loadError: message
        });
        if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 400 || res.statusCode === 404) {
          handleAuthFailure('登录状态已失效，请重新登录');
        }
      },
      fail: () => {
        this.setData({
          loading: false,
          loadError: '无法连接成绩录入接口'
        });
      },
      complete: () => {
        if (done) done();
      }
    });
  },

  onGradeInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const students = this.data.students.slice();
    const status = buildStudentStatus(value);
    students[index] = {
      ...students[index],
      GradeInput: value,
      StatusText: status.text,
      StatusClass: status.className
    };

    this.setData({
      students,
      gradedCount: getGradedCount(students)
    });
  },

  clearGrade(e) {
    const index = e.currentTarget.dataset.index;
    const students = this.data.students.slice();
    const status = buildStudentStatus('');
    students[index] = {
      ...students[index],
      GradeInput: '',
      StatusText: status.text,
      StatusClass: status.className
    };

    this.setData({
      students,
      gradedCount: getGradedCount(students)
    });
  },

  saveGrades() {
    if (this.data.saving) {
      return;
    }

    const validationMessage = this.validateGrades();
    if (validationMessage) {
      wx.showToast({
        title: validationMessage,
        icon: 'none',
        duration: 2600
      });
      return;
    }

    const userInfo = requireLogin();
    if (!userInfo) {
      return;
    }

    const grades = this.data.students.map((item) => {
      const value = (item.GradeInput || '').trim();
      return {
        studentId: item.StudentID,
        grade: value === '' ? null : Number(value)
      };
    });

    this.setData({ saving: true });
    wx.request({
      url: `${API_BASE}/teacher-grade-entry/save`,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        userId: userInfo.UserID,
        courseId: this.data.courseId,
        grades
      },
      success: (res) => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: (res.data && res.data.message) || '保存成功',
            icon: 'success'
          });
          this.loadGradeEntry(true);
          return;
        }

        wx.showToast({
          title: (res.data && (res.data.message || res.data.Message)) || '保存失败',
          icon: 'none',
          duration: 2600
        });
      },
      fail: () => {
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({ saving: false });
      }
    });
  },

  validateGrades() {
    for (let i = 0; i < this.data.students.length; i += 1) {
      const item = this.data.students[i];
      const value = (item.GradeInput || '').trim();
      if (!value) {
        continue;
      }

      const grade = Number(value);
      if (Number.isNaN(grade)) {
        return `${item.StudentName || item.StudentID} 的成绩不是有效数字`;
      }

      if (grade < 0 || grade > 100) {
        return `${item.StudentName || item.StudentID} 的成绩必须在 0-100 之间`;
      }
    }

    return '';
  }
});
