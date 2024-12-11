import { configureStore } from "@reduxjs/toolkit";
import HeaderBookmarkSlice from "./Reducers/HeaderBookmarkSlice";
import LayoutSlice from "./Reducers/LayoutSlice";
import ChatSlice from "./Reducers/ChatSlice";
import ContactSlice from "./Reducers/ContactSlice";
import TaskSlice from "./Reducers/TaskSlice";
import ToDoSlice from "./Reducers/ToDoSlice";
import FormWizardTwoSlice from "./Reducers/FormLayout/FormWizardTwoSlice";
import NumberingWizardSlice from "./Reducers/FormLayout/NumberingWizardSlice";
import TwoFactorSlice from "./Reducers/FormLayout/TwoFactorSlice";
import StudentWizardSlice from "./Reducers/FormLayout/StudentWizardSlice";
import VerticalWizardSlice from "./Reducers/FormLayout/VerticalWizardSlice";
import ThemeCustomizerSlice from "./Reducers/ThemeCustomizerSlice";
import ProductSlice from "./Reducers/ProductSlice";

const Store = configureStore({
  reducer: {
    headerBookMark: HeaderBookmarkSlice,
    layout: LayoutSlice,
    chat: ChatSlice,
    contact: ContactSlice,
    task: TaskSlice,
    todo: ToDoSlice,
    formWizardTwo: FormWizardTwoSlice,
    numberingWizard: NumberingWizardSlice,
    twoFactor: TwoFactorSlice,
    studentWizard: StudentWizardSlice,
    verticalWizard: VerticalWizardSlice,
    themeCustomizer: ThemeCustomizerSlice,
    product:ProductSlice,
  },
});

export default Store;

