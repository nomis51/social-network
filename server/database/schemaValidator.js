module.exports = (obj, schema) => {
    let validatedObj = obj;
    const objKeys = Object.keys(validatedObj);

    for (let prop of Object.keys(schema)) {
        if (schema[prop].required && objKeys.indexOf(prop) == -1) {
            return false;
        }

        const defaultValue = schema[prop].default;
        if (defaultValue && !Boolean(validatedObj[prop])) {
            validatedObj[prop] = defaultValue();
        }

        // TODO: if type is String, validate injection with injectionValidator
        if (schema[prop].type != (typeof validatedObj[prop]) && schema[prop].required) {
            return false;
        }

        if (schema[prop].validation && !schema[prop].validation(validatedObj[prop])) {
            return false;
        }
    }

    return validatedObj;
}