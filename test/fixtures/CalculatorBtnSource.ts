export default `
import { jsx } from "react/jsx-runtime";
import styles from "./btn.module.scss";
import classNames from "classnames";
export default function CalculatorBtn(props) {
  const className = classNames({
    [styles.btn]: true,
    [styles.darker]: props.darker,
    [styles.bolder]: props.bolder,
    [styles.larger]: props.larger,
    [styles.smaller]: props.smaller,
    [styles.submit]: props.submit,
    [styles.disabled]: props.disabled
  });
  return /* @__PURE__ */ jsx("div", { className, onClick: props.onClick, "data-testid": props["data-testid"], children: props.children });
}
`;
