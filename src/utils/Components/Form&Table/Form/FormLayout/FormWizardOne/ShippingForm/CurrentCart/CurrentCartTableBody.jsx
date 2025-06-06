import { ImagePath } from "@/Constant/constant";
import { CurrentCartData } from "@/Data/Form&Table/Form/FormData";
import Image from "next/image";

const CurrentCartTableBody = () => {
  return (
    <tbody>
      {CurrentCartData.map((data, index) => (
        <tr key={index}>
          <td>
            <Image priority width={46} height={50} src={`${ImagePath}/${data.imagePath}`} alt="t-shirt"/>
          </td>
          <td>
            <div >
              <h6>{data.productName}</h6>
              <span>{data.productSum}</span>
            </div>
          </td>
          <td>
            <p>{data.price}</p>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default CurrentCartTableBody;
