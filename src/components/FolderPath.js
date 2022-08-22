import React, { useEffect, useState } from "react";

const FolderPath = ({ folderPath, setFolderPath }) => {
  //   const [folderList, setFolderList] = useState([folderPath.sp]);
  const [folderList, setFolderList] = useState([folderPath]);

  useEffect(() => {
    if (folderPath) {
      setFolderList(folderPath.split("/"));
    }
  }, [folderPath]);

  useEffect(() => {
    console.log("folderList : ", folderList);
  }, [folderList]);

  return (
    <>
      {0 < folderList.length &&
        folderList.map(
          (item) =>
            "" !== item && (
              <span onClick={(e) => setFolderPath(item)}>{` ${item} /`}</span>
            )
        )}
    </>
  );
};

export default FolderPath;
