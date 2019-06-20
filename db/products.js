const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../temp/products.json');

exports.get = () => new Promise(async (resolve, reject) => {
  try {
    let products = [];
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }
    resolve(products);
  } catch (err) {
    reject(new Error(err));
  }
});

exports.add = ({ photoName, name, price }) => new Promise(async (resolve, reject) => {
  try {
    let products = [];
    if (fs.existsSync(productsPath)) {
      products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }

    let newProducts = products.slice();
    newProducts.push({
      'src': './assets/img/products/' + photoName,
      'name': name,
      'price': price
    });

    fs.writeFileSync(path.join(process.cwd(), '/temp/products.json'), JSON.stringify(newProducts));

    resolve(true);
  } catch (err) {
    reject(err);
  }
});
