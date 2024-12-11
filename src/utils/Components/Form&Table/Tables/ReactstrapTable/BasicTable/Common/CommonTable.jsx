import { Table } from "reactstrap";

const CommonTable = ({
  tableClass,
  strip,
  caption,
  size,
  hover,
  headClass,
  headRowClass,
  headData,
  children,
}) => {
  return (
    <div
      className={`table-responsive custom-scrollbar ${
        tableClass ? tableClass : ""
      }`}
    >
      <Table striped={strip} hover={hover} size={size}>
        {caption && <caption>{caption}</caption>}
        <thead className={headClass}>
          <tr className={headRowClass}>
            {headData.map((head) => (
              <th key={head.id} scope="col">
                {head.head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </Table>
    </div>
  );
};

export default CommonTable;
