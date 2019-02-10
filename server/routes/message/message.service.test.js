const messageService = require('./message.service');
const userService = require('../user/user.service');
const db = require('../../database/db');
const neoConfig = require('../../database/config');
const User = require('../../database/models/User');

beforeAll(() => {
    db.connect(neoConfig.dev.url, neoConfig.dev.username, neoConfig.dev.password);
});

beforeEach(() => {
    return new Promise(resolve => {
        const session = db.getSession();
        return session.run('MATCH (n) DETACH DELETE n')
            .subscribe({
                onCompleted: () => {
                    return session.run(`CREATE (m:Message {_id: "b", content: "This is a message", isDeleted: false, creationTime: "2019-01-01 15:00:00"}), 
                        (b:User {
                        _id:"c",
                        firstName: "Bianca",
                        lastName: "Gino",
                        email: "bgino@gmail.com",
                        password: "${User.hashPassword('my#Love12')}",
                        creationTime: "2019-01-01 15:00:00"
                    }), 
                    (m2:Message {_id: "d", content: "This is another message", isDeleted: true, creationTime: "2019-01-01 15:05:00"}), 
                    (m)<-[:WROTE]-(b), 
                    (b)-[:WROTE]->(m2),
                    (j:User {
                        _id:"e",
                        firstName: "John",
                        lastName: "Cena",
                        email: "blingbling@gmail.com",
                        password: "${User.hashPassword('Bebling&123')}",
                        creationTime: "2015-05-05 15:15:15"
                    }),
                    (m)-[:DESTINATED_TO]->(j),
                    (m2)-[:DESTINATED_TO]->(j)
                    `)
                        .subscribe({
                            onCompleted: () => {
                                session.close();
                                resolve();
                            },
                            onError: (err) => {
                                console.log(err);
                                throw err;
                            }
                        })
                },
                onError: (err) => {
                    console.log(err);
                    throw err;
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


test('getAll(): Should return an array of messages', () => {
    expect.assertions(1);
    return messageService.getAll()
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
        });
});

test('getAll(): Array should contain message model with properties: content, creator, creationTime', () => {
    expect.assertions(4);
    return messageService.getAll()
        .then(data => {
            const message = data[0];
            expect(message.content).toBeTruthy();
            expect(message.creator).toBeTruthy();
            expect(message.creationTime).toBeTruthy();
            expect(message.isDeleted).toBeUndefined();
        });
});

test('getAll(): Array should contain message model with properties types: content (String), creator (User), creationTime (Date) ', () => {
    expect.assertions(3);
    return messageService.getAll()
        .then(data => {
            const message = data[0];
            expect(typeof message.content).toBe('string');
            expect(typeof message.creator).toBe('object');
            expect(new Date(message.creationTime)).toBeTruthy();
        });
});

test('get(): Should return an array with query {}', () => {
    expect.assertions(1);
    return messageService.get({})
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
        });
});

test('get(): Array should contain message model with properties: content, creator, creationTime', () => {
    expect.assertions(4);
    return messageService.get({})
        .then(data => {
            const message = data[0];
            expect(message.content).toBeTruthy();
            expect(message.creator).toBeTruthy();
            expect(message.creationTime).toBeTruthy();
            expect(message.isDeleted).toBeUndefined();
        });
});

test('get(): Array should contain message model with properties types: content (String), creator (User), creationTime (Date) ', () => {
    expect.assertions(3);
    return messageService.get()
        .then(data => {
            const message = data[0];
            expect(typeof message.content).toBe('string');
            expect(typeof message.creator).toBe('object');
            expect(new Date(message.creationTime)).toBeTruthy();
        });
});

test('get(): Should return an array of one object with query {content: \'This is a message\'}', () => {
    expect.assertions(3);
    return messageService.get({ content: 'This is a message' })
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).toBeDefined();
            expect(data.length).toBe(1);
        });
});

test('get(): Should an array of two messages with query {}', () => {
    expect.assertions(3);
    return messageService.get({})
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).toBeDefined();
            expect(data.length).toBe(2);
        });
});

test('get(): Should return an array of one object with query {content: \'This is another message\' }', () => {
    expect.assertions(1);
    return messageService.get({ content: 'This is another message' })
        .then(data => {
            expect(data.length).toBe(1);
        });
});

