import { useState } from 'react';

const useFileLoader = () => {
  const [file, setFile] = useState<string | null>(null);

  const loadFile = (newFile: File) => {
    if (!newFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onloadend = (e) => {
      setFile(e.target?.result as string);
    };
  };
  return { file, loadFile };
};
export default useFileLoader;
