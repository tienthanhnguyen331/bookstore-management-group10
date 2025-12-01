function Logo({ onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-2 hover:cursor-pointer"
        >
            <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                {/* <BookOpen className="w-5 h-5 text-white" /> */}
            </div>
            <span className="text-blue-400 tracking-wide">BOOKSTORE</span>
        </div>
    );
}

export default Logo;
