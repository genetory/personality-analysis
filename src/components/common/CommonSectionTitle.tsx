interface CommonSectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function CommonSectionTitle({ 
  title, 
  subtitle, 
  className = "" 
}: CommonSectionTitleProps) {
  return (
    <div className={`text-left mb-8 ${className}`}>
      <h2 className="text-xl font-bold text-black mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-md text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
