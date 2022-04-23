import "./App.css";

import { Dropdown } from "./components/Dropdown/Dropdown";
import { useGetData } from "./hooks/useGetData";

function App() {
    const { data } = useGetData({ url: "https://swapi.dev/api/people" });

    if (data === undefined) return <div>Loading...</div>;
    if (data === null) return <div>Error occurred while fetching data, please try again.</div>;

    return (
        <div className="App">
            <Dropdown options={data.results} />
        </div>
    );
}

export default App;
