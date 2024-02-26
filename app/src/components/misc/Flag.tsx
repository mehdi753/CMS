import { LANGUAGE } from "../../@types/language";
import "./flags.scss";

interface Props {
  country: LANGUAGE;
  className?: string;
}

export function Flag({ country, className }: Props) {
  return (
    <span
      className={
        `flag flag-${country.toLocaleLowerCase()} flag-lang ` + className || ""
      }
    />
  );
}

Flag.displayName = "Flag";
