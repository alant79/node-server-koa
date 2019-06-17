exports.add = ({ name, email, message }) => new Promise(async (resolve, reject) => {
  try {
    if (!name || !email) {
      reject(new Error('All fields are required'));
      return;
    }
    console.log(name, email, message);
    resolve(true);
  } catch (err) {
    reject(err);
  }
});
