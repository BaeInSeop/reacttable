import logo from "./logo.svg";
import "./App.css";
import Tables from "./components/Tables";
import Example from "./Example";
import DragDrop from "./components/DragDrop";
import ResizeSample from "./components/ResizeSample";

import sample from "./folderFiles/sample.json";
import { useEffect, useState } from "react";
import FolderPath from "./components/FolderPath";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [folderPath, setFolderPath] = useState(sample.home.folderPath);
  const [files, setFiles] = useState(sample.home.files);

  useEffect(() => {
    console.log("folderPath : ", folderPath);

    if (folderPath) {
      switch (folderPath) {
        case "home":
          return setFiles(sample.home.files);

        case "home/bis/":
          return setFiles(sample.bis.files);
      }
    }
  }, [folderPath]);

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <div className="folderPath">
          <FolderPath folderPath={folderPath} setFolderPath={setFolderPath} />
        </div>
        <DragDrop
          files={files}
          setFiles={setFiles}
          folderPath={folderPath}
          setFolderPath={setFolderPath}
        />
      </DndProvider>
    </div>
  );
}

export default App;
