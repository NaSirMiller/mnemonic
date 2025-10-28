import { useState } from 'react';
import TextField from '@mui/material/TextField';
import "./FormComponents.css";

function ShortTextInput( { valueParent } ) {
    const [ value, setValue ] = useState( valueParent );
    return (
        <div>
            <TextField
                required
                variant="outlined"
                label={ valueParent }
                name={ valueParent }
                className="short-input"
                defaultValue={ valueParent }
                value={ value }
                onChange={ (e) => setValue( e.target.value ) }
            />
        </div>
    );
}

export default ShortTextInput;