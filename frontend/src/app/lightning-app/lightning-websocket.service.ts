import { Injectable } from '@angular/core';
// Lightning has its own request-based graph data; the Bitcoin socket is deliberately absent.
@Injectable()
export class LightningWebsocketService { want(_topics: string[]): void {} }
