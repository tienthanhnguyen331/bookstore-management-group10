export default function Spinner({ size = 16, className = "" }) {
    const px = `${size}px`;
    return (
        <div
            className={`inline-block border-2 border-blue-400 border-t-transparent rounded-full animate-spin ${className}`}
            style={{ width: px, height: px }}
            aria-label="Loading"
        />
    );
}
