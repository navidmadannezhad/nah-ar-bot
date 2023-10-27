import { ServiceData, ServiceIndetifier } from "./src/types";


const source: ServiceData[] = [
    {
        identifier: ServiceIndetifier.DRINK,
        name: "سرویس دهنده نوشیدنی",
        interval: "1",
        list: [
            '1',
            '1',
            '1',
            '1',
            '1',
            '1'
        ],
        order: 0,
        active: true,
    },
    {
        identifier: ServiceIndetifier.COOK,
        name: "سرویس دهنده گرمکن",
        interval: "1",
        list: [
            '1',
            '1',
            '1',
            '1',
            '1',
            '1'
        ],
        order: 0,
        active: true,
    }
]

export default source;