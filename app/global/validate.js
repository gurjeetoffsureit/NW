import validation from '../constants/AppData';

// var validatejs = require("validate.js");

export default function validate(fieldName, value) {

    var formValues = {}
    formValues[fieldName] = value

    var formFields = {}
    formFields[fieldName] = validation[value]

    // const result = validatejs(formValues, formFields)

    if(result) {
        return result[field][0]
    }

    return null
}