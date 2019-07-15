import {InstanceType} from "typegoose";
import {User, UserRole} from "../../schemas/User";
import {ValidationError} from "../common";
import {validateDisplayName, validateEmail, validateImage, validateName, validateRole} from "./validators";

export function update(user: InstanceType<User>, object: any, existing: boolean): ValidationError | undefined {
  let error: ValidationError | undefined;

  if (!error) error = updateName(user, object.name, existing);
  if (!error) error = updateDisplayName(user, object.displayName, existing);
  if (!error) error = updateEmail(user, object.email, existing);
  if (!error) error = updateImage(user, object.image, existing);

  return error;
}

export function updateName(
    user: InstanceType<User>,
    name: string,
    existing: boolean
): ValidationError | undefined {
  if (existing && name !== undefined) {
    const validation = validateName(name);

    if (validation) {
      return validation;
    }
  } else { // New user
    if (name === undefined) {
      return {
        error: 'Name must be specified',
      };
    }

    const validation = validateName(name);

    if (validation) {
      return validation;
    }
  }

  user.name = name;
}

export function updateDisplayName(
    user: InstanceType<User>,
    displayName: string,
    existing: boolean
): ValidationError | undefined {
  if (existing && displayName !== undefined) {
    const validation = validateDisplayName(displayName);

    if (validation) {
      return validation;
    }
  } else { // New user
    if (displayName === undefined) {
      user.displayName = user.name;
      return undefined;
    }

    const validation = validateDisplayName(displayName);

    if (validation) {
      return validation;
    }
  }

  user.displayName = displayName;
}

export function updateEmail(
    user: InstanceType<User>,
    email: string,
    existing: boolean
): ValidationError | undefined {
  if (existing && email !== undefined) {
    const validation = validateEmail(email);

    if (validation) {
      return validation;
    }
  } else { // New user
    if (email === undefined) {
      return undefined;
    }

    const validation = validateEmail(email);

    if (validation) {
      return validation;
    }
  }

  user.email = email;
}

export function updateImage(
    user: InstanceType<User>,
    image: string,
    existing: boolean
): ValidationError | undefined {
  if (existing && image !== undefined) {
    const validation = validateImage(image);

    if (validation) {
      return validation;
    }
  } else { // New user
    if (image === undefined) {
      return undefined;
    }

    const validation = validateImage(image);

    if (validation) {
      return validation;
    }
  }

  user.image = image;
}

export function updateRole(
    user: InstanceType<User>,
    role: UserRole,
    existing: boolean
): ValidationError | undefined {
  if (existing && role !== undefined) {
    const validation = validateRole(role);

    if (validation) {
      return validation;
    }
  } else { // New user
    if (role === undefined) {
      return undefined;
    }

    const validation = validateRole(role);

    if (validation) {
      return validation;
    }
  }

  user.role = role;
}
