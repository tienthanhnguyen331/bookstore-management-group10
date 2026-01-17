function EditableProfileField({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    fullWidth = false,
}) {
    return (
        <div className={fullWidth ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                placeholder={placeholder}
            />
        </div>
    );
}

export default EditableProfileField;
