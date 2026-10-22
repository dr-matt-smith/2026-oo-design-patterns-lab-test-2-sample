export class ShoppingList {
    private name: string = 'party';
    private list: string[] = ["bread", "eggs", "milk"];
    private lastError: string = 'none';

    constructor(name: string) {
        this.setName(name);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): boolean {
        if(name === ''){
            this.lastError = 'empty name given';
            return false;
        }

        this.name = name;
        return true;
    }

    public getList(): string[] {
        return this.list;
    }

    public getNumItems(): number {
        return this.list.length;
    }
    public removeAllItems(): void {
        this.list = [];
    }

    public getFirstItem(): string {
        return this.list[0];
    }

    public getLastError(): string {
        return this.lastError;
    }
    
    public addToList(item: string): void {
        if(item === ''){
            this.lastError = 'empty item name';
            return;
        }
        this.list.push(item);
    }
}