// Nút bấm chuẩn style
const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className="px-4 py-2 rounded" {...props}>
      {children}
    </button>
  );
};

export default Button;