import React, { HTMLProps } from "react";

interface LabelProps<T extends keyof HTMLElementTagNameMap>
  extends HTMLProps<HTMLElementTagNameMap[T]> {
  className?: string;
  component?: T;
}

const Label = function <T extends keyof HTMLElementTagNameMap>(
  props: React.PropsWithChildren<LabelProps<T>>
) {
  const { className, component, ...rest } = props;
  return React.createElement(
    component ?? "label",
    {
      className: `text-gray-1000 dark:text-gray-300 ${className}`,
      ...rest,
    },
    props.children
  );
};

export default React.memo(Label);
