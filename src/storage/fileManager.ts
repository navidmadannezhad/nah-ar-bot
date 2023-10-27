require('dotenv').config()

import { writeFile, readFile, stat } from "fs/promises"
import source from "../../source";
import { ErrorMode } from "../types";

export const createStorageFile = async () => {
    try{
        await writeFile(process.env.STORAGE_FILE_PATH as any, JSON.stringify(source), { flag: "w" });
    }catch(e){
        console.log(e)
        throw new Error(ErrorMode.CREATE_STORAGE_FILE)
    }
}

export const retrieveStorageFile = async () => {
    try{
        const data = await readFile(process.env.STORAGE_FILE_PATH as any);
        return JSON.parse(data.toString());
    }catch(e){
        throw new Error(ErrorMode.RETRIEVE_STORAGE_FILE)
    }
}

export const updateFileStorage = async (data: any) => {
    try{
        await writeFile(process.env.STORAGE_FILE_PATH as any, JSON.stringify(data), { flag: "w" });
    }catch(e){
        throw new Error(ErrorMode.UPDATE_STORAGE_FILE)
    }
}

export const configureStorageFile = async () => {
    let storageStat = await stat(process.env.STORAGE_FILE_PATH as any);
    if(!storageStat.isFile){
        try{
            await createStorageFile();
        }catch(e){
            return console.log(e);
        }
    }
}