const NodeGeoCoder = require('node-geocoder')

const options = {
    provider : 'mapquest',
    httpAdapter : 'https',
    apiKey : '8QdqPEmGrTcmfNlNihVbAgMGKUaNgOw0',
    formatter : null
}

const geocoder =NodeGeoCoder(options)
module.exports  = geocoder