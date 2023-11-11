import { ServiceData, ServiceIndetifier } from "./src/types";
import { COOK_LIST, DRINK_LIST } from "./volunteer";


const source: ServiceData[] = [
    {
        identifier: ServiceIndetifier.DRINK,
        name: "سرویس دهنده نوشیدنی",
        interval: "1",
        list: DRINK_LIST,
        order: 0,
        active: true,
    },
    {
        identifier: ServiceIndetifier.COOK,
        name: "سرویس دهنده گرمکن",
        interval: "1",
        list: COOK_LIST,
        order: 0,
        active: true,
    }
]

export default source;