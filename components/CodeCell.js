import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CodeEditor from './CodeEditor';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import HourglassTopOutlinedIcon from '@mui/icons-material/HourglassTopOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {asyncRun, fetch_json} from "../utils/workerExec";
import moment from 'moment';
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
function CodeCell(props){
  const {
    iStack,
    iSrc,
    cellId,
    iRun,
    iOutput,
    iLastRun,
    onChange,
    onAdd,
    onDelete,
    onStop,
    execCode,
    context,
    hookEvent,
    worker
  }
  = props;
  const [isOutputDisplay, setIsOutputDisplay] = React.useState(false);
  const [output, setOutput] = React.useState(iOutput || null);
  const [log, setLog] = React.useState();
  const [isSrcDisplay, setIsSrcDisplay] = React.useState(true);
  const [src, setSrc] = React.useState(iSrc||"");
  const [stack, setStack] = React.useState(iStack || "python");
  const [isRunning, setIsRunning] = React.useState(iRun||false);
  const [isStopping, setIsStopping] = React.useState(false);
  const [lastRun, setLastRun] = React.useState(iLastRun || null);
  const codeEditorRef = React.useRef();

  const handleExpandClick = () => {
    setIsOutputDisplay(!isOutputDisplay);
  };

  const srcChange = React.useCallback(() => {
    setSrc(codeEditorRef.current.getValue());
    onChange(cellId, codeEditorRef.current.getValue());
  }, [setSrc]);

  const stop = React.useCallback(async () => {
    //to-do
  })
  const runCell = React.useCallback(async () => {
    setIsRunning(true);
    setLastRun(Date.now());
    const {results, error} = await asyncRun(worker, src, context);
    if(error !== undefined){
      setOutput(error);
      setLog(error);
    }else{
      if(typeof results === 'object' && results !== null){
        if(results.event !== undefined){
          //hookEvent(results);
          setOutput('Event triggered!');
        }else{
          setOutput(JSON.stringify(results));
        }
      }else{
        setOutput(results);
      }
    }
    setIsOutputDisplay(true);
    setIsRunning(false);
  },[src, setIsRunning, setLastRun, setOutput, setIsOutputDisplay]);
  
  React.useEffect(() => {
    setIsRunning(iRun);
    setOutput(iOutput);
    setLastRun(iLastRun);
  }, [iRun, setIsRunning, iOutput, setOutput, iLastRun, setLastRun]);
  return (
    <div>
    <Card >
      <CardHeader
        sx={{height: '20px', padding: '2px 5px', margin: '2px 5px'}}
        avatar={
          <Avatar sx={{height: '15px', width: '15px', bgcolor: blue[500] }} aria-label={stack}>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" sx={{height: '20px', width: '20px' }}>
            <MoreVertIcon sx={{height: '20px', width: '20px' }}/>
          </IconButton>
        }
        subheader={(lastRun===null)?'Stack '+stack+'':(isRunning)?'Stack '+stack+' | Executing':'Stack '+stack+' | Last run ' + moment(lastRun).fromNow()}
      />
      <CardContent  sx={{padding: '2px 5px', margin: '2px 5px'}}>
        <CodeEditor
          ref={codeEditorRef}
          initialValue={src}
          onChange={srcChange}
        />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={() => {onAdd(cellId)}} aria-label="Share"  sx={{height: '20px', width: '20px' }}>
          <AddCircleOutlineOutlinedIcon  sx={{height: '20px', width: '20px' }} />
        </IconButton>
        <IconButton onClick={runCell} disabled={isRunning} aria-label="Run"  sx={{height: '20px', width: '20px' }}>
          {(isRunning)
            ? <HourglassTopOutlinedIcon  sx={{height: '20px', width: '20px' }} />
            : <PlayCircleOutlinedIcon  sx={{height: '20px', width: '20px' }} />
          }
        </IconButton>
        <IconButton  onClick={stop} disabled={!isRunning || isStopping} aria-label="Stop"  sx={{height: '20px', width: '20px' }}>
          {(isStopping)
            ? <MultipleStopOutlinedIcon  sx={{height: '20px', width: '20px' }} />
            : <StopCircleOutlinedIcon  sx={{height: '20px', width: '20px' }} />
          }
        </IconButton>
        <IconButton disabled={true} aria-label="Share"  sx={{height: '20px', width: '20px' }}>
          <ShareIcon  sx={{height: '20px', width: '20px' }} />
        </IconButton>
        <IconButton  onClick={() => {onDelete(cellId)}} disabled={isRunning || isStopping}  aria-label="Delete"  sx={{height: '20px', width: '20px' }}>
          <DeleteOutlineOutlinedIcon  sx={{height: '20px', width: '20px' }} />
        </IconButton>
        <ExpandMore  sx={{height: '20px', width: '20px' }}
          expand={isOutputDisplay}
          onClick={handleExpandClick}
          aria-expanded={isOutputDisplay}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={isOutputDisplay} timeout="auto" unmountOnExit>
        <CardContent>
          {output}
        </CardContent>
      </Collapse>
    </Card>
    </div>
  );
}

export default CodeCell;