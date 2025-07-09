export class Routes {
  static home = {
    listCategory: '/categories/user',
    listLearning: '/courses/category/',
    learningDetail: '/courses',
    quizLearning: '/quiz/course/',
    submitQuizLearning: '/courses/submit',
  }
  static settings = {
    getUser: '/users/me',
    changeName: '/users',
    changePassword: '/users/change-password',
    updateAvatar: '/users/avatar',
    rankUser: 'users/rank-user',
  }
  static practice = {
    quiz: '/quiz',
    quizDetail: '/quiz/',
    submitQuizPractice: '/quiz/submit',
  }
  static rank = {
    rank: '/users/rank',
  }
  static chess = {
    getWinLose: '/practice/win-lose-count',
  }
}
