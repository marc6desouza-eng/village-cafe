import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class FileCollection {
  constructor(collectionName) {
    this.name = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      let data = fs.readFileSync(this.filePath, 'utf-8');
      if (data) {
        data = data.replace(/^\uFEFF/, '').trim();
      }
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error(`Error reading ${this.name}:`, err.message);
      return [];
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing ${this.name}:`, err.message);
    }
  }

  async find(filter = {}) {
    let items = this._read();
    if (Object.keys(filter).length > 0) {
      items = items.filter(item => {
        return Object.entries(filter).every(([key, value]) => {
          if (value && typeof value === 'object' && value.$in) {
            return value.$in.includes(item[key]);
          }
          if (value && typeof value === 'object' && value.$regex) {
            const regex = new RegExp(value.$regex, value.$options || 'i');
            return regex.test(item[key]);
          }
          return item[key] === value;
        });
      });
    }
    return {
      sort: (sortCriteria) => {
        const sorted = [...items].sort((a, b) => {
          for (const [key, direction] of Object.entries(sortCriteria)) {
            const aVal = a[key];
            const bVal = b[key];
            if (aVal === bVal) continue;
            if (direction === -1) {
              return aVal > bVal ? -1 : 1;
            } else {
              return aVal > bVal ? 1 : -1;
            }
          }
          return 0;
        });
        return sorted;
      },
      then: (resolve, reject) => Promise.resolve(items).then(resolve, reject),
    };
  }

  async findOne(filter = {}) {
    const items = this._read();
    const found = items.find(item => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === '_id' || key === 'id') {
          return item._id === value || item.id === value;
        }
        return item[key] === value;
      });
    });
    return found || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(doc) {
    const items = this._read();
    const _id = crypto.randomBytes(12).toString('hex');
    const now = new Date().toISOString();
    const newDoc = {
      _id,
      ...doc,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newDoc);
    this._write(items);
    return newDoc;
  }

  async insertMany(docs) {
    const items = this._read();
    const created = docs.map(doc => {
      const _id = doc._id || crypto.randomBytes(12).toString('hex');
      const now = new Date().toISOString();
      return {
        _id,
        ...doc,
        createdAt: doc.createdAt || now,
        updatedAt: doc.updatedAt || now,
      };
    });
    this._write([...items, ...created]);
    return created;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const now = new Date().toISOString();
    items[index] = {
      ...items[index],
      ...update,
      updatedAt: now,
    };
    this._write(items);
    return items[index];
  }

  async findOneAndUpdate(filter, update, options = { new: true, upsert: false }) {
    const items = this._read();
    const index = items.findIndex(item => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });

    if (index === -1) {
      if (options.upsert) {
        return this.create({ ...filter, ...update });
      }
      return null;
    }

    const now = new Date().toISOString();
    items[index] = {
      ...items[index],
      ...update,
      updatedAt: now,
    };
    this._write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this._write(items);
    return deleted;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      this._write([]);
      return { deletedCount: 0 };
    }
    const items = this._read();
    const remaining = items.filter(item => {
      return !Object.entries(filter).every(([key, value]) => item[key] === value);
    });
    const deletedCount = items.length - remaining.length;
    this._write(remaining);
    return { deletedCount };
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }
}
