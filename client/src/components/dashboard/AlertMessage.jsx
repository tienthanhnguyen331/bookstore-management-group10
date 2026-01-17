function AlertMessage({ type = "success", message }) {
    if (!message) return null;

    const styles = {
        success: "bg-green-50 border-green-200 text-green-700",
        error: "bg-red-50 border-red-200 text-red-700",
    };

    return (
        <div className={`mb-4 border px-4 py-3 rounded ${styles[type]}`}>
            {message}
        </div>
    );
}

export default AlertMessage;
