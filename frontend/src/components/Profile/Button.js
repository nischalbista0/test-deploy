const Button = ({ btnName, activeButton, handleButtonClick }) => {
  return (
    <button
      className={`${
        activeButton === btnName
          ? "text-white bg-gray-700"
          : "bg-none"
      } font-semibold text-sm px-2 py-1 rounded-[2px] sm:px-4 sm:text-base sm:min-w-[90px]`}
      onClick={() => handleButtonClick(btnName)}
    >
      {btnName}
    </button>
  );
};

export default Button;
