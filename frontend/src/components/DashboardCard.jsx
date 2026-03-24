function DashboardCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="bg-white border-0 shadow-sm rounded-2xl h-full p-3">
      <div className="flex items-center gap-3">
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: "50px",
            height: "50px",
            background: iconBg,
            color: iconColor,
          }}
        >
          <i className={icon}></i>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="font-bold mb-1">{value}</h3>
          <p className="text-sm mb-0">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;