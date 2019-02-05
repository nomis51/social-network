const postService = require('./post.service');
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
                    return session.run(
                        `CREATE (u:User {
                            _id:"a",
                            firstName: "Bianca",
                            lastName: "Gino",
                            email: "bgino@gmail.com",
                            password: "${User.hashPassword('my#Love12')}",
                            creationTime: "2019-01-01 15:00:00"
                        }),
                        (p1: Post {
                            _id: "b",
                            content: "This the content of my post",
                            isDeleted: false,
                            creationTime: "2019-01-02 15:14:32"
                        }),
                        (p2: Post {
                            _id: "c",
                            content: "This the content of my second post",
                            isDeleted: true,
                            creationTime: "2019-01-02 16:14:32",
                            lastUpdateTime: "2019-01-02 16:14:56"
                        }),
                        (p1)<-[:WROTE]-(u)-[:WROTE]->(p2)
                        `
                    )
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

test('getAll(): Should return an array', () => {
    expect.assertions(3);
    return postService.getAll()
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).not.toBeUndefined();
            expect(Array.isArray(data)).toBe(true);
        });
});

test('getAll(): Should have properties: _id, content, creationTime, creator', () => {
    expect.assertions(5);
    return postService.getAll()
        .then(data => {
            expect(data[0]._id).toBeTruthy();
            expect(data[0].content).toBeTruthy();
            expect(data[0].creationTime).toBeTruthy();
            expect(data[0].creator).toBeTruthy();
            expect(data[0].isDeleted).toBeFalsy();
        });
});

test('getAll(): Should have properties with types: _id (String), content (String), creationTime (String), creator (Object)', () => {
    expect.assertions(4);
    return postService.getAll()
        .then(data => {
            expect(typeof data[0]._id).toBe('string');
            expect(typeof data[0].content).toBe('string');
            expect(typeof data[0].creationTime).toBe('string');
            expect(typeof data[0].creator).toBe('object');
        });
});

test('get(): Should return an array', () => {
    expect.assertions(3);
    return postService.get({})
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).not.toBeUndefined();
            expect(Array.isArray(data)).toBe(true);
        });
});

test('get(): Should have properties: _id, content, creationTime, creator', () => {
    expect.assertions(5);
    return postService.get()
        .then(data => {
            expect(data[0]._id).toBeTruthy();
            expect(data[0].content).toBeTruthy();
            expect(data[0].creationTime).toBeTruthy();
            expect(data[0].creator).toBeTruthy();
            expect(data[0].isDeleted).toBeFalsy();
        });
});

test('get(): Should have properties with types: _id (String), content (String), creationTime (String), creator (Object)', () => {
    expect.assertions(4);
    return postService.get()
        .then(data => {
            expect(typeof data[0]._id).toBe('string');
            expect(typeof data[0].content).toBe('string');
            expect(typeof data[0].creationTime).toBe('string');
            expect(typeof data[0].creator).toBe('object');
        });
});

test('get(): Should return an array of one object with query {content: \'This the content of my post\'}', () => {
    expect.assertions(3);
    return postService.get({ content: 'This the content of my post' })
        .then(data => {
            expect(data).not.toBeNull();
            expect(data).toBeDefined();
            expect(data.length).toBe(1);
        });
});

test('get(): Should return an array of two objects with query {creator: user(Bianca)}', () => {
    expect.assertions(5);
    return userService.getOne({ firstName: 'Bianca' })
        .then(user => {
            expect(user).toBeDefined();
            expect(user).not.toBeNull();
            return postService.get({ creator: user })
                .then(data => {
                    expect(data.length).toBe(2);

                    for (let m of data) {
                        expect(m.creator._id).toEqual(user._id);
                    }
                });
        });
});

test('get(): Should return an array of one object with query {creationTime: (Date)}', () => {
    expect.assertions(1);
    const date = '2019-01-02 15:14:32';
    return postService.get({ creationTime: date })
        .then(data2 => {
            expect(data2.length).toBe(1);
        });
});

