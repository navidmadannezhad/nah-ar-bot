import { ServiceIndetifier } from "../types";
import { retrieveStorageFile, updateFileStorage } from "./fileManager";

export const updateInterval = async (serviceType: ServiceIndetifier, interval: string): Promise<void> => {
    const data = await retrieveStorageFile();
    data.filter((obj: any) => obj.identifier === serviceType)[0].interval = interval;
    await updateFileStorage(data);
}

export const updateOrder = async (serviceType: ServiceIndetifier, order: number): Promise<void> => {
    const data = await retrieveStorageFile();
    data.filter((obj: any) => obj.identifier === serviceType)[0].order = order;
    await updateFileStorage(data);
}

export const getServiceActivity = async (serviceType: ServiceIndetifier) => {
    const data = await retrieveStorageFile();
    return data.filter((obj: any) => obj.identifier === serviceType)[0].active;
}

export const disableService = async (serviceType: ServiceIndetifier): Promise<void> => {
    const data = await retrieveStorageFile();
    data.filter((obj: any) => obj.identifier === serviceType)[0].active = false;
    await updateFileStorage(data);
}

export const enableService = async (serviceType: ServiceIndetifier): Promise<void> => {
    const data = await retrieveStorageFile();
    data.filter((obj: any) => obj.identifier === serviceType)[0].active = true;
    await updateFileStorage(data);
}