export type TestingType = "component" | "e2e";
export type SpecType = "component" | "integration";

export type CypressResult =
  | CypressCommandLine.CypressRunResult
  | CypressCommandLine.CypressFailedRunResult;
export type Platform = {
  osName: string;
  osVersion: string;
  browserName: string;
  browserVersion: string;
};
export interface FindSpecs<T> {
  projectRoot: string;
  testingType: TestingType;
  /**
   * This can be over-ridden by the --spec argument (run mode only)
   * Otherwise it will be the same as `configSpecPattern`
   */
  specPattern: T;
  /**
   * The specPattern resolved from e2e.specPattern or component.specPattern
   * inside of `cypress.config`.
   */
  configSpecPattern: T;
  /**
   * User can opt to exclude certain patterns in cypress.config.
   */
  excludeSpecPattern: T;
  /**
   * If in component testing mode, we exclude all specs matching the e2e.specPattern.
   */
  additionalIgnorePattern: T;
}

export interface BaseSpec {
  name: string;
  relative: string;
  absolute: string;
}

export interface SpecFile extends BaseSpec {
  baseName: string;
  fileName: string;
}

export interface FoundSpec extends SpecFile {
  specFileExtension: string;
  fileExtension: string;
  specType: SpecType;
}

export interface SpecWithRelativeRoot extends FoundSpec {
  relativeToCommonRoot: string;
}
