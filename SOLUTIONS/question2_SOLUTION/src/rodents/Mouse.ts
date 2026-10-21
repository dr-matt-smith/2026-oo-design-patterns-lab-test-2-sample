export class Mouse {
  private weightGrams: number = 0;

  public getWeightGrams(): number {
    return this.weightGrams;
  }

  public setWeightGrams(weightGrams: number): void {
    this.weightGrams = weightGrams;
  }
}
