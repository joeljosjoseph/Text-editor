import { useState } from "react";
import CustomEditor from "./components/CustomEditor";
import { Toaster } from "react-hot-toast";

function App() {
  const [saveClicked, setSaveClicked] = useState(false);

  const handleSaveClick = () => {
    setSaveClicked(true);
  };
  return (
    <div className="py- 4 lg:py-12">
      <Toaster />
      <div className="w-full flex justify-between p-4 lg:px-24">
        {/* Empty div for alignment  */}
        <div className="hidden lg:flex"></div>
        <p className="text-xl font-bold">Demo editor by Joel Jos Joseph</p>
        <button
          onClick={handleSaveClick}
          className="px-4 py-1 border-2 border-black rounded-md font-medium hover:bg-black hover:text-white transition-all ease duration-300"
        >
          Save
        </button>
      </div>
      <div className="p-4 lg:px-24 min-h-[90vh] h-full">
        <CustomEditor
          saveClicked={saveClicked}
          setSaveClicked={setSaveClicked}
        />
      </div>
    </div>
  );
}

export default App;
