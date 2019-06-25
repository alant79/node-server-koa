const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
const fs = require('fs');
const path = require('path');
global.DATABASE = DATABASE;

class DB {
  constructor (file) {
    this.file = file;
  }
  _fullnameFile () {
    return path.join(process.cwd(), this.file);
  }
  init (data) {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(this._fullnameFile(), JSON.stringify(data, '', 4));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
  get (type) {
    return new Promise((resolve, reject) => {
      try {
        let data = [];
        if (fs.existsSync(this._fullnameFile())) {
          data = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'))[type];
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
  find (type, field, value) {
    return new Promise((resolve, reject) => {
      try {
        let data = [];
        if (fs.existsSync(this._fullnameFile())) {
          data = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'))[type];
        }
        const item = data.find(elem => elem[field] === value)[field];
        resolve(item);
      } catch (err) {
        reject(err);
      }
    });
  }
  add (type, data) {
    return new Promise((resolve, reject) => {
      try {
        if (type === 'products') {
          // отработаем только добавление products, для данной задачи skills не нужно
          let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
          const { photoName, name, price } = data;
          let newProducts = currentData[type];
          newProducts.push({
            'src': './assets/img/products/' + photoName,
            'name': name,
            'price': price,
            'id': newProducts.length + 1
          });
          currentData[type] = newProducts;
          fs.writeFileSync(this._fullnameFile(), JSON.stringify(currentData, '', 4));
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
  // delete (type, data) {} для данной задачи реализовывать не нужно
  // get (type, data) {} для данной задачи реализовывать не нужно
  update (type, data) {
    return new Promise((resolve, reject) => {
      try {
        if (type === 'skills') {
          // отработаем только редактирование skills, для данной задачи products не нужно
          let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
          const { age, concerts, cities, years } = data;
          let newSkills = [];
          newSkills.push(
            {
              number: age,
              text: 'Возраст начала занятий на скрипке',
              id: 1
            },
            {
              number: concerts,
              text: 'Концертов отыграл',
              id: 2
            },
            {
              number: cities,
              text: 'Максимальное число городов в туре',
              id: 3
            },
            {
              number: years,
              text: 'Лет на сцене в качестве скрипача',
              id: 4
            }
          );
          currentData[type] = newSkills;
          fs.writeFileSync(
            this._fullnameFile(),
            JSON.stringify(currentData, '', 4)
          );
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

const db = new DB('/temp/database.json');
db.init({
  products: [],
  skills: [
    { number: '67', text: 'Возраст начала занятий на скрипке', id: 1 },
    { number: '45', text: 'Концертов отыграл', id: 2 },
    { number: '32', text: 'Максимальное число городов в туре', id: 3 },
    { number: '11', text: 'Лет на сцене в качестве скрипача', id: 4 }
  ]
});

DATABASE.on('products/get', async response => {
  response.reply(await db.get('products'));
});

DATABASE.on('skills/get', async response => {
  response.reply(await db.get('skills'));
});

DATABASE.on('products/post', async response => {
  response.reply(await db.add('products', response.data));
});

DATABASE.on('skills/post', async response => {
  response.reply(await db.update('skills', response.data));
});
