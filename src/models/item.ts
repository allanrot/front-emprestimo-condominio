export class Item {
  _id: string;
  name: string;
  description: string;
  available: boolean;
  rentPricing: number;
  userId: string;
  loading: boolean;

  constructor(item: Item) {
    this._id = item._id;
    this.name = item.name;
    this.description = item.description;
    this.available = item.available;
    this.rentPricing = item.rentPricing ?? 0;
    this.userId = item.userId;
    this.loading = item.loading;
  }
}
