import { ProgressSpinner } from "primereact/progressspinner";
import { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";

import { useDebounce } from "../../hooks/useDebounce";
import "./CustomDropdown.css";

// TODO! infinite scroll 
export const CustomDropdown = ({ value, name, minFilterChar, placeholder, url, handleSelect }) => {
    const ref = useRef();

    const [data, setData] = useState(undefined);
    const [filter, setFilter] = useState("");

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [shouldDebounce, setShouldDebounce] = useState(true);

    const debounceFilter = useDebounce(filter, 500, shouldDebounce);

    useEffect(() => {
        if (dropdownOpen && minFilterChar === undefined) {
            getData(1, !!debounceFilter.trim().length > 0 ? debounceFilter : undefined);
        }
    }, [dropdownOpen]);

    useEffect(() => {
        const handleOpenDropdown = () => {
            if (!!minFilterChar) {
                if (debounceFilter.trim().length >= minFilterChar) {
                    !dropdownOpen && openDropdown();
                    getData(1, debounceFilter);
                } else if (dropdownOpen) closeDropdown();
            } else {
                if (debounceFilter.trim().length > 0) getData(1, debounceFilter);
                else if (data !== undefined) getData();
            }
        };

        handleOpenDropdown();
    }, [debounceFilter]);

    const getData = async (page = 1, search = undefined) => {
        try {
            const oldOptions = data?.options && page !== 1 ? [...data.options] : [];
            !!data && setData(undefined);
            const params = search ? { params: { search: search } } : {};

            const response = await axios.get(`${url}/?page=${page}`, params);
            const { results: newOptions, ...rest } = response.data;

            setData({ options: [...oldOptions, ...newOptions], meta: rest });
        } catch (e) {
            setData(null);
            console.log(e);
        }
    };

    const openDropdown = () => setDropdownOpen(true);

    const closeDropdown = () => {
        setDropdownOpen(false);
        setData(undefined);
    };

    const innerHandleSelect = (o) => {
        handleSelect(o);
        setShouldDebounce(false);
        setFilter(o.name);
        closeDropdown();
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "Escape":
                closeDropdown();
                break;
            case "Enter":
                if (data?.options.length === 1) {
                    ref?.current && ref?.current.blur();
                    innerHandleSelect(data?.options[0]);
                }
                break;
            default:
                break;
        }
    };

    const handleFilterChange = (e) => {
        !shouldDebounce && setShouldDebounce(true);
        setFilter(e.target.value);
    };

    return (
        <div className="dropdown-container">
            <InputText
                ref={ref}
                name={name}
                value={filter}
                autoComplete="off"
                id="filter-text-input"
                placeholder={placeholder}
                onChange={handleFilterChange}
                onFocus={() => !minFilterChar && openDropdown()}
                onKeyDown={handleKeyDown}
            />
            {dropdownOpen && (
                <DropdownList value={value} options={data?.options} closeDropdown={closeDropdown} handleSelect={innerHandleSelect} />
            )}
        </div>
    );
};

const DropdownList = ({ value, options, handleSelect, closeDropdown }) => {
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!!options && ref && !ref.current.contains(e.target) && e.target.id !== "filter-text-input") closeDropdown();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown, options]);

    if (options === null) return <div className="dropdown error">Error occurred while fetching data</div>;
    if (options === undefined)
        return (
            <div className="dropdown refresh">
                <ProgressSpinner className="progress-spinner" />
            </div>
        );
    if (options.length === 0) return <div className="dropdown no-data">No data to display</div>;

    return (
        <ul className="dropdown" ref={ref}>
            {options.map((o) => (
                <li className={value === o.name ? "selected" : ""} onClick={() => handleSelect(o)} key={o.name}>
                    <p>{o.name}</p>
                </li>
            ))}
        </ul>
    );
};
