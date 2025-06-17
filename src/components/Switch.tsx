import { ChangeEvent, HTMLProps, memo } from 'react';

interface SwitchProps extends HTMLProps<HTMLInputElement> {
  initialState?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isOn?: boolean;
}

const Switch: React.FC<SwitchProps> = (props: SwitchProps) => {
  const { isOn, onChange, ...rest } = props;
  return (
    <label
      className={`shadow-checkbox  relative my-auto w-16 max-w-[62px] h-8 rounded-[32px] cursor-pointer transition-colors ${
        isOn ? 'bg-green-500' : 'bg-gray-50'
      } ${props.disabled ? 'bg-gray-300 opacity-50' : ''}`}
    >
      <input
        {...rest}
        type="checkbox"
        onChange={props.disabled ? () => {} : onChange}
        className="hidden"
      />
      <span
        className={`transform absolute top-1 left-1 w-6 h-6 rounded-full bg-gray-400 transition-transform ${
          isOn ? 'translate-x-7' : ''
        }`}
      />
    </label>
  );
};

export default memo(Switch);
