import { Mix_Layout } from "@/Constant/constant";
import BgLight from "./BgLight";
import BgDark from "./BgDark";
import { useAppDispatch } from "@/Redux/Hooks";
import ConfigDB from "@/Config/ThemeConfig";
import { setMixBackgroundLayout } from "@/Redux/Reducers/ThemeCustomizerSlice";
import BgSidebar from "./BgSidebar";
import { setDarkMode } from "@/Redux/Reducers/LayoutSlice";

const MixLayoutComponent = () => {
  const dispatch = useAppDispatch();
  const mixLayout = ConfigDB.data.color.mix_background_layout;

  const addMixBackgroundLayout = (mix_background_layout) => {
    ConfigDB.data.color.mix_background_layout = mix_background_layout;
    dispatch(setMixBackgroundLayout(mix_background_layout));
  };

  const handleCustomizerMix_Background = (value) => {
    addMixBackgroundLayout(value);
    if (value === "dark-sidebar") {
      document.body.classList.add("dark-sidebar");
      document.body.classList.remove("light-only");
      document.body.classList.remove("dark-only");
      dispatch(setDarkMode(false));
    } else if (value === "dark-only") {
      document.body.classList.remove("dark-sidebar");
      document.body.classList.add("dark-only");
      document.body.classList.remove("light-only");
      dispatch(setDarkMode(true));
    } else if (value === "light-only") {
      document.body.classList.remove("dark-only");
      document.body.classList.remove("dark-sidebar");
      document.body.classList.add("light-only");
      dispatch(setDarkMode(false));
    }
  };
  return (
    <>
      <h6>{Mix_Layout}</h6>
      <ul className="layout-grid customizer-mix">
        <BgLight
          mixLayout={mixLayout}
          handleCustomizerMix_Background={handleCustomizerMix_Background}
        />
        <BgSidebar
          mixLayout={mixLayout}
          handleCustomizerMix_Background={handleCustomizerMix_Background}
        />
        <BgDark
          mixLayout={mixLayout}
          handleCustomizerMix_Background={handleCustomizerMix_Background}
        />
      </ul>
    </>
  );
};

export default MixLayoutComponent;
