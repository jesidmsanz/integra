import { DarkLayout } from "@/Constant/constant";
import { DarkColorData } from "@/Data/Layout/LayoutData";
import { useAppDispatch } from "@/Redux/Hooks";
import { setDarkMode } from "@/Redux/Reducers/LayoutSlice";

const ColorDarkLayout = () => {
  const dispatch = useAppDispatch();
  const handleColor = (data) => {
    dispatch(setDarkMode(true));
    document.documentElement.style.setProperty("--theme-default", data.primary);
    document.documentElement.style.setProperty(
      "--theme-secondary",
      data.secondary
    );
  };
  return (
    <>
      <h6>{DarkLayout}</h6>
      <ul className="layout-grid customizer-color flex-row dark">
        {DarkColorData.map((data, i) => (
          <li
            className="color-layout"
            data-attr={`color-${i + 1}`}
            data-primary={data.primary}
            onClick={() => handleColor(data)}
            key={i}
          >
            <div></div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ColorDarkLayout;
