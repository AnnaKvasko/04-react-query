import type { ReactNode } from "react";
import css from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  message?: string;
  children?: ReactNode;
};

export default function ErrorMessage({ message, children }: ErrorMessageProps) {
  return (
    <p className={css.text}>
      {message ?? children ?? "There was an error, please try again..."}
    </p>
  );
}
