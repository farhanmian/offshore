const IncludesText: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <p
      className={`text-sm font-bold ${
        color ? color : "text-green-500"
      } justify-self-end`}
    >
      Added
    </p>
  );
};

export default IncludesText;
