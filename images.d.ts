/** biome-ignore-all lint/suspicious/noExplicitAny: Image import */
declare module "*.png" {
  const value: any;
  export default value;
}
