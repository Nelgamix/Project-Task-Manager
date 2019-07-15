import {UserRole} from "../../schemas/User";
import {ValidationError} from "../common";

interface ValidationCondition {
  valid: boolean;
  message: string;
}

function validate(obj: any, conditions: ValidationCondition[]): ValidationError | undefined {
  for (const condition of conditions) {
    if (!condition.valid) {
      return {
        error: condition.message,
        object: obj,
      };
    }
  }
}

export function validateName(name: string): ValidationError | undefined {
  return validate(name, [
    {
      valid: name.length > 3 && name.length < 20,
      message: 'Name must be at least 3 characters long and less than 20 characters',
    }
  ]);
}

export function validateDisplayName(displayName: string): ValidationError | undefined {
  return validate(name, [
    {
      valid: displayName.length > 3 && displayName.length < 20,
      message: 'Display name must be at least 3 characters long and less than 20 characters',
    }
  ]);
}

export function validateEmail(email: string): ValidationError | undefined {
  return validate(name, [
    {
      valid: email.length > 3 && email.length < 20,
      message: 'Email must be at least 3 characters long and less than 20 characters',
    }
  ]);
}

export function validateImage(image: string): ValidationError | undefined {
  return undefined;
}

export function validateRole(role: UserRole): ValidationError | undefined {
  return undefined;
}
