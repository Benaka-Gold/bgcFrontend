import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Input, List, ListItem, ListItemText, Paper, styled } from '@mui/material';
import {ListItemSecondaryAction} from '@mui/material';

const StyledInput = styled(Input)(({ theme }) => ({
  display: 'none',
}));

function FileUpload() {
  const [fileInputs, setFileInputs] = useState([{ id: Date.now(), file: null }]);

  const handleAddClick = () => {
    // Only add a new input if the last one has a file
    if (fileInputs[fileInputs.length - 1].file) {
      setFileInputs([...fileInputs, { id: Date.now(), file: null }]);
    } else {
      alert('Please upload the previous file first.');
    }
  };

  const handleFileChange = (event, id) => {
    const newFileInputs = fileInputs.map((input) => {
      if (input.id === id) {
        return { ...input, file: event.target.files[0] };
      }
      return input;
    });
    setFileInputs(newFileInputs);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <List>
        {fileInputs.map((input, index) => (
          <ListItem key={input.id} disableGutters>
            <label htmlFor={`file-upload-${input.id}`}>
              <StyledInput
                id={`file-upload-${input.id}`}
                type="file"
                onChange={(event) => handleFileChange(event, input.id)}
              />
              <ListItemText
                primary={input.file ? input.file.name : 'No file chosen'}
                secondary={input.file ? 'Click to change the file' : 'Click to choose a file'}
                sx={{ cursor: 'pointer' }}
              />
            </label>
            <ListItemSecondaryAction>
              {index === fileInputs.length - 1 && (
                <IconButton edge="end" onClick={handleAddClick} disabled={!input.file}>
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default FileUpload;
