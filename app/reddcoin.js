const { spawn } = require('child_process');

let reddcoind = null;

function execute(command, json = true, args = []) {

	args.unshift(command);

	return new Promise((resolve, reject) => {

		let data = "";
		let execute = spawn('reddcoin-cli', args);

		execute.stderr.on('data', () => {
			reject(false);
		});
		execute.stdout.on('data', (response) => {

			if(Buffer.isBuffer(response)) {
				data = response.toString();
			} else {
				data = response;
			}
			
		});
		execute.on('exit', () => {
			data = data.trim();

			if(json) {
				try {
					data = JSON.parse(data);
				} catch(error) {}
			}

			resolve(data);

		});

	});

}

function ping() {

	return new Promise((resolve, reject) => {

		let execute = spawn('reddcoin-cli', [ 'ping' ]);

		execute.stdout.on('data', reject);
		execute.stderr.on('data', reject);
		execute.on('exit', resolve);

	});
}

function launch() {
	reddcoind = spawn('reddcoind');
}

module.exports = {
	"launch": launch,
	"cli": execute,
	"ping": ping
};