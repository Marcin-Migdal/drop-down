import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //ico

import { CustomDropdown } from "./components/CustomDropdown/CustomDropdown";

import "./App.css";
import { useState } from "react";

function App() {
    const [value, setValue] = useState(undefined);
    value && console.log(value);
    return (
        <div className="App">
            <CustomDropdown
                value={value}
                name="dropdown"
                url="https://swapi.dev/api/people"
                handleSelect={(selected) => setValue(selected.name)}
                // minFilterChar={3}
            />
        </div>
    );
}

export default App;
