/** Something that can run on electric power alone, for some distance. */
export interface ElectricHybrid {
  /**
   * Gets how far it can go on electric power alone.
   * @returns the electric range, in kilometres
   */
  getElectricRange(): number;
}
