import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

type Files ={
    files: File[];
}

type FileContextType ={
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
    const context = useContext(FileContext);
    if (!context) throw new Error('useFileContext must be used within a FileProvider');
    return context;
}

type FileProviderProps = {
    children: ReactNode;
}

export const FileProvider = ({children}: FileProviderProps) =>{
    const [files, setFiles] = useState<File[]>([]);
    return(
        <FileContext.Provider value={{files, setFiles}}>
            {children}
        </FileContext.Provider>
    )
}
// // FileContext.tsx
// import React, { createContext, useContext, useState } from 'react';

// interface FileContextProps {
// files: File[];
// setFiles: React.Dispatch<React.SetStateAction<File[]>>;
// }

// export const FileContext = createContext<FileContextProps | undefined>(undefined);

// interface FileProviderProps {
// children: React.ReactNode;
// }

// export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
// const [files, setFiles] = useState<File[]>([]);

// return (
// <FileContext.Provider value={{ files, setFiles }}>
//     {children}
// </FileContext.Provider>
// );
// };
