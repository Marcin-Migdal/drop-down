import { useEffect, useState } from "react";
import axios from "axios";

export const useGetData = ({url, id, infiniteScroll = false}) => {
    const [data, setData] = useState(undefined);

    useEffect(() => {
        !!url ? getData() : setData(null);
    }, [url, id]);

    const getData = async () => {
        try {
            let responseData;

            if (!!id) {
                const response = await axios.get(`${url}/${id}`);
                responseData = response.data;
            } else {
                const response = await axios.get(url);
                const resData = response.data;

                if (!infiniteScroll) responseData = resData;
                else {
                    if (!!data) responseData = { ...resData, results: [...data.results, resData.results] };
                    else responseData = resData;
                }
            } 

            setData(responseData);
        } catch (e) {
            setData(null);
            console.log(e);
        }
    };

    return { data, setData, getData };
};
