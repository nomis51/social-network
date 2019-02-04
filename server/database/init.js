(() => {
    const db = require('./db');
    const neoConfig = require('./config');
    const User = require('./models/User');

    console.log('Connecting...');
    db.connect(neoConfig.dev.url, neoConfig.dev.username, neoConfig.dev.password);

    const session = db.getSession();
    console.log('Clearing existing data in the db...');
    return session.run('MATCH (n) DETACH DELETE n')
        .subscribe({
            onCompleted: () => {
                console.log('Pushing data to the db...');
                return session.run(`CREATE 
                (bob:User {
                    _id:"a", 
                    firstName: "Bob", 
                    lastName: "Marcel", 
                    email: "bmarce@gmail.com", 
                    password: "${User.hashPassword('MyBlackDog34*')}", 
                    isDeleted: false
                }), 
                (sarah: User {
                    _id:"b", 
                    firstName: "Sarah", 
                    lastName: "Brown", 
                    email: "sbrown@gmail.com", 
                    password: "${User.hashPassword('lovePoney+7')}", 
                    isDeleted: false
                }),
                (rocky: User {
                    _id:"c", 
                    firstName: "Rocky", 
                    lastName: "Balboa", 
                    email: "punchit@gmail.com", 
                    password: "${User.hashPassword('Adrienne_w8')}", 
                    isDeleted: false
                }), 
                (m1: Message {
                    _id: "d",
                    content: "Hey sarah!",
                    creationTime: "2019-01-01 00:00:00",
                    isDeleted: false
                }),
                (rocky)-[:WROTE]->(m1)-[:DESTINATED_TO]->(sarah),
                (m2:Message {
                    _id: "e",
                    content: "Hello, happy new year!",
                    creationTime: "2019-01-01 00:02:06",
                    isDeleted: false
                }),
                (sarah)-[:WROTE]->(m2)-[:DESTINATED_TO]->(rocky),
                (m3: Message {
                    _id: "f",
                    content: "Hey, you're coming to the show tonight?",
                    creationTime: "2019-01-02 13:25:54",
                    isDeleted: false
                }),
                (sarah)-[:WROTE]->(m3)-[:DESTINATED_TO]->(bob),
                (m4: Message{
                    _id: "g",
                    content: "Sarah is asking me if i'll come to the show tonight, are you coming?",
                    creationTime: "2019-01-02 14:56:14",
                    isDeleted: false
                }),
                (bob)-[:WROTE]->(m4)-[:DESTINATED_TO]->(rocky),
                (m5: Message{
                    _id: "h",
                    content: "Nah, i hate you...",
                    creationTime: "2019-01-02 14:58:45",
                    isDeleted: true
                }),
                (rocky)-[:WROTE]->(m5)-[:DESTINATED_TO]->(bob),
                (m6: Message{
                    _id: "i",
                    content: "Sure, i'll come!",
                    creationTime: "2019-01-02 15:03:03",
                    isDeleted: false
                }),
                (rocky)-[:WROTE]->(m6)-[:DESTINATED_TO]->(bob),
                (c:Conversation {
                    _id:"j", 
                    creationTime: "2019-01-01 02:03:05", 
                    isDeleted: false
                }), 
                (c)-[:CREATED_BY]->(sarah), 
                (bob)-[:PARTICIPATE_TO]->(c), 
                (rocky)-[:PARTICIPATE_TO]->(c), 
                (sarah)-[:PARTICIPATE_TO]->(c),
                (m7: Message{
                    _id: "k",
                    content: "Hey guys! This is our first conversation!!",
                    creationTime: "2019-01-02 15:23:51",
                    isDeleted: false
                }),
                (sarah)-[:WROTE]->(m7)-[:DESTINATED_TO]->(c),
                (m8: Message {
                    _id: "l",
                    content: "Yo!",
                    creationTime: "2019-01-02 15:24:14",
                    isDeleted: false
                }),
                (bob)-[:WROTE]->(m8)-[:DESTINATED_TO]->(c),
                (p1:Post {
                    _id: "m",
                    content: "Hey, this is my post",
                    creationTime: "2019-01-01 15:14:12",
                    isDeleted: false
                }),
                (bob)-[:WROTE]->(p1),
                (p2:Post {
                    _id: "m",
                    content: "Hey, this is my post #2",
                    creationTime: "2019-01-01 15:15:12",
                    isDeleted: false
                }),
                (bob)-[:WROTE]->(p2),
                (p3:Post {
                    _id: "m",
                    content: "Hey, this is my post #3",
                    creationTime: "2019-01-01 15:19:12",
                    isDeleted: false
                }),
                (sarah)-[:WROTE]->(p3),
                (sarah)-[:FRIEND]->(bob),
                (bob)-[:FRIEND]->(sarah),
                (rocky)-[:FRIEND]->(sarah),
                (sarah)-[:FRIEND]->(rocky)
                 `)
                    .subscribe({
                        onCompleted: () => {
                            session.close();
                            console.log('Data pushed to the db!');
                        },
                        onError: (err) => {
                            console.log(err);
                        }
                    });
            },
            onError: (err) => {
                console.log(err);
            }
        })
})();