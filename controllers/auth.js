exports.auth = ({ email, password }) => new Promise(async (resolve, reject) => {
  try {
    if (!email || !password) {
      reject(new Error('Email & pass are required'));
      return;
    }

    if (email !== 'admin@admin.com' || password !== 'admin') {
      reject(new Error('Unathorized'));
      return;
    }

    resolve(true);
  } catch (err) {
    reject(err);
  }
});
