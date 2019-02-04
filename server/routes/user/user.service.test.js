const db = require('../../database/db');
const neoConfig = require('../../database/config');
const userService = require('./user.service');
const User = require('../../database/models/User');

beforeAll(() => {
    db.connect(neoConfig.dev.url, neoConfig.dev.username, neoConfig.dev.password);
});

beforeEach(() => {
    return new Promise(resolve => {
        const session = db.getSession();
        return session.run('MATCH (u:User) DETACH DELETE u')
            .subscribe({
                onCompleted: () => {
                    return session.run(`CREATE (p:User {
                                            _id: "a",
                                            firstName: "Paul",
                                            lastName: "Tibodo",
                                            email: "ptibodo@gmail.com",
                                            password: "${User.hashPassword('Blackdog45%')}",
                                            isDeleted: false,
                                            creationTime: "2019-01-01 15:01:00"
                                        }),
                                        (b:User {
                                            _id:"c",
                                            firstName: "Bianca",
                                            lastName: "Gino",
                                            email: "bgino@gmail.com",
                                            password: "${User.hashPassword('my#Love12')}",
                                            creationTime: "2019-01-01 15:00:00"
                                        }),
                                        (p)-[:FRIEND]->(b),
                                        (b)-[:FRIEND]->(p)
                                        `)
                        .subscribe({
                            onCompleted: () => {
                                session.close();
                                resolve();
                            }
                        });
                }
            });
    });
});

afterAll(() => {
    return new Promise(resolve => {
        const session = db.getSession();
        return session.run('MATCH(n) DETACH DELETE n')
            .subscribe({
                onCompleted: () => {
                    session.close();
                    resolve();
                }
            });
    });
});



test('getAll(): Should return an array', () => {
    expect.assertions(1);
    return userService.getAll()
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
        });
});

test('getAll(): Should have following properties: firstName, lastName, creationTime, email, _id in the objects', () => {
    expect.assertions(7);
    return userService.getAll()
        .then(data => {
            const data2 = data[0];
            expect(data2.firstName).toBeTruthy();
            expect(data2.lastName).toBeTruthy();
            expect(data2.email).toBeTruthy();
            expect(data2._id).toBeTruthy();
            expect(data2.creationTime).toBeTruthy();
            expect(data2.password).toBeUndefined();
            expect(data2.isDeleted).toBeUndefined();
        });
});

test('getAll(): Should have properties with following types: firstName as String, lastName as String,  creationTime as String, email as String, _id as String in the objects', () => {
    expect.assertions(5);
    return userService.getAll()
        .then(data => {
            const data2 = data[0];
            expect(typeof data2.firstName).toBe('string');
            expect(typeof data2.lastName).toBe('string');
            expect(typeof data2.email).toBe('string');
            expect(typeof data2.creationTime).toBe('string');
            expect(typeof data2._id).toBe('string');

        });
});

test('get(): Should return an array of users', () => {
    expect.assertions(1);
    return userService.get({})
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
        });
});

test('get(): Should return an empty array', () => {
    expect.assertions(2);
    return userService.get({ _id: 'wrong id' })
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
        });
});

test('get(): Should have following properties: firstName, lastName, email, creationTime, _id in the object with firstName Paul', () => {
    expect.assertions(7);
    return userService.get({ firstName: 'Paul' })
        .then(data => {
            const data2 = data[0];
            expect(data2.firstName).toBeTruthy();
            expect(data2.lastName).toBeTruthy();
            expect(data2.email).toBeTruthy();
            expect(data2._id).toBeTruthy();
            expect(data2.creationTime).toBeTruthy();
            expect(data2.password).toBeUndefined();
            expect(data2.isDeleted).toBeUndefined();
        });
});

test('get(): Should have properties with following types: firstName as String, lastName as String, email as String, _id as String, creationTime as String  in the object with firstName Paul', () => {
    expect.assertions(5);
    return userService.get({ firstName: 'Paul' })
        .then(data => {
            const data2 = data[0];
            expect(typeof data2.firstName).toBe('string');
            expect(typeof data2.lastName).toBe('string');
            expect(typeof data2.email).toBe('string');
            expect(typeof data2.creationTime).toBe('string');
            expect(typeof data2._id).toBe('string');

        });
});

test('getOne(): Should not return an array with query {}, but the first user found', () => {
    expect.assertions(2);
    return userService.getOne({})
        .then(data => {
            expect(Array.isArray(data)).toBe(false);
            expect(data).not.toBeNull();
        });
});

test('getOne(): Should return null', () => {
    expect.assertions(1);
    return userService.getOne({ _id: 'Wrong id' })
        .then(data => {
            expect(data).toBeNull();
        });
});

test('getOne(): Should have following properties: firstName, lastName, email, _id  with lastName Tibodo', () => {
    expect.assertions(6);
    return userService.getOne({ lastName: 'Tibodo' })
        .then(data => {
            expect(data.firstName).toBeTruthy();
            expect(data.lastName).toBeTruthy();
            expect(data.email).toBeTruthy();
            expect(data._id).toBeTruthy();
            expect(data.password).toBeUndefined();
            expect(data.isDeleted).toBeUndefined();
        });
});

test('getOne(): Should have properties with following types: firstName as String, lastName as String, email as String, _id as String, password as String, isDeleted as Boolean; with lastName Tibodo', () => {
    expect.assertions(4);
    return userService.getOne({ lastName: 'Tibodo' })
        .then(data => {
            expect(typeof data.firstName).toBe('string');
            expect(typeof data.lastName).toBe('string');
            expect(typeof data.email).toBe('string');
            expect(typeof data._id).toBe('string');

        });
});

test('getOne(): Should return lastName equal Tibodo with firstName Paul', () => {
    expect.assertions(1);
    return userService.getOne({ firstName: 'Paul' })
        .then(data => {
            expect(data.lastName).toBe('Tibodo');
        });
});

