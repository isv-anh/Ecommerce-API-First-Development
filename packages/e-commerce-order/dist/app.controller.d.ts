import { AppService } from './app.service.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    placeOrder(data: any): any;
    getOrder(data: any): any;
    cancelOrder(data: any): any;
}
