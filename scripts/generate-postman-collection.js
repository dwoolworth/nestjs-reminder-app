const fs = require('fs');
const converter = require('openapi-to-postmanv2');
 
const swaggerFile = './swagger/swagger.json';
const postmanFile = './postman/Reminders.postman_collection.json';
 
// Read Swagger JSON
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
 
converter.convert({ type: 'json', data: JSON.parse(swaggerData) }, {}, (err, result) => {
  if (err) {
    console.error('Error converting Swagger to Postman:', err);
  } else {
    fs.writeFileSync(postmanFile, JSON.stringify(result.output[0].data, null, 2));
    console.log(`Postman collection saved to ${postmanFile}`);
  }
});