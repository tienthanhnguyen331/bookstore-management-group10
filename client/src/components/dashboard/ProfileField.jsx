function ProfileField({ label, value, fullWidth = false }) {
    return (
        <div className={fullWidth ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="px-4 py-2 bg-gray-200 border border-gray-200 rounded text-gray-900">
                {value}
            </div>
        </div>
    );
}

export default ProfileField;
