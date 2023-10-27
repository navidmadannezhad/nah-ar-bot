export const enum ServiceIndetifier{
    DRINK="drink",
    COOK="cook"
}

export interface ServiceData {
    identifier: ServiceIndetifier;
    name: string;
    interval: string;
    list: string[];
    order: number;
    active: boolean;
}

export const enum ErrorMode{
    CREATE_STORAGE_FILE="Storage File Creation Failed",
    RETRIEVE_STORAGE_FILE="Storage File Retrieve Failed",
    UPDATE_STORAGE_FILE="Storage File Update Failed",

    SERVICE_ENABLE_FAILED="Service Enable Failed",
    SERVICE_DISABLE_FAILED="Service Disable Failed"
}

export const enum SuccessMode{
    SERVICE_ENABLED="Service Enabled Successfuly",
    SERVICE_DISABLED="Service Disabled Successfuly"
}

export interface SessionType {
    selectedService: ServiceIndetifier;
}