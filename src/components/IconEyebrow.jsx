function IconEyebrow({ icon, text }) {
  return (
    <div
      className="text-white text-sm font-medium px-3 py-1.5 border border-[#574286] self-start rounded-full flex flex-row gap-1 items-center"
      style={{
        background:
          "linear-gradient(94.97deg, #E5C2EF 3.47%, #D5D9FC 104.46%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {icon}
      <h3>{text}</h3>
    </div>
  );
}

export default IconEyebrow;
