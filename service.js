var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Metalurgia Api',
  description: 'Servicio de Api.',
  script: 'C:\\wamp64\\www\\api-metalurgia\\server\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

svc.install();