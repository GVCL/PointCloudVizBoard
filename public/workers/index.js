var pointFilterWorker = null;
var analyticsWorker = null;
var realtimeLoader = null;
var realtimeLoaderClassify = null;
var analyticsWorkerCLCPCS = null;
if (window.Worker) 
{
	analyticsWorkerCLCPCS = new Worker("./workers/analytics_cl_cp_cs.js");
	analyticsWorker = new Worker("./workers/analytics_class_distribution.js");
	realtimeLoader = new Worker("./workers/realtimeloader.js");
	realtimeLoaderClassify = new Worker("./workers/realtimeloaderClassify.js");
} 
else 
{
	console.log('Your browser doesn\'t support web workers.')
}