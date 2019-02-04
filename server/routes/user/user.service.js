// const User = require('../../database/models/User');
const db = require('../../database/db');
const User = require('../../database/models/User');
const config = require('../../helpers/config');

const jwt = require('jsonwebtoken');

const service = {
    getAll: () => {
        return new Promise(resolve => {
            const session = db.getSession();
            let users = [];
            return session.run('MATCH (user:User) RETURN user')
                .subscribe({
                    onNext: (record) => {
                        users.push(db.parse(record, 'user', ['password', 'isDeleted']));
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(users);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    get: (query) => {
        return new Promise(resolve => {
            const session = db.getSession();
            const stringQuery = db.jsonToWhereQuery(query, 'user');
            let users = [];

            return session.run(`MATCH (user:User)${stringQuery == '' ? '' : ' WHERE '}${stringQuery} RETURN user`)
                .subscribe({
                    onNext: (record) => {
                        users.push(db.parse(record, 'user', ['password', 'isDeleted']));
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(users);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    getOne: async (query, keepAllProperties) => {
        return new Promise(resolve => {
            const session = db.getSession();
            const stringQuery = db.jsonToWhereQuery(query, 'user');
            let user;
            return session.run(`MATCH (user:User)${stringQuery == '' ? '' : ' WHERE '}${stringQuery} RETURN user`)
                .subscribe({
                    onNext: (record) => {
                        session.close();
                        if (!keepAllProperties) {
                            user = db.parse(record, 'user', ['password', 'isDeleted']);
                        } else {
                            user = db.parse(record, 'user', []);
                        }
                    },
                    onCompleted: () => {
                        resolve(user ? user : null);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    create: (email, firstName, lastName, password) => {
        return new Promise((resolve, reject) => {
            const user = User.create(firstName, lastName, email, password);
            if (!user) {
                reject('Invalid inputs');
            }
            return service.getOne({ email: user.email })
                .then(res => {
                    if (res) {
                        reject('User with this email already exists');
                    }
                    const session = db.getSession();
                    let createdUser;
                    session.run(`CREATE (user:User ${db.jsonToCreateQuery(user)}) RETURN user`)
                        .subscribe({
                            onNext: (record) => {
                                createdUser = db.parse(record, 'user', ['password', 'isDeleted']);
                            },
                            onCompleted: () => {
                                session.close();
                                resolve(createdUser);
                            },
                            onError: (err) => {
                                console.log(err);
                                throw err;
                            }
                        });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        });
    },

    update: (_id, updates) => {
        return new Promise((resolve, reject) => {
            for (let prop of Object.keys(updates)) {
                if (User.schema[prop].validate && !User.schema[prop].validate(updates[prop])) {
                    reject('Invalid inputs');
                }
            }

            return service.getOne({ _id: _id })
                .then(user => {
                    const session = db.getSession();
                    const setQuery = db.jsonToSetQuery(updates, 'user');
                    let updatedUser;
                    session.run(`MATCH (user:User) WHERE user._id = "${user._id}" SET ${setQuery} RETURN user`)
                        .subscribe({
                            onNext: (record) => {
                                updatedUser = db.parse(record, 'user', ['password', 'isDeleted']);
                            },
                            onCompleted: () => {
                                session.close();
                                resolve(updatedUser);
                            },
                            onError: (err) => {
                                console.log(err);
                                throw err;
                            }
                        });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        });
    },

    remove: (_id) => {
        return new Promise(resolve => {
            const session = db.getSession();
            return session.run(`MATCH (user:User) WHERE user._id = "${_id}" DETACH DELETE user`)
                .subscribe({
                    onCompleted: () => {
                        resolve();
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    login: (email, password) => {
        return new Promise((resolve, reject) => {
            service.getOne({ email: email }, true)
                .then(user => {
                    if (!user) {
                        reject(new Error('Login invalid'));
                    } else {
                        const isPasswordOk = User.comparePassword(password, user.password);

                        if (!isPasswordOk) {
                            reject(new Error('Login invalid'));
                        } else {
                            const token = jwt.sign({ user_id: user._id }, config.token.key, {
                                expiresIn: config.token.expirationInSeconds
                            });

                            resolve({
                                user_id: user._id,
                                token,
                                tokenExpiration: config.token.expirationInSeconds
                            });
                        }
                    }
                })
                .catch(err => {
                    throw err;
                });
        });
    },

    getFriends: (user_id) => {
        return new Promise(resolve => {
            resolve();
        });
    }
}

module.exports = service;