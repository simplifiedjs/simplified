'use strict';

const {graphql, buildSchema} = require('graphql');

require('../lib/bootstrap')({
    database: {
        driver: ''
    }
});

console.log(Collection.User);

/**

const schema = buildSchema(`
type User {
    ID: Int
    login: String
    status: String
}

type Query {
    user(ID: Int, login: String): User
}
`);

const data = {
    1: {ID: 1, login: 'one', status: 'block'},
    2: {ID: 2, login: 'two', status: 'active'}
};

const resolvers = {
    user: function({ID, login}) {
        return data[ID];
    }
};

const q = `{
user(ID: 2, login: "one"){
    login
}
}`;

graphql(schema, q, resolvers)
.then( res => {
    console.log(res.data);
});
 **/