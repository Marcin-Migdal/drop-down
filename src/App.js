import { useEffect, useState } from "react";
import axios from "axios";

import { CustomDropdown } from "./components/CustomDropdown/CustomDropdown";

import "./App.css";

const mapToLabelValue = (array) => array.map((r) => ({ label: r.name, value: r.url }));

const url = "https://swapi.dev/api/people";
function App() {
    const [data, setData] = useState(undefined);
    const [selected, setSelected] = useState(undefined);

    const getData = async (page = 1, search) => {
        try {
            let oldOptions = [];
            const newUrl = `${url}/?page=${page}${!!search ? "&search=" + search : ""}`;

            if (newUrl == data?.meta.currentUrl) return;
            else if (page > 1) oldOptions = data.options;
            else setData(undefined);

            const response = await axios.get(newUrl);
            const { results, ...rest } = response.data;

            setData({ options: [...oldOptions, ...mapToLabelValue(results)], meta: { ...rest, page, currentUrl: newUrl } });
        } catch (e) {
            setData(null);
            console.log(e);
        }
    };

    return (
        <div className="App">
            <CustomDropdown
                placeholder="Choose a character..."
                filterPlaceholder="Filter characters..."
                selected={selected}
                handleChangeSelected={(selected) => setSelected(selected)}
                options={data?.options}
                meta={data?.meta}
                handleSearch={getData}
            />
        </div>
    );
}

export default App;
