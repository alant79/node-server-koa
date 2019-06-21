module.exports.get = async ctx => {
  try {
    const msgslogin =
      ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;
    ctx.render('login', {
      msgslogin
    });
  } catch (err) {
    const status = 500;
    ctx.status = status;
    ctx.render('error', { status, message: err });
  }
};

module.exports.post = async ctx => {
  try {
    const { password, email } = ctx.request.body;
    let err, status;
    if (!email || !password) {
      err = 'Email & pass are required';
      ctx.flash.set({ msgslogin: err });
      status = 400;
      ctx.status = status;
      ctx.redirect('/login');
      return;
    }
    if (email !== 'admin@admin.com' || password !== 'admin') {
      err = 'Unathorized';
      ctx.flash.set({ msgslogin: err });
      status = 400;
      ctx.status = status;
      ctx.redirect('/login');
      return;
    }
    ctx.session.isAuth = true;
    ctx.redirect('/admin');
  } catch (err) {
    const status = 500;
    ctx.status = status;
    ctx.render('error', { status, message: err });
  }
};
