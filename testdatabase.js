import * as SQLite from 'expo-sqlite';

console.log('SQLite:', SQLite);
const db = SQLite.openDatabase('test.db');
console.log('DB:', db);
