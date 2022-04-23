import { useEffect, useState } from "react";
import axios from "axios";

export const useGetData = ({ url }) => {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get(url); 
            setData(response.data.results);
        } catch (e) {
            console.log(e);
        }
    };

    return { data, setData };
};
