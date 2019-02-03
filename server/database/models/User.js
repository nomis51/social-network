const validator = require('../schemaValidator');
const uniqid = require('uniqid');
//const bcrypt = require('bcrypt');

const User = {
    schema: {
        _id: {
            type: 'string',
            default: () => uniqid()
        },
        firstName: {
            type: 'string',
            required: true,
            validation: (value) => {
                return value.length >= 2 && value.length <= 30 && new RegExp(/[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ -]{2,30}/).test(value);
            }
        },
        lastName: {
            type: 'string',
            required: true,
            validation: (value) => {
                return value.length >= 2 && value.length <= 30 && new RegExp(/[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ -]{2,30}/).test(value);
            }
        },
        email: {
            type: 'string',
            required: true,
            validation: (value) => {
                return value.length <= 40 && new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/).test(value);
            }
        },
        password: {
            type: 'string',
            required: true,
            validation: (value) => {
                if (value.length < 9 || value.length > 40) {
                    return false;
                }

                const regexes = [/[a-z]/, /[A-Z]/, /\d/, /\W/, /.{9,40}/];
                for (let r of regexes) {
                    if (!new RegExp(r).test(value)) {
                        return false
                    }
                }
                return true;
            }
        },
        isDeleted: {
            type: 'boolean',
            default: () => false
        },
        creationTime: {
            type: 'string',
            default: () => (new Date).toISOString()
        }
    },
    validate: (user) => {
        return validator(user, User.schema);
    },
    create: (firstName, lastName, email, password) => {
        const user = {
            firstName,
            lastName,
            email,
            password
        };

        let validatedUser = User.validate(user);
        if (validatedUser) {
            validatedUser.password = User.hashPassword(validatedUser.password);
        }

        return validatedUser ? validatedUser : null;
    },
    hashPassword: (plain) => {
        return plain + 'yo';
        //return bcrypt.hashSync(plain, 12);
    },
    comparePassword: (plain, encrypted) => {
        return (plain + 'yo') == encrypted;
        //return bcrypt.compareSync(plain, encrypted);
    }
};

module.exports = User;