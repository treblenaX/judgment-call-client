import '../styles/TextArea.scss';
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function TextAreaModule(props) {
  const label = props.label ? props.label : 'Response';
  const placeholder = props.placeholder;
  const readyState = props.readyState;
  const submitCallback = props.submitCallback ? props.submitCallback : () => {};

  // a random id to assign this textarea to
  const id = 'textarea-' + Math.random().toString(36).substr(2, 9);

  const onSubmitClicked = (e) => {
    const data = document.getElementById(id).value;
    submitCallback(data);
  }

  return (
    <Stack spacing={2} direction='column'>
      <TextField
          id={id}
          label={label}
          placeholder={placeholder}
          multiline
          minRows={3}
          maxRows={3}
        //   value={value}
        //   onChange={handleChange}
      />
      {
        (!readyState) 
        ? <Button 
            variant="contained"
            color="secondary"
            onClick={onSubmitClicked}>
            Submit
          </Button>
        : <Button 
            variant="primary"
            color="secondary"
            onClick={onSubmitClicked}>
            Cancel
          </Button>
      }
    </Stack>
  )
}

export default TextAreaModule;