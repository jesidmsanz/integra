import { Fragment } from "react";
import { CardHeader } from "reactstrap";

export const CommonCardHeader = ({
  headClass,
  title,
  subTitle,
  titleClass,
  users,
  icon,
}) => {
  return (
    <CardHeader className={headClass ? headClass : ""}>
      {title && (
        <h4 className={`${titleClass ? titleClass : ""}`}>
          {icon && icon}
          {title}
        </h4>
      )}
      {users && <span>{users?.length} Contacts</span>}
      {subTitle && (
        <p className="f-m-light mt-1">
          {subTitle.map((data, index) => (
            <Fragment key={index}>
              {data?.text}{" "}
              {data.code && <code className="f-12">{data.code}</code>}
            </Fragment>
          ))}
        </p>
      )}
    </CardHeader>
  );
};
