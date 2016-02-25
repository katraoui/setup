'use strict'

var fs= require('fs');
var cp = require('child_process');
// var interfaces = require('./interfaces');
module.exports = function(){

	var obj = {
		network: {},
		hostname: {},
		hosts: {},
		crontab: {},
		clock: {},
		path: {},
		system : {}
	};


//----------------------------------------------------------------------------

	obj.path.HOSTNAME = '/etc/hostname';
	obj.path.HOSTS = '/etc/hosts';
	obj.path.INTERFACES_FILE = '/etc/network/interfaces'
	// Hostname
	obj.hostname.save = function(hostname,outFile){
		fs.writeFileSync(outFile || obj.path.HOSTNAME, hostname);
	}
//----------------------------------------------------------------------------
	// Hosts
	obj.hosts.save = function(config,outFile){
		fs.writeFileSync(outFile || obj.path.HOSTS, config);
	}

	obj.hosts.config = function(hosts) {

		var output =[];
		var hostName = fs.readFileSync(obj.path.HOSTNAME,'UTF-8').trim();

		output.push('127.0.0.1	localhost');
		output.push('127.0.0.1	'+hostName);
		output.push('');

		for (ip in hosts)
			output.push(ip+'  '+hosts[ip]);

		return output.join("\n");
	}


//----------------------------------------------------------------------------


	// Date/Time
	obj.clock.set = function(time) {
		cp.exec('date -s "'+time+'" ; hwclock --systohc;', cb);
	}



//----------------------------------------------------------------------------
	// Networking
	obj.network.restart = function(cb){
		cp.exec('/etc/init.d/networking restart', cb);
	}
	obj.network.save = function(config,outFile){
		fs.writeFileSync(outFile || obj.path.INTERFACES_FILE, config);
	}
	obj.network.config = function(config){

		var output= [];

		output.push('auto lo')
		output.push('iface lo inet loopback')
		console.log(config);

		for (var device in config)
		{
			output.push('')

			if (config[device].auto)
				output.push('auto '+device)

			if (config[device].dhcp == true)
				output.push('iface '+device+' inet dhcp')
			else
				output.push('iface '+device+' inet static')

			if (config[device].wireless)
			{
				if (config[device].wireless.ssid)
					output.push('  wpa-ssid '+config[device].wireless.ssid)

				if (config[device].wireless.psk)
					output.push('  wpa-psk '+config[device].wireless.psk)
			}

			if (config[device].ipv4)
			{
				if (config[device].ipv4.address)
					output.push('address '+config[device].ipv4.address)

				if (config[device].ipv4.netmask)
					output.push('netmask '+config[device].ipv4.netmask)

				if (config[device].ipv4.gateway)
					output.push('gateway '+config[device].ipv4.gateway)

				if (config[device].ipv4.dns)
					output.push('dns-nameservers '+config[device].ipv4.dns)
			}

		}

		return output.join("\n");
	}

	// obj.network.get=function(cb){
	//
	// }
	//





//----------------------------------------------------------------------------

	// SYSTEM

	obj.system.reboot= function(cb){
		cp.exec('shutdown -r now', cb);
	}

	obj.system.ntpdate=function(cb){
		cp.exec('ntpdate-debian',cb);
	}

	obj.system.uuid = function(cb){
		cp.exec('cat /sys/class/dmi/id/product_uuid',cb);
	}
	obj.system.boardSerial=function(cb){
		cp.exec('cat /sys/class/dmi/id/board_serial', cb);
	}

	obj.system.brightness_inc= function(cb){
		var data = fs.readFileSync('/sys/class/backlight/acpi_video0/brightness','utf8');
		var value = parseInt(data);
		if(value <15){
			value++;
		}
		cp.exec('tee /sys/class/backlight/acpi_video0/brightness <<< '+ value, cb);
	}
	obj.system.brightness_dec= function(cb){
		var data = fs.readFileSync('/sys/class/backlight/acpi_video0/brightness');
		var value = parseInt(data,10);
		if(value >0)
			value--;
		cp.exec('tee /sys/class/backlight/acpi_video0/brightness <<< '+ value, cb);
	}
	obj.system.sound_inc= function(cb){
		cp.exec('pactl set-sink-volume 0 +15%', cb);
	}
	obj.system.sound_dec= function(cb){
		cp.exec('pactl set-sink-volume 0 -15%', cb);
	}
	// obj.system.sound_inc= function(cb){
	// 	cp.exec('amixer -q sset Master 5%+', cb);
	// }
	// obj.system.sound_dec= function(cb){
	// 	cp.exec('amixer -q sset Master 5%-', cb);
	// }
	obj.system.sound_get=function(cb){
		console.log('volume : ', _state.volume);

		cp.exec("pactl list sinks | grep  Volume: | awk '$1 ~ /Volume/ { print $5,$12 }'",cb);
	}
	//mute/unmute
	obj.system.sound_mute_toggle= function(){
		cp.exec('pactl set-sink-mute 0 toggle', cb);
	}
	// obj.system.sound_mute_toggle= function(){
	// 	cp.exec('amixer -q sset Master toggle', cb);
	// }


	return obj;
}
