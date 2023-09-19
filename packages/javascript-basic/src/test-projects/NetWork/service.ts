import { sendGetRequest } from "../../libs/request";

export const getImg = (url: string) =>
    sendGetRequest<any>({
        url,
    });