test('get(): Should an array of one message with query {isDeleted:true}', () => {
    expect.assertions(1);
    return postService.get({ isDeleted: true })
        .then(data => {
            expect(data.length).toBe(1);
        });
});

test('getOne(): Should not return an array with query {}', () => {
    expect.assertions(1);
    return postService.getOne({})
        .then(data => {
            expect(Array.isArray(data)).toBe(false);
        });
});

test('getOne(): Object should contain message model with properties: content, creator, creationTime', () => {
    expect.assertions(4);
    return postService.getOne({})
        .then(data => {
            expect(data.content).toBeTruthy();
            expect(data.creator).toBeTruthy();
            expect(data.creationTime).toBeTruthy();
            expect(data.isDeleted).toBeUndefined();
        });
});

test('getOne(): Array should contain message model with properties types: content (String), creator (User), creationTime (Date)', () => {
    expect.assertions(3);
    return postService.getOne({})
        .then(data => {
            expect(typeof data.content).toBe('string');
            expect(typeof data.creator).toBe('object');
            expect(new Date(data.creationTime)).toBeTruthy();
        });
});

test('getOne(): Should return one message with query {content: \'This the content of my post\'}', () => {
    expect.assertions(2);
    return postService.getOne({ content: 'This the content of my post' })
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

            return postService.getOne({ creator: user })
                .then(data => {
                    expect(data).not.toBeNull();
                    expect(data).toBeDefined();
                    expect(data.creator._id).toEqual(user._id);
                });
        });
});

test('getOne(): Should return one object with query {creationTime: (creationTIme of Bianca 1st message)}', () => {
    expect.assertions(2);
    const date = '2019-01-02 15:14:32';
    return postService.getOne({ creationTime: date })
        .then(data2 => {
            expect(data2).toBeDefined();
            expect(data2).not.toBeNull();
        });
});

test('getOne(): Should return one message', () => {
    expect.assertions(1);
    return postService.getOne({ isDeleted: true })
        .then(data => {
            expect(data).not.toBeNull();
        });
});

test('create(): Should create a post with content {content:"This is a new post", creator: (Bianca\'s _id)}', () => {
    expect.assertions(4);
    return userService.getOne({ firstName: 'Bianca' })
        .then(user => {
            expect(user).not.toBeNull();

            return postService.create('This is a new post', user._id, 'c')
                .then(data => {
                    expect(data).toBeTruthy();
                    expect(data.creator._id).toEqual(user._id);

                    return postService.getOne({ content: 'This is a new post' })
                        .then(data2 => {
                            expect(data2).not.toBeNull();
                        });
                });
        });
});

test('update(): Should update the content from "This the content of my post" top "This is an updated post"', () => {
    expect.assertions(2);
    const id = 'b';
    return postService.update(id, 'This is an updated post')
        .then(data => {
            expect(data.content).toBe('This is an updated post');
            return postService.getOne({ _id: id })
                .then(data2 => {
                    expect(data2.content).toBe('This is an updated post');
                });
        });
});

test('update(): Should not update anything and reject an error', () => {
    expect.assertions(1);
    return postService.update('wrong id', '...')
        .then(data => {
            expect(true).toBeFalsy();
        })
        .catch(err => {
            expect(err).toBeDefined();
        });
});

test('delete(): Should delete the post "b"', () => {
    expect.assertions(2);
    const id = 'b';
    return postService.delete(id)
        .then(data => {
            expect(data).toBeFalsy();
            return postService.getOne({ _id: id })
                .then(data2 => {
                    expect(data2).toBeFalsy();
                });
        });
});

test('delete(): Should not delete anything and reject an error', () => {
    expect.assertions(1);
    return postService.delete('wrong id', '...')
        .then(data => {
            expect(true).toBeFalsy();
        })
        .catch(err => {
            expect(err).toBeDefined();
        });
});

test('getAll(): Should return posts sorted by lastUpdateTime', ()=>{

});