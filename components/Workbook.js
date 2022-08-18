import React, { useState, useRef, useCallback } from "react";
import CodeCell from "./CodeCell";
import {
  IconButton,
  Toolbar,
  Divider,
  Typography,
  withStyles
} from "@material-ui/core";
import PropTypes from "prop-types";
import MarkdownView from "./MarkdownView";
import SpeedDial from '@mui/material/SpeedDial';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import Tooltip from '@mui/material/Tooltip';

import {asyncRun, fetch_json} from "../utils/workerExec";
//import CloseIcon from "@material-ui/icons/Close";
//import { nextDay } from "date-fns";

import LinearProgress from '@mui/material/LinearProgress';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];


const drawerWidth = 600;

const styles = {
  toolbar: {
    minWidth: drawerWidth
  }
};

function Workbook(props) {
  const {classes, onClose,  open, loc, execCode, iBook, hookEvent, context, worker}
  = props;
  const example = [
    {
      cellId: 0,
      stack: 'python',
      src: '1+1',
      lastRun: null,
      output: null,
      log: null,
      isRunning: false
    }
  ];
  const [book, setBook] = useState(iBook || example);
  const [refresh, setRefresh] = useState(false);
  const [direction, setDirection] = React.useState('left');
  const [inProgress, setInProgress] = React.useState(false);
  const [progress, setProgress] = React.useState(10);
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  }
  const onAdd = useCallback((cellId) => {
    let cell = 
      {
        cellId: getRandomInt(1000),
        stack: 'python',
        src: 'import pandas as pd',
        lastRun: null,
        output: null,
        log: null,
        isRunning: false
      };
    let pos = book.findIndex(cell => cell.cellId === cellId);
    pos++;
    book.splice(pos, 0, cell);
    setBook(book);
    setRefresh(!refresh);
  },[book, setBook, refresh, setRefresh]);
  const onChangeStack = useCallback(() => {
  });
  const onChange = useCallback((cellId, src) => {
    let pos = book.findIndex(cell => cell.cellId === cellId);
    book[pos].src = src;
    console.log(cellId, src);
    setBook(book);
  },[book,setBook]);
  const onPlay = useCallback(async () => {
    let generatedResponse = []
    let progress = 0;
    setInProgress(true);
    for(const [index, cell] of book.entries()) {
      try {
        // here candidate data is inserted into  
        //await execCode(src);
        book[index].isRunning = true;
        progress = ( index + 1 ) / book.length * 100 ;
        setProgress(progress);
        //let context = {};
        let {results, error} = await asyncRun(worker, cell.src, context);
        if(error !== undefined){
          //console.log('click save button errors：', error);
          console.log('error'+ error);
          book[index].log = error;
        }else{
          // and response need to be added into final response array 
          generatedResponse.push(results);
          book[index].output = results;
        }
        book[index].lastRun = Date.now();
        book[index].isRunning = false;
      } catch (error) {
        console.log('error'+ error);
      }
    }
    setBook(book);
    setRefresh(!refresh);
    setProgress(100);
    setTimeout(() => {  setInProgress(false); }, 3000);
    console.log('complete all', generatedResponse);
  },[book, setBook, refresh, setRefresh, setProgress, setInProgress]);

  const onDelete = useCallback((cellId) => {
    let pos = book.findIndex(cell => cell.cellId === cellId);
    delete book[pos];
    setBook(book);
    setRefresh(!refresh);
  },[book, setBook, refresh, setRefresh]);
  return (
    <div anchor="right" open={open} variant="temporary" onClose={onClose}>
      <Toolbar disableGutters className={classes.toolbar}>
        <Tooltip title="Run all">
          <IconButton
            onClick={() => onPlay()}
            color="primary"
            aria-label="Play List"
          >
            <PlaylistPlayIcon />
          </IconButton>
        </Tooltip>
        <Box
          pl={3}
          pr={3}
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography variant="h6">Python Workbook</Typography>
        </Box>
      </Toolbar>
      {inProgress && <Box sx={{ width: '100%' }}>
        <LinearProgressWithLabel value={progress} />
      </Box>}
      <Divider />
      { 
        book.map(function(cell, index){
            return <CodeCell
            iSrc={cell.src}
            iStack={cell.stack}
            key={index}
            cellId={cell.cellId}
            iRun={cell.isRunning}
            iOutput={cell.output}
            iLastRun={cell.lastRun}
            onChangeStack={onChangeStack}
            onChange={onChange}
            onAdd={onAdd}
            onDelete={onDelete}
            execCode={execCode}
            hookEvent={hookEvent}
            context={context}
            worker={worker}
          />
        })
      } 
    </div>
  );
}

Workbook.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Workbook);