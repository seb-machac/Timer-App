import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import {
    addRxPlugin,
    createRxDatabase,
    createBlob,
    getBlobSize,
    blobToBase64String
} from 'rxdb';
import fetch from 'cross-fetch';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb'
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';


addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBAttachmentsPlugin);

let dbPromise = null;

export async function get() {
    if (!dbPromise) {
        dbPromise = createRxDatabase({
            name: 'database',
            storage: wrappedValidateAjvStorage({
                storage: getRxStorageLocalstorage()
            })
        }).then(async (myDatabase) => {
            await myDatabase.addCollections({
                times: {
                    schema: {
                        version: 0,
                        primaryKey: 'id',
                        type: 'object',
                        properties: {
                            id: { type: 'string', maxLength: 100 },
                            name: { type: 'string' }
                        },
                        required: ['id', 'name']
                    }
                }
            });
            return myDatabase;
        });
    }
    return dbPromise;
}