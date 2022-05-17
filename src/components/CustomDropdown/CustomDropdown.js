import { useEffect, useRef, useState } from "react";
import { Oval } from "@agney/react-loading";
import { IoMdClose } from "react-icons/io";
import { PropTypes } from "prop-types";

import { useDebounce } from "../../hooks/useDebounce";

import "./CustomDropdown.css";

export const CustomDropdown = ({
    selected,
    handleChangeSelected,
    options,
    handleSearch,
    placeholder = "Choose...",
    filterPlaceholder = "Filter...",
    meta,
    clearable = true,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openDropdown = async () => {
        setIsLoading(true);
        setDropdownOpen(true);
        await handleSearch(1);
        setIsLoading(false);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const handleClearSelected = () => handleChangeSelected(undefined);

    const handleToggleIsLoading = (_isLoading) => setIsLoading(_isLoading);
    return (
        <div className="dropdown-container">
            <input
                placeholder={placeholder}
                className={`dropdown-input ${dropdownOpen ? "dropdown-open" : ""}`}
                id="filter-text-input"
                value={selected?.label || ""}
                readOnly
                onFocus={openDropdown}
            />
            {dropdownOpen && (
                <DropdownList
                    selected={selected}
                    options={options}
                    closeDropdown={closeDropdown}
                    handleChangeSelected={handleChangeSelected}
                    handleSearch={handleSearch}
                    filterPlaceholder={filterPlaceholder}
                    meta={meta}
                    isLoading={isLoading}
                    handleToggleIsLoading={handleToggleIsLoading}
                />
            )}
            {clearable && selected && <IoMdClose className="close-icon" onClick={handleClearSelected} />}
        </div>
    );
};

const DropdownList = ({
    selected,
    options,
    closeDropdown,
    handleChangeSelected,
    handleSearch,
    filterPlaceholder,
    meta,
    isLoading,
    handleToggleIsLoading,
}) => {
    const dropDownRef = useRef();
    const scrollRef = useRef();

    const [filter, setFilter] = useState("");
    const [omittedInit, setOmittedInit] = useState(false);

    const debounceFilter = useDebounce(filter);

    useEffect(() => {
        if (omittedInit) handleSearch(1, debounceFilter);
        else setOmittedInit(true);
    }, [debounceFilter]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!!options && dropDownRef && !dropDownRef.current.contains(e.target) && e.target.id !== "filter-text-input") closeDropdown();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown, options]);

    const handleScroll = async () => {
        if (isLoading) return;
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (parseInt(scrollTop + clientHeight) === scrollHeight && meta.next) {
                handleToggleIsLoading(true);
                await handleSearch(meta.page + 1, debounceFilter.trim());
                handleToggleIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        switch (e.key) {
            case "Escape":
                closeDropdown();
                break;
            case "Enter":
                if (options?.length === 1) {
                    handleSelection(options[0]);
                }
                break;
            default:
                break;
        }
    };

    const handleSelection = (item) => {
        handleChangeSelected(item);
        closeDropdown();
    };

    if (options === null) return <div className="dropdown error">Error occurred while fetching data</div>;
    if (options?.length === 0) return <div className="dropdown no-data">No data to display</div>;

    return (
        <div ref={dropDownRef} className="dropdown">
            <div className="filter-container">
                <input
                    className="dropdown-input"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={filterPlaceholder}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
            </div>
            <ul ref={scrollRef} className="dropdown-list" onScroll={handleScroll}>
                {options?.map((o) => (
                    <li key={o.value} className={selected?.label === o.label ? "selected" : ""} onClick={() => handleSelection(o)}>
                        <p>{o.label}</p>
                    </li>
                ))}
                {isLoading && (
                    <div className={`loading-list-item ${!options || options.length === 0 ? "empty-options" : ""}`}>
                        <Oval width="50" />
                    </div>
                )}
            </ul>
        </div>
    );
};

CustomDropdown.propTypes = {
    placeholder: PropTypes.string,
    filterPlaceholder: PropTypes.string,

    handleChangeSelected: PropTypes.func,
    handleSearch: PropTypes.func,

    clearable: PropTypes.bool,

    selected: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
    }),

    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })
    ),
    meta: PropTypes.shape({
        next: PropTypes.string,
        page: PropTypes.number,
    }),
};