test('getOne(): Should return firstName equal Paul with lastName Tibodo', () => {
    expect.assertions(1);
    return userService.getOne({ lastName: 'Tibodo' })
        .then(data => {
            expect(data.firstName).toBe('Paul');
        });
});

test('getOne(): Should return firstName equal Paul with email ptibodo@gmail.com', () => {
    expect.assertions(1);
    return userService.getOne({ email: 'ptibodo@gmail.com' })
        .then(data => {
            expect(data.firstName).toBe('Paul');
        });
});

test('getOne(): Should return firstName equal Paul with Bianca\'s _id acquired from lastName Tibodo', () => {
    expect.assertions(1);
    return userService.getOne({ lastName: 'Tibodo' })
        .then(data => {
            return userService.getOne({ _id: data._id })
                .then(data2 => {
                    expect(data2.firstName).toBe('Paul');
                });
        });
});

// TODO: test with keepAllProperties and not all properties getOne()

test('create(): Should create the user Sarah Brown', () => {
    expect.assertions(4);
    return userService.create('sbrown@gmail.com', 'Sarah', 'Brown', 'Bigyeah*3')
        .then(data => {
            expect(data.firstName).toBe('Sarah');
            expect(data.lastName).toBe('Brown');
            expect(data.email).toBe('sbrown@gmail.com');

            return userService.getOne({ firstName: 'Sarah', lastName: 'Brown', email: 'sbrown@gmail.com' })
                .then(data2 => {
                    expect(data2).not.toBeNull();
                });
        });
});

test('create(): Should not let us create the user Sarah Brown twice with the same email', () => {
    expect.assertions(5);
    return userService.create('sbrown@gmail.com', 'Sarah', 'Brown', 'Bigyeah*3')
        .then(data => {
            expect(data.firstName).toBe('Sarah');
            expect(data.lastName).toBe('Brown');
            expect(data.email).toBe('sbrown@gmail.com');

            return userService.getOne({ firstName: 'Sarah', lastName: 'Brown', email: 'sbrown@gmail.com' })
                .then(data2 => {
                    expect(data2).not.toBeNull();
                    return userService.create('sbrown@gmail.com', 'Sarah', 'Brown', 'Bigyeah*3')
                        .catch(err => {
                            expect(true).toBeTruthy();
                        });
                });
        });
});

test('update(): Should update Paul Tibodo for Paul Lilo', () => {
    expect.assertions(4);
    return userService.getOne({ firstName: 'Paul', lastName: 'Tibodo' })
        .then(data => {
            expect(data).not.toBeNull();

            return userService.update(data._id, { lastName: 'Lilo' })
                .then(data2 => {
                    expect(data2).not.toBeNull();

                    return userService.getOne({ _id: data._id })
                        .then(data3 => {
                            expect(data3.firstName).toBe('Paul');
                            expect(data3.lastName).toBe('Lilo');
                        });
                });
        });
});

test('update(): Should update Paul Tibodo for Francis Tibodo', () => {
    expect.assertions(4);
    return userService.getOne({ firstName: 'Paul', lastName: 'Tibodo' })
        .then(data => {
            expect(data).not.toBeNull();

            return userService.update(data._id, { firstName: 'Francis' })
                .then(data2 => {
                    expect(data2).not.toBeNull();

                    return userService.getOne({ _id: data._id })
                        .then(data3 => {
                            expect(data3.firstName).toBe('Francis');
                            expect(data3.lastName).toBe('Tibodo');
                        });
                });
        });
});

test('update(): Should update Paul Tibodo email\'s from ptibodo@gmail.com to bigyeah@gmail.com', () => {
    expect.assertions(5);
    return userService.getOne({ firstName: 'Paul', lastName: 'Tibodo' })
        .then(data => {
            expect(data).not.toBeNull();

            return userService.update(data._id, { email: 'bigyeah@gmail.com' })
                .then(data2 => {
                    expect(data2).not.toBeNull();

                    return userService.getOne({ _id: data._id })
                        .then(data3 => {
                            expect(data3.firstName).toBe('Paul');
                            expect(data3.lastName).toBe('Tibodo');
                            expect(data3.email).toBe('bigyeah@gmail.com');
                        });
                });
        });
});

test('update(): Should update Paul Tibodo passwords\'s from mylove12 to omg26', () => {
    expect.assertions(2);
    return userService.getOne({ firstName: 'Paul', lastName: 'Tibodo' })
        .then(data => {
            expect(data).not.toBeNull();

            return userService.update(data._id, { password: 'omg26' })
                .then(data2 => {
                    expect(data2).not.toBeNull();
                });
        });
});

test('remove(): Should remove the user Paul Tibodo by _id', () => {
    expect.assertions(2);
    return userService.getOne({ firstName: 'Paul', lastName: 'Tibodo' })
        .then(data => {
            expect(data).not.toBeNull();

            return userService.remove(data._id)
                .then(() => {
                    return userService.getOne({ _id: data._id })
                        .then(data2 => {
                            expect(data2).toBeNull();
                        });
                });
        });
});

test('login(): Should login successfully', () => {
    expect.assertions(3);
    return userService.login('ptibodo@gmail.com', 'Blackdog45%')
        .then(data => {
            expect(data.token).not.toBeUndefined();
            expect(data.tokenExpiration).not.toBeUndefined();
            expect(data.user_id).not.toBeUndefined();
        });
});

test('login(): Should not login successfully', () => {
    expect.assertions(1);
    return userService.login('yeah@gmail.com', 'asdf123&')
        .then()
        .catch(err => {
            expect(err).not.toBeUndefined();
        });
});

test('getFriends(): ', ()=>{
    
});
