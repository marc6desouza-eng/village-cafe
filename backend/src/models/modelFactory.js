import mongoose from 'mongoose';
import { FileCollection } from '../utils/fileStore.js';

export function createDualModel(modelName, schemaDefinition, schemaOptions = { timestamps: true }) {
  const schema = new mongoose.Schema(schemaDefinition, schemaOptions);
  let MongooseModel;
  try {
    MongooseModel = mongoose.model(modelName);
  } catch (e) {
    MongooseModel = mongoose.model(modelName, schema);
  }

  const fileStore = new FileCollection(modelName.toLowerCase());

  // Helper to extract default values from schemaDefinition
  const applyDefaults = (doc) => {
    const result = { ...doc };
    for (const [key, def] of Object.entries(schemaDefinition)) {
      if (result[key] === undefined && def && def.default !== undefined) {
        result[key] = typeof def.default === 'function' ? def.default() : JSON.parse(JSON.stringify(def.default));
      }
    }
    return result;
  };

  return {
    mongooseModel: MongooseModel,
    fileStore,

    isMongoReady() {
      return mongoose.connection.readyState === 1;
    },

    async find(filter = {}) {
      if (this.isMongoReady()) {
        return MongooseModel.find(filter);
      }
      const res = await fileStore.find(filter);
      if (Array.isArray(res)) {
        return res.map(applyDefaults);
      }
      // If it returned the wrapper with sort and then
      return {
        sort: (sortCriteria) => res.sort(sortCriteria).map(applyDefaults),
        then: (resolve, reject) => res.then(items => items.map(applyDefaults)).then(resolve, reject),
      };
    },

    async findOne(filter = {}) {
      if (this.isMongoReady()) {
        return MongooseModel.findOne(filter);
      }
      const found = await fileStore.findOne(filter);
      return found ? applyDefaults(found) : null;
    },

    async findById(id) {
      if (this.isMongoReady()) {
        return MongooseModel.findById(id);
      }
      const found = await fileStore.findById(id);
      return found ? applyDefaults(found) : null;
    },

    async create(doc) {
      if (this.isMongoReady()) {
        return MongooseModel.create(doc);
      }
      const withDefaults = applyDefaults(doc);
      return fileStore.create(withDefaults);
    },

    async insertMany(docs) {
      if (this.isMongoReady()) {
        return MongooseModel.insertMany(docs);
      }
      const withDefaults = docs.map(applyDefaults);
      return fileStore.insertMany(withDefaults);
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      if (this.isMongoReady()) {
        return MongooseModel.findByIdAndUpdate(id, update, options);
      }
      const updated = await fileStore.findByIdAndUpdate(id, update, options);
      return updated ? applyDefaults(updated) : null;
    },

    async findOneAndUpdate(filter, update, options = { new: true, upsert: false }) {
      if (this.isMongoReady()) {
        return MongooseModel.findOneAndUpdate(filter, update, options);
      }
      const updated = await fileStore.findOneAndUpdate(filter, update, options);
      return updated ? applyDefaults(updated) : null;
    },

    async findByIdAndDelete(id) {
      if (this.isMongoReady()) {
        return MongooseModel.findByIdAndDelete(id);
      }
      return fileStore.findByIdAndDelete(id);
    },

    async deleteMany(filter = {}) {
      if (this.isMongoReady()) {
        return MongooseModel.deleteMany(filter);
      }
      return fileStore.deleteMany(filter);
    },

    async countDocuments(filter = {}) {
      if (this.isMongoReady()) {
        return MongooseModel.countDocuments(filter);
      }
      return fileStore.countDocuments(filter);
    }
  };
}