test('get(): Should return an array of two objects with query {creator: user(Bianca)}', () => {
    expect.assertions(5);
    return userService.getOne({ firstName: 'Bianca' })
        .then(user => {
            expect(user).toBeDefined();
            expect(user).not.toBeNull();
            return messageService.get({ creator: user })
                .then(data => {
                    expect(data.length).toBe(2);

                    for (let m of data) {
                        expect(m.creator._id).toEqual(user._id);
                    }
                });
        });
});

test('get(): Should return an array of one object with query {creationTime: (creationTime of Bianca 1st message)}', () => {
    expect.assertions(1);
    const date = '2019-01-01 15:00:00';
    return messageService.get({ creationTime: date })
        .then(data2 => {
            expect(data2.length).toBe(1);
        });
});

test('get(): Should an array of one message with query {isDeleted:true}', () => {
    expect.assertions(1);
    return messageService.get({ isDeleted: true })
        .then(data => {
            expect(data.length).toBe(1);
        });
});

test('getOne(): Should not return an array with query {}', () => {
    expect.assertions(1);
    return messageService.getOne({})
        .then(data => {
            expect(Array.isArray(data)).toBe(false);
        });
});

test('getOne(): Object should contain message model with properties: content, creator, creationTime', () => {
    expect.assertions(4);
    return messageService.getOne({})
        .then(data => {
            expect(data.content).toBeTruthy();
            expect(data.creator).toBeTruthy();
            expect(data.creationTime).toBeTruthy();
            expect(data.isDeleted).toBeUndefined();
        });
});

test('getOne(): Array should contain message model with properties types: content (String), creator (User), creationTime (Date)', () => {
    expect.assertions(3);
    return messageService.getOne({})
        .then(data => {
            expect(typeof data.content).toBe('string');
            expect(typeof data.creator).toBe('object');
            expect(new Date(data.creationTime)).toBeTruthy();
        });
});

test('getOne(): Should return one message with query {content: \'This is a message\'}', () => {
    expect.assertions(2);
    return messageService.getOne({ content: 'This is a message' })
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).toBeDefined();
        });
});

test('getOne(): Should return a message from creator Bianca with query {creator: user(Bianca)}', () => {
    expect.assertions(5);
    return userService.getOne({ firstName: 'Bianca' })
        .then(user => {
            expect(user).toBeDefined();
            expect(user).not.toBeNull();

            return messageService.getOne({ creator: user })
                .then(data => {
                    expect(data).not.toBeNull();
                    expect(data).toBeDefined();
                    expect(data.creator._id).toEqual(user._id);
                });
        });
});

test('getOne(): Should return one object with query {creationTime: (creationTIme of Bianca 1st message)}', () => {
    expect.assertions(2);
    const date = '2019-01-01 15:05:00';
    return messageService.getOne({ creationTime: date })
        .then(data2 => {
            expect(data2).toBeDefined();
            expect(data2).not.toBeNull();
        });
});

test('getOne(): Should return one message', () => {
    expect.assertions(1);
    return messageService.getOne({ isDeleted: true })
        .then(data => {
            expect(data).not.toBeNull();
        });
});

test('create(): Should create a message with content {content:"This is a new message", creator: (John _id)}', () => {
    expect.assertions(4);
    return userService.getOne({ firstName: 'John' })
        .then(user => {
            expect(user).not.toBeNull();

            return messageService.create('This is a new message created with the user _id', user._id, 'c')
                .then(data => {
                    expect(data).toBeTruthy();
                    expect(data.creator._id).toEqual(user._id);

                    return messageService.getOne({ content: 'This is a new message created with the user _id' })
                        .then(data2 => {
                            expect(data2).not.toBeNull();
                        });
                });
        });
});

test('getConversations(): Should return an array of conversations', () => {
    expect.assertions(1);
    return messageService.getConversations('c')
        .then(data => {
            expect(Array.isArray(data)).toBe(true);
        });
});

test('getConversations(): Should contain object with the following props: recipient and user', () => {
    expect.assertions(2);
    return messageService.getConversations('c')
        .then(data => {
            const c = data[0];
            expect(c.recipient).toBeTruthy();
            expect(c.user).toBeTruthy();
        });
});

test('getConversations(): Should not return a recipient more than once', () => {
    expect.assertions(0);
    return messageService.getConversations('c')
        .then(data => {
            let recipients = [];
            for (let c of data) {
                if (!recipients.includes(c.recipient._id)) {
                    recipients.push(c.recipient._id);
                } else {
                    expect(0).toBe(1);
                }
            }
        });
});
