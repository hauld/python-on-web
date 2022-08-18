import { useEffect, useRef, useState, useCallback } from 'react';
import Workbook from '../components/Workbook';
import CircularProgress from '@mui/material/CircularProgress';
export default function Index() {
  const workerRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const loaded = w =>
    new Promise(r => w.addEventListener("message", r, { once: true }));
  useEffect(() => {
    workerRef.current = new Worker(new URL('../utils/worker.js', import.meta.url))
    //workerRef.current.onmessage = (evt) =>
      //alert(`WebWorker Response => ${evt.data}`)
    workerRef.current.addEventListener("message", (msg) => {
      setIsLoaded(true);
      console.log(msg);
    }, { once: true });
    return () => {
      workerRef.current.terminate()
    }
  }, [])

  return (
    isLoaded === false ? 
    <div>
      Loading python runner ... 
      <br/>
      <CircularProgress />
    </div> 
    :
    <div>
      <Workbook worker={workerRef.current}/>
    </div>
  )
}
