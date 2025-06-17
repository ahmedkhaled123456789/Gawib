import React, { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  loading?: boolean;
  ButtonStyles?: string;
  textStyles?: string;
  title?: string;
  icon?: ReactNode; // Add the icon prop
}

const Button: React.FC<IButtonProps> = props => {
  const { loading, ButtonStyles, textStyles, title, icon, ...rest } = props;

  return (
    <button {...rest} className={`relative ${ButtonStyles} overflow-hidden focus:outline-none`}>
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center gap-1 ${textStyles}`}>
          <span className={textStyles}>جار التحميل...</span>
          <FaSpinner className="animate-spin" />
        </div>
      )}
      <span
        className={`${textStyles || ''} ${loading ? 'opacity-0' : 'opacity-100'} ${icon ? 'flex items-center gap-2' : ''}`}
      >
        {icon && !loading && <span className="icon">{icon}</span>}
        {title}
      </span>
    </button>
  );
};

export default React.memo(Button);
