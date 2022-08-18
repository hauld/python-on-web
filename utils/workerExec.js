//import Worker from "worker-loader!./webworker.js"

export function run(worker, script, context, onSuccess, onError) {
  worker.onerror = onError;
  worker.onmessage = (e) => onSuccess(e.data);
  worker.postMessage({
    ...context,
    python: script,
  });
}

// Transform the run (callback) form to a more modern async form.
// This is what allows to write:
//    const {results, error} = await asyncRun(script, context);
// Instead of:
//    run(script, context, successCallback, errorCallback);
export function asyncRun(worker, script, context) {
  return new Promise(function (onSuccess, onError) {
    run(worker, script, context, onSuccess, onError);
  });
}