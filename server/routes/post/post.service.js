const Post = require('../../database/models/Post');
const db = require('../../database/db');

const service = {
    getAll: () => {
        return new Promise(resolve => {
            const session = db.getSession();
            let posts = [];
            return session.run(`MATCH (post:Post), (user:User) WHERE (user)-[:WROTE]->(post) RETURN post, user ORDER BY post.lastUpdateTime DESC`)
                .subscribe({
                    onNext: (record) => {
                        let post = db.parse(record, 'post', ['isDeleted']);
                        post.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                        posts.push(post);
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(posts);
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
            let posts = [];
            let whereQuery = db.jsonToWhereQuery(query, 'post', { creator: 'user._id = @VALUE' });
            return session.run(`MATCH (post:Post), (user:User) WHERE ${whereQuery}${whereQuery == '' ? '' : ' AND '}(user)-[:WROTE]->(post) RETURN post, user ORDER BY post.lastUpdateTime DESC`)
                .subscribe({
                    onNext: (record) => {
                        let post = db.parse(record, 'post', ['isDeleted']);
                        post.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                        posts.push(post);
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(posts);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },
    getOne: (query) => {
        return new Promise(resolve => {
            const session = db.getSession();
            let post;
            let whereQuery = db.jsonToWhereQuery(query, 'post', { creator: 'user._id = @VALUE' });
            return session.run(`MATCH (post:Post), (user:User) WHERE ${whereQuery}${whereQuery == '' ? '' : ' AND '}(user)-[:WROTE]->(post) RETURN post, user`)
                .subscribe({
                    onNext: (record) => {
                        session.close();
                        post = db.parse(record, 'post', ['isDeleted']);
                        post.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                    },
                    onCompleted: () => {
                        resolve(post);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },
    create: (content, creator_id) => {
        return new Promise((resolve, reject) => {
            const post = Post.create(content);

            if (!post) {
                return reject('Invalid inputs');
            }

            let createdPost;
            const session = db.getSession();
            return session.run(`MATCH (user:User) WHERE user._id = "${creator_id}" CREATE (post:Post {
                _id: "${post._id}",
                content: "${post.content}",
                isDeleted: ${post.isDeleted},
                creationTime: "${post.creationTime}",
                lastUpdateTime: "${post.lastUpdateTime}"
            }), (user)-[:WROTE]->(post) RETURN post, user`)
                .subscribe({
                    onNext: (record) => {
                        session.close();
                        createdPost = db.parse(record, 'post', ['isDeleted']);
                        createdPost.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                    },
                    onCompleted: () => {
                        resolve(createdPost);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },
    update: (_id, content) => {
        return new Promise((resolve, reject) => {
            const session = db.getSession();
            let post;
            return session.run(`MATCH (post:Post {_id: "${_id}"}) RETURN post`)
                .subscribe({
                    onNext: (record) => {
                        post = db.parse(record, 'post', ['isDeleted']);
                    },
                    onCompleted: () => {
                        if (!post) {
                            return reject('Invalid inputs');
                        }
                        let updatedPost;
                        session.run(`MATCH (post:Post {_id: "${post._id}"}) SET post.content = "${content}" RETURN post`)
                            .subscribe({
                                onNext: (record) => {
                                    session.close();
                                    updatedPost = db.parse(record, 'post', ['isDeleted']);
                                },
                                onCompleted: () => {
                                    if (!updatedPost) {
                                        return reject('Invalid inputs');
                                    }
                                    resolve(updatedPost);
                                },
                                onError: (err) => {
                                    console.log(err);
                                    throw err;
                                }
                            });
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },
    delete: (_id) => {
        return new Promise((resolve, reject) => {
            const session = db.getSession();
            let post;
            return session.run(`MATCH (post:Post {_id: "${_id}"}) RETURN post`)
                .subscribe({
                    onNext: (record) => {
                        post = db.parse(record, 'post', ['isDeleted']);
                    },
                    onCompleted: () => {
                        if (!post) {
                            return reject('Invalid inputs');
                        }
                        session.run(`MATCH (post:Post {_id: "${post._id}"}) DETACH DELETE post`)
                            .subscribe({
                                onNext: (record) => {
                                },
                                onCompleted: () => {
                                    session.close();
                                    resolve();
                                },
                                onError: (err) => {
                                    console.log(err);
                                    throw err;
                                }
                            });
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    }
}

module.exports = service;