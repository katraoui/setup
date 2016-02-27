var setup = require('../setup')();
// console.log(setup);

// var X = {
// 	wlan0: {
// 		auto: true, // start at Boot
// 		dhcp: true, // Use DHCP
// 		wireless: {
// 			ssid: 'myWirelessName', // Wireless SSID
// 			psk: 'mySuperPassword', // Password
// 		}
// 	},
// 	eth0: {
// 		auto: true,
// 		ipv4: {
// 			address: '192.168.1.20',
// 			netmask: '255.255.255.0',
// 			gateway: '192.168.1.1',
// 			dns: '8.8.8.8'
// 		}
// 	}
// };
//
var X={ eth0:
   {
		 auto:true,
		 dhcp:false,
		 mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '5c:26:0a:67:ea:e1',
		 ipv4:
      { address: '192.168.2.5',
        prefix: '24',
        netmask: '255.255.255.0',
        gateway: '192.168.2.1',
				dns: ['8.8.8.8','8.8.4.4']
			 }
	  },
  wlan0:
   {
		 auto: true,
		 dhcp: true,
		 mtu: '1500',
     state: 'UP',
     group: 'default',
     proto: 'ether',
     MAC: 'a0:88:b4:65:bd:20',
		 wireless: {
			 ssid: 'myWirelessName', // Wireless SSID
			 psk: 'mySuperPassword', // Password
		 }
		},
  vmnet1:
   {
		 auto:true,
		 dhcp:true,
		 mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '00:50:56:c0:00:01' },
  vmnet8:
   { mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '00:50:56:c0:00:08' },
  virbr0:
   {
		 auto:true,
		 dhcp:true,
		 mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '52:54:00:47:35:5d',
  	},
  'virbr0-nic':
   {
		 auto:true,
		 dhcp:false,
		 mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '52:54:00:47:35:5d' },
  vboxnet0:
   {
		 auto:true,
		 dhcp:false,
		 mtu: '1500',
     state: 'DOWN',
     group: 'default',
     proto: 'ether',
     MAC: '0a:00:27:00:00:00' } }
;


// var config = setup.network.config(X);

// console.log(config);
// setup.network.get(function(err, data){
// 	console.log('data : ', data);
// });
setup.path.NETWORK_CONFIG_FILE='./netconfig.json';//source 
setup.path.NETWORK_CONFIG_FILE_CURRENT='./netconfig_current.json';
setup.path.INTERFACES_FILE='./interfaces.txt';

setup.network.reset();
setup.network.setConfig(X);
setup.network.apply();


var c = setup.network.getConfig(function(err,data){
	console.log('getConfig data : ', data);
});

console.log('c : ' , c);
// setup.network.save(config);



// setup.hostname.save('hello.com', './hostname.txt');


// var hosts = setup.hosts.config({
// 	'10.0.0.1':'server1.example.com',
// 	'10.0.0.2':'server2.example.com'
// });
//
// setup.hosts.save(hosts, './hosts.txt');
//
