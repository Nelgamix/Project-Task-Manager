export interface ValidationError {
  error: string;
  object?: any;
}

export enum ManipulationErrorType {
  NotFound,
  NotValidated,
  NotSaved,
}

export interface ManipulationError {
  type: ManipulationErrorType;
  error?: string;
}

export interface ManipulationResult {
  success: boolean;
  result?: any; // if success = true
  error?: ManipulationError; // if success = false
}

export function createManipulationResultSuccess(result?: any): ManipulationResult {
  return {
    success: true,
    result,
  };
}

export function createManipulationResultFail(error: ManipulationError): ManipulationResult {
  return {
    success: false,
    error,
  };
}

export function diff(
    arrayRef: any[],
    arrayDiff: any[],
    findFn: (arr: any[], e: any) => number,
    updateFn: (model: any, update: any) => boolean
) {
  const objectsToCreate = arrayDiff.slice();
  const objectsToDelete = [];
  const objectsToUpdate = [];
  const objectsToUpdateTmp = [];

  let tmp;
  // eg: ref: [1], diff: [1, 2, 3]
  for (const e of arrayRef) {
    tmp = findFn(objectsToCreate, e);
    if (tmp >= 0) {
      objectsToUpdateTmp.push([e, objectsToCreate[tmp]]);
      objectsToCreate.splice(tmp, 1);
    }

    objectsToDelete.push(e);
  }

  let changed;
  for (const objectToUpdate of objectsToUpdateTmp) {
    changed = updateFn(objectToUpdate[0], objectToUpdate[1]);
    if (changed) {
      objectsToUpdate.push(objectToUpdate[0]);
    }
  }

  return [objectsToCreate, objectsToUpdate, objectsToDelete];
}
