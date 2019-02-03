const neo4j = require('neo4j-driver').v1;
const config = require('./config');

// TODO: function to create relation on demand

let db = {
    driver: null,
    getSession: () => {
        if (!db.driver) {
            throw new Error('Cannot create a session, Neo4j driver connection not established');
        }
        return db.driver.session();
    },
    parse: (record, name, excludedProperties) => {
        let node = record.get(name).properties;

        if (excludedProperties) {
            for (let k of Object.keys(node)) {
                if (excludedProperties.indexOf(k) != -1) {
                    delete node[k];
                }
            }

            return node;
        } else {
            return node;
        }
    },
    // TODO: validate input to avoid injection
    jsonToWhereQuery: (obj, prefix, relations) => {
        return db.jsonToQuery(obj, prefix, 'AND', relations, '=');
    },
    jsonToSetQuery: (obj, prefix) => {
        return db.jsonToQuery(obj, prefix, ',', null, '=');
    },
    jsonToCreateQuery: (obj) => {
        return `{${db.jsonToQuery(obj, '', ',', null, ':')}}`;
    },
    jsonToRelationQuery: (query) => {
        return `(user)-[:WROTE]->(message)`;
    },
    jsonToQuery(obj, prefix, separator, relations, affectionSign) {
        let query = '';
        if (!obj) {
            return query;
        }

        const keys = Object.keys(obj);
        for (let k of keys) {
            if (query != '') {
                query += ` ${separator} `;
            }

            const isString = typeof obj[k] == 'string';
            query += relations && relations[k] ? relations[k].replace('@VALUE', `"${!isString ? obj[k]._id : obj[k]}"`) : (`${prefix}${prefix ? '.' : ''}${k} ${affectionSign} ${isString ? `"${obj[k]}"` : obj[k]}`);
        }

        return query;
    },
    connect: (url, username, password) => {
        db.driver = neo4j.driver(url, neo4j.auth.basic(username, password));
    }
};

module.exports = db;