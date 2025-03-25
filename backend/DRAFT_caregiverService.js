import db from './DRAFT_database';

export const addUser = (name) => {
    db.transaction(tx => {
        tx.executeSql('INSERT INTO caregivers (name, phone) VALUES (?, ?);', [name, phone]);
    });
};

export const getUser = (callback) => {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM caregivers;', [], (tx, results) => {
            const caregivers = [];
            for (let i = 0; i < results.rows.length; i++) {
                caregivers.push(results.rows.item(i));
            }
            callback(caregivers);
        });
    });
};