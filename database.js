// database.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('stopwatch.db'); // ✅ Expo-compatible

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL
      );`
    );
  });
};

export const insertTime = (time) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO times (time) VALUES (?);',
      [time]
    );
  });
};



export const getTimes = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM times ORDER BY id DESC;',
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => {
        console.error("Query error:", error);
        return false;
      }
    );
  });
};

export const clearTimes = () => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM times;');
  });
};
