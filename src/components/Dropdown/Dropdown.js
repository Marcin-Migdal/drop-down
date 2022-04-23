import "./Dropdown.css";

export const Dropdown = ({ options }) => {
    return (
        <div className="dropdown-container">
            <ul>
                {options.map((o) => (
                    <li key={o.url}>{o.name}</li>
                ))}
            </ul>
        </div>
    );
};
