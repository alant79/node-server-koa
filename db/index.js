const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
const fs = require('fs');
const path = require('path');
const objectPath = require('object-path');
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
        if (!fs.existsSync(this._fullnameFile())) {
          fs.writeFileSync(this._fullnameFile(), JSON.stringify(data, '', 4));
        } else {
          let dataFile = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
          for (let key in data) {
            let dataTable = objectPath.get(dataFile, key);
            if (!dataTable) {
              dataFile[key] = objectPath.get(data, key);
            }
          }
        }
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
          data = objectPath.get(JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8')), type);
        }
        if (!data) {
          throw new Error('В БД не обнаружена таблица ', type);
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
          data = objectPath.get(JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8')), type);
        }
        if (!data) {
          throw new Error('В БД не обнаружена таблица ', type);
        }
        const item = data.find(elem => objectPath.get(elem, field, '') === value);
        resolve(item);
      } catch (err) {
        reject(err);
      }
    });
  }
  add (type, data) {
    return new Promise((resolve, reject) => {
      try {
        let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
        let newData = objectPath.get(currentData, type);
        if (!newData) {
          throw new Error('В БД не обнаружена таблица ', type);
        }
        const id = newData.length + 1;
        data.id = id;
        newData.push(data);
        currentData[type] = newData;
        fs.writeFileSync(this._fullnameFile(), JSON.stringify(currentData, '', 4));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
  update (type, field, value, data) {
    return new Promise((resolve, reject) => {
      try {
        let currentData = JSON.parse(fs.readFileSync(this._fullnameFile(), 'utf-8'));
        const newData = objectPath.get(currentData, type);
        if (!newData) {
          throw new Error('В БД не обнаружена таблица ', type);
        }
        let result = newData.map(elem => {
          if (objectPath.get(elem, field) === value) {
            return data;
          } else {
            return elem;
          }
        });
        currentData[type] = result;
        fs.writeFileSync(
          this._fullnameFile(),
          JSON.stringify(currentData, '', 4)
        );
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
  response.data.forEach(async item => {
    await db.update('skills', 'id', item.id, item);
  });
  response.reply(true);
});
