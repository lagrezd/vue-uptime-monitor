//read only api keys
export var apiKeys = [
    '' // keys
];

export function getApiRequest(key) {
   return 'https://api.uptimerobot.com/getMonitors?apiKey='+ key +'&responseTimes=1&responseTimesAverage=60&customUptimeRatio=1-7-30&format=json&noJsonCallback=1';
}

export function getStatusFromCode(code) {
    if(code == 0) return "paused";
    if(code == 1) return "not available";
    if(code == 2) return "up";
    if(code == 8) return "seems down";
    if(code == 9) return "down";
}
