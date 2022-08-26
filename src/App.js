import logo from "./logo.svg";
import "./App.css";
import Tables from "./components/Tables";
import Example from "./Example";
import DragDrop from "./components/DragDrop";
import ResizeSample from "./components/ResizeSample";

import jsonSample from "./folderFiles/sample.json";
import { useEffect, useState } from "react";
import FolderPath from "./components/FolderPath";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [sample, setSample] = useState(jsonSample);
  const [folderPath, setFolderPath] = useState(sample.home.folderPath);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setSample(jsonSample);
  }, []);

  useEffect(() => {
    if (!folderPath) {
      setFolderPath(sample.home.folderPath);
    } else {
      console.log("파일 세팅");
      setFiles(sample[folderPath].files);
    }
  }, [sample]);

  useEffect(() => {
    console.log("folderPath : ", folderPath);
    if (folderPath) {
      switch (folderPath) {
        case "home":
          return setFiles(sample.home.files);

        case "home/bis/":
          return setFiles(sample.bis.files);

        default:
          return setFiles([]);
      }
    }
  }, [folderPath]);

  // useEffect(() => {
  //   let tempFiles = [];

  //   if (folderPath) {
  //     switch (folderPath) {
  //       case "home":
  //         tempFiles = sample.home.files;
  //         break;

  //       case "home/bis/":
  //         tempFiles = sample.bis.files;
  //         break;
  //     }
  //   }

  //   console.log("files : ", tempFiles);
  //   setSample(tempFiles);
  // }, [folderPath, sample]);

  useEffect(() => {
    console.log("Result files : ", files);
  }, [files]);

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
          sample={sample}
          setSample={setSample}
        />
      </DndProvider>
    </div>
  );
}

export default App;
