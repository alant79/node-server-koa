module.exports.get = async ctx => {
  try {
    const msgslogin =
      ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;
    ctx.render('login', {
      msgslogin
    });
  } catch (err) {
    ctx.render('error', { status: ctx.status, message: err });
  }
};

module.exports.post = async ctx => {
  try {
    const { password, email } = ctx.request.body;
    let err;
    if (!email || !password) {
      err = 'Email & pass are required';
      ctx.flash.set({ msgslogin: err });
      ctx.redirect('/login');
      return;
    }
    if (email !== 'admin@admin.com' || password !== 'admin') {
      err = 'Unathorized';
      ctx.flash.set({ msgslogin: err });
      ctx.redirect('/login');
      return;
    }
    ctx.session.isAuth = true;
    ctx.redirect('/admin');
  } catch (err) {
    ctx.render('error', { status: ctx.status, message: err });
  }
};
