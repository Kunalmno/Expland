export default class InventoryManager {
  constructor(maxSlots = 12, hotbarSlots = 6) {
    this.maxSlots = maxSlots;
    this.hotbarSlots = hotbarSlots;
    this.items = new Array(maxSlots).fill(null); // full inventory
    this.selectedHotbarIndex = 0; // hotbar selection
    this.onInventoryChange = null; // callback to update UI
  }

  addItem(itemData) {
    const emptyIndex = this.items.findIndex((slot) => slot === null);
    if (emptyIndex === -1) throw new Error("Inventory full!");

    this.items[emptyIndex] = itemData;

    console.log("Inventory updated:", this.items); // ✅ Debug
    if (this.onInventoryChange) this.onInventoryChange(this.items);
  }

  removeItem(index) {
    this.items[index] = null;
    if (this.onInventoryChange) this.onInventoryChange(this.items);
  }

  selectHotbarIndex(index) {
    if (index >= 0 && index < this.hotbarSlots) {
      this.selectedHotbarIndex = index;
      if (this.onInventoryChange) this.onInventoryChange(this.items);
    }
  }

  getSelectedItem() {
    return this.items[this.selectedHotbarIndex];
  }
}
