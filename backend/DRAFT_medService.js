import db from './DRAFT_database';

export const addUser = (name) => {
    db.transaction(tx => {
        tx.executeSql('INSERT INTO medications (name) VALUES (?);', [name]);
    });
};

export const getUser = (callback) => {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM medications;', [], (tx, results) => {
            if (results.rows.length > 0) {
                callback(results.rows.item(0));
            } else {
                callback(null)
            }
        });
    });
};