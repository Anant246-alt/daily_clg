import fs from "fs";
import path from "path";

const dbDir = path.join(process.cwd(), "backend", "data", "db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const readCollection = (collectionName, defaultData = []) => {
  const filePath = path.join(dbDir, `${collectionName}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    return defaultData;
  }
};

export const writeCollection = (collectionName, data) => {
  const filePath = path.join(dbDir, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const insertDocument = (collectionName, doc) => {
  const list = readCollection(collectionName, []);
  const newItem = { id: doc.id || doc._id || `id_${Date.now()}`, ...doc };
  list.unshift(newItem);
  writeCollection(collectionName, list);
  return newItem;
};

export const updateDocument = (collectionName, queryKey, queryVal, patch) => {
  const list = readCollection(collectionName, []);
  const index = list.findIndex((item) => item[queryKey] === queryVal || item.id === queryVal || item._id === queryVal);
  if (index !== -1) {
    list[index] = { ...list[index], ...patch };
    writeCollection(collectionName, list);
    return list[index];
  }
  return null;
};

export const deleteDocument = (collectionName, queryKey, queryVal) => {
  const list = readCollection(collectionName, []);
  const filtered = list.filter((item) => item[queryKey] !== queryVal && item.id !== queryVal && item._id !== queryVal);
  writeCollection(collectionName, filtered);
  return true;
};
