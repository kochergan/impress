'use strict';

const jstp = require('metarhia-jstp');

let port, tls;
if (process.argv.includes('--tls')) {
  port = 4000;
  tls = true;
} else {
  port = 3000;
  tls = false;
}

const client = jstp.tcp.createClient({
  host: '127.0.0.1',
  port,
  secure: tls
});

client.connect((error, connection) => {
  if (error) throw error;
  console.log('connected');
  connection.handshake('example', null, null, (err, session) => {
    if (err) throw err;
    console.log('handshake done, sid =', session);
    connection.inspectInterface('interfaceName', runTests);
  });
});

function runTests(err, interfaceName) {
  if (err) throw err;

  interfaceName.on('eventName', (args) => {
    console.log('Got event, data:', args);
  });

  interfaceName.methodName(1, 2, 3, (err, res) => {
    if (err) throw err;
    console.log('result1 received');
    console.dir(res);
  });

  interfaceName.sendEvent((err) => {
    if (err) throw err;
  });

  interfaceName.methodName(4, 5, 6, (err, res) => {
    if (err) throw err;
    console.log('result2 received');
    console.dir(res);
    interfaceName.methodName(7, 8, 9, (err, res) => {
      if (err) throw err;
      console.log('result3 received');
      console.dir(res);
      process.exit(0);
    });
  });
}

/*
 *  // Define Data Source
 *
 *  let data = [
 *    ['Marcus Aurelius','212-04-26','Rome'],
 *    ['Victor Glushkov','1923-08-24','Rostov on Don'],
 *    ['Ibn Arabi','1165-11-16','Murcia'],
 *    ['Mao Zedong','1893-12-26','Shaoshan'],
 *    ['Rene Descartes','1596-03-31','La Haye en Touraine']
 *  ];
 *
 *  // Define Person prototype with calculating field
 *
 *  let metadata = {
 *    name: 'string',
 *    birth: 'Date',
 *    city: 'string',
 *    age: () => {
 *      let difference = new Date() - this.birth;
 *      return Math.floor(difference / 31536000000);
 *    }
 *  };
 *
 *  // Define Query
 *
 *  let query = (person) => (
 *    person.name !== '' &&
 *    person.age > 18 &&
 *    person.city === 'Rome'
 *  );
 *
 *  // Build prototype and assign to array elements
 *
 *  api.jstp.assignMetadata(data, metadata);
 *
 *  // Filter Data using Query
 *
 *  let res = data.filter(query);
 *  console.dir(res);
 */
