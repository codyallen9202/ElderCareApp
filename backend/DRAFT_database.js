import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    { name: 'ElderCare.db', location: 'default' },
    () => console.log('Database opened'),
    err => console.error('Database error', err)
);

export const setupDatabse = () => {

    // User Table
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);'
        );

        // Medications Table
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS medications ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);'
        );

        // Caregivers Table
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS caregivers ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);'
        );
    });
};

export default db;